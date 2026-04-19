<?php
$host = "sql111.infinityfree.com"; 
$user = "if0_41702193";            
$pass = "F9SmpAUkjpqXuX";           
$db   = "if0_12345678_portfolio_kontak"; 

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>
