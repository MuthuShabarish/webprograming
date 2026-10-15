<?php
/**
 * process-inquiry.php
 * Handles travel inquiry form submissions from contact.html.
 * Validates inputs and inserts records into MariaDB using PDO prepared statements.
 */

// Include our database connection
require_once __DIR__ . '/db.php';

// Detect whether this is an AJAX/Fetch request expecting JSON
$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
       || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

// Only allow POST submissions
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if ($isAjax) {
        http_response_code(405);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'status'  => 'error',
            'message' => 'Method not allowed. Please submit the form via POST.'
        ]);
    } else {
        header('Location: contact.html');
    }
    exit;
}

// Retrieve and trim input fields
$firstName   = trim($_POST['first_name'] ?? '');
$lastName    = trim($_POST['last_name'] ?? '');
$email       = trim($_POST['email'] ?? '');
$phone       = trim($_POST['phone'] ?? '');
$destination = trim($_POST['destination'] ?? '');
$budget      = trim($_POST['budget'] ?? '');
$details     = trim($_POST['details'] ?? '');

// Server-side validation
$errors = [];

if (empty($firstName)) {
    $errors[] = 'First name is required.';
}

if (empty($lastName)) {
    $errors[] = 'Last name is required.';
}

if (empty($email)) {
    $errors[] = 'Email address is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address.';
}

if (empty($destination)) {
    $errors[] = 'Please select a destination.';
}

if (empty($budget)) {
    $errors[] = 'Please select an estimated budget tier.';
}

// If there are validation errors, send them back
if (!empty($errors)) {
    http_response_code(400);
    if ($isAjax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'status'  => 'error',
            'message' => 'Please correct the highlighted errors.',
            'errors'  => $errors
        ]);
    } else {
        echo '<h3>Form Submission Errors:</h3><ul>';
        foreach ($errors as $error) {
            echo '<li>' . htmlspecialchars($error, ENT_QUOTES, 'UTF-8') . '</li>';
        }
        echo '</ul><p><a href="contact.html">Back to Contact Form</a></p>';
    }
    exit;
}

// Insert into database using PDO prepared statement
try {
    $sql = "INSERT INTO inquiries (first_name, last_name, email, phone, destination, budget, details)
            VALUES (:first_name, :last_name, :email, :phone, :destination, :budget, :details)";

    $stmt = $pdo->prepare($sql);
    $executed = $stmt->execute([
        ':first_name'  => $firstName,
        ':last_name'   => $lastName,
        ':email'       => $email,
        ':phone'       => $phone !== '' ? $phone : null,
        ':destination' => $destination,
        ':budget'      => $budget,
        ':details'     => $details !== '' ? $details : null,
    ]);

    if ($executed) {
        if ($isAjax) {
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode([
                'status'  => 'success',
                'message' => 'Thank you, ' . $firstName . '! Your inquiry has been received. Our luxury travel concierge will contact you within 24 hours.'
            ]);
        } else {
            // Direct submission fallback
            echo '<h2>Inquiry Received</h2>';
            echo '<p>Thank you, ' . htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8') . '! Your travel inquiry has been saved.</p>';
            echo '<p><a href="contact.html">Return to site</a></p>';
        }
    } else {
        throw new Exception('Database execution failed.');
    }
} catch (Exception $e) {
    http_response_code(500);
    if ($isAjax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'status'  => 'error',
            'message' => 'An error occurred while saving your inquiry. Please try again.'
        ]);
    } else {
        echo '<h3>Error</h3><p>An error occurred while saving your inquiry. Please try again later.</p>';
        echo '<p><a href="contact.html">Back to Contact Form</a></p>';
    }
    exit;
}
