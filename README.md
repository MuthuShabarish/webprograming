# Aetheria Voyages — Luxury Travel Platform

A multi-page luxury bespoke travel website built with modern HTML, CSS, JavaScript, React components, and PHP + MariaDB backend integration.

## ✨ Features
- **Responsive Multi-page Design**: Home, Destinations, Our Experience, and Inquire pages.
- **Dynamic JavaScript Interactions**: Currency converter, interactive destination filters & modals, wishlist/saved trips system, and animated stat counters.
- **PHP & MySQL (MariaDB) Backend**:
  - `schema.sql`: Database schema definition for `aetheria_voyages`.
  - `db.php`: PDO database connection.
  - `process-inquiry.php`: Secure prepared statements for validating and storing inquiries.
  - Asynchronous form submission with real-time toast feedback.

## 🚀 Setup & Local Development (XAMPP)

1. **Clone or Copy Repository**:
   Place the project into your XAMPP web root:
   ```
   C:\xampp\htdocs\webprograming
   ```

2. **Start Apache & MySQL**:
   Open XAMPP Control Panel and start **Apache** and **MySQL**.

3. **Import Database**:
   - Open phpMyAdmin at `http://localhost/phpmyadmin`.
   - Go to the **Import** tab.
   - Choose `schema.sql` and click **Import**.

4. **Run Application**:
   Navigate to:
   ```
   http://localhost/webprograming/index.html
   ```
   or contact form at:
   ```
   http://localhost/webprograming/contact.html
   ```
