<?php
ob_start();

$conn = new mysqli(
    "sql111.infinityfree.com",
    "if0_41702193",
    "F9SmpAUkjpqXuX",
    "if0_41702193_portfolio_kontak"
);

if ($conn->connect_error) {
    echo "error";
    exit;
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if ($name && $email && $message) {
    $stmt = $conn->prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)");

    if ($stmt) {
        $stmt->bind_param("sss", $name, $email, $message);

        if ($stmt->execute()) {
            echo "success";
        } else {
            echo "error";
        }

        $stmt->close();
    } else {
        echo "error";
    }
} else {
    echo "error";
}

$conn->close();

ob_end_flush();
?>
