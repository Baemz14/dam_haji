<?php
include '../include/main_controller.php';
session_start();

$call_state = $_POST['call_state'];
$response = [
    'error_log' => "poop"
];

switch ($call_state) {
    case "USER_EXIST":
        $username = $_POST['username'];
        $response['is_user_exist'] = userExist($username)? "true": "false";

        break;

    case "ADD_USER":
        $username = $_POST['username'];
        $display_name = $_POST['display_name'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        if (!userExist($username)) {
            if (addUser($username, $display_name, $email, $password)) {
                $response['status'] = "success";
            }
            else {
                $response['status'] = "failed";
                $response['error_log'] = "controller error";
            }
        }
        else {
            $response['status'] = "failed";
            $response['error_log'] = "username already exist";
        }

        break;

    case "FIND_USER":
        $username = $_POST['username'];
        $password = $_POST['password'];
        $user = findUser($username, $password);
        if ($user) {
            $response['user'] = $user;
            $response['is_input_correct'] = "true";
            $response['error_log'] = "found user";
        }
        else {
            $response['user'] = null;
            $response['is_input_correct'] = "false";
            $response['error_log'] = "user not found";
        }

        break;

    case "LOGIN":
        $user_id = $_POST['user_id'];
        if ($user_id) {
            $user = getUser($user_id);
            if ($user) {
                $_SESSION['user_id'] = $user_id;
                $response['status'] = "success";
                $response['error_log'] = "no error";
            }
            else {
                $response['status'] = "failed";
                $response['error_log'] = "cant find user";
            }
        }
        else {
            $response['status'] = "failed";
            $response['error_log'] = "no user id passed";
        }

        break;

    case "CHECK_LOGIN":
        if (isset($_SESSION['user_id'])) {
            $user_id = $_SESSION['user_id'];
            if (getUser($user_id)) {
                $response['is_logged_in'] = 'true';
            }
            else {
                $response['is_logged_in'] = 'false';
                $response['error_log'] = 'user id is there but cant find user';
            }
        }
        else {
            $response['is_logged_in'] = 'false';
            $response['error_log'] = 'cant find user id';
        }
        break;

    case "LOGOUT":
        $_SESSION = array();
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        $response['status'] = "success";
        break;

    default:
        $response['error_log'] = "state wong";
}

header('Content-Type: application/json');
echo json_encode($response);
?>