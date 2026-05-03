<?php
include '../db_stuff/db_conn.php';

function generate_uuid() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

function userExist($username) {
    global $conn;
    $sql = "SELECT * FROM User WHERE username = '$username'";
    $result = mysqli_query($conn, $sql);
    return mysqli_num_rows($result) > 0;
}

function addUser($username, $display_name, $email, $password) {
    global $conn;
    $pass_hash = password_hash($password, PASSWORD_DEFAULT);
    $user_id = generate_uuid();
    $sql = "INSERT INTO user (user_id, username, display_name, email, pass_hash)
        VALUES ('$user_id', '$username', '$display_name', '$email', '$pass_hash')";
    return mysqli_query($conn, $sql);
}

function findUser($username, $password) {
    global $conn;
    $sql = "SELECT * FROM User WHERE username = '$username'";
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $hash = $row['pass_hash'];
        if (password_verify($password, $hash)) {
            unset($row['pass_hash']);
            return $row;
        }
    } 
    return null;
}

function getUser($user_id) {
    global $conn;
    $sql = "SELECT * FROM User WHERE user_id = '$user_id'";
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0) {
        return mysqli_fetch_assoc($result);
    } 
    return null;
}
?>