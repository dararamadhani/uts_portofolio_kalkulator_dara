<?php
$conn = new mysqli(
    "sql111.infinityfree.com",
    "if0_41702193",
    "F9SmpAUkjpqXuX",
    "if0_41702193_portfolio_kontak"
);
if ($conn->connect_error) {
    die(json_encode(["error" => $conn->connect_error]));
}
?>
