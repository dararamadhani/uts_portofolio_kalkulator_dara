send_messages.php

<?php
$conn = new mysqli(
    "sql111.infinityfree.com",
    "if0_41702193",
    "F9SmpAUkjpqXuX",
    "if0_41702193_portfolio_kontak"
);

$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

if($name && $email && $message){
    $stmt = $conn->prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $message);
    if($stmt->execute()){
        echo "success";
    } else {
        echo "error";
    }
}
?>
