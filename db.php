<?php
/**
 * db.php
 * Establishes a PDO connection to the local MariaDB/MySQL database.
 * Designed for beginner-friendly local development in XAMPP.
 */

$host    = '127.0.0.1'; // Localhost IPv4 avoids IPv6 DNS delays in local Windows/XAMPP
$db      = 'aetheria_voyages';
$user    = 'root';
$pass    = '';          // Default XAMPP MariaDB root password is empty
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on SQL errors
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Return associative arrays
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Use true prepared statements
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // If the database connection fails, return a clean error without exposing credentials
    http_response_code(500);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'status'  => 'error',
        'message' => 'Database connection failed. Please ensure MySQL is running in XAMPP and schema.sql has been imported into phpMyAdmin.'
    ]);
    exit;
}
