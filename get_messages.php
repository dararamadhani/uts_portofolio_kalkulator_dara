<?php
header('Content-Type: application/json');

// Konfigurasi koneksi database Laragon
$host = "localhost";
$user = "root";
$pass = "";
$db   = "portfolio_kontak";

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    echo json_encode([]);
    exit;
}

$query = "SELECT * FROM messages ORDER BY created_at DESC";
$result = mysqli_query($koneksi, $query);

$messages = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $messages[] = $row;
    }
}

echo json_encode($messages);

mysqli_close($koneksi);
?>