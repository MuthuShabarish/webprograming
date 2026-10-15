-- ============================================================================
-- Aetheria Voyages Database Schema
-- Compatible with MariaDB and MySQL (XAMPP default)
-- ============================================================================

-- Create database if it does not already exist
CREATE DATABASE IF NOT EXISTS `aetheria_voyages`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Select database
USE `aetheria_voyages`;

-- Table to store travel inquiries submitted from contact.html
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `destination` VARCHAR(100) NOT NULL,
  `budget` VARCHAR(50) NOT NULL,
  `details` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
