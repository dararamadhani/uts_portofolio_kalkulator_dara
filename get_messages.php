<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');

$koneksi = mysqli_connect(
    "sql111.infinityfree.com",
    "if0_41702193",
    "F9SmpAUkjpqXuX",
    "if0_41702193_portfolio_kontak"
);

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
