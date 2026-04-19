<?php
$conn = new mysqli("localhost", "root", "", "portfolio_kontak");

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>