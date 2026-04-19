<?php
include 'config.php';

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