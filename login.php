<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DamHaji | login</title>

    <link rel="stylesheet" href="css/login.css">

    <script type="module">
        import { onLoginLoad } from '/dam_haji/script/login.js';
        window.onload = onLoginLoad;
    </script>
</head>
<body>
    <a href="/dam_haji/">frontpage</a><br><br>
    <h1>login</h1>

    <form id="loginForm">
        <label for="username">username:</label>
        <input type="text" id="username"><br><br>

        <label for="pass">password:</label>
        <input type="password" id="pass">
        <label> Show Password</label>
        <input type="checkbox" id="showPass"><br><br>

        <input type="submit" value="login">
    </form>

    <p>Don't have an account? <a href="signup.php">Sign up here</a></p>
    <p>or <a href="guest.php">play as guest</a></p>
</body>
</html>