<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DamHaji | signup</title>

    <link rel="stylesheet" href="css/signup.css">

    <script type="module">
        import { onSignupLoad } from '/dam_haji/script/signup.js';
        window.onload = onSignupLoad;
    </script>
</head>
<body>
    <a href="/dam_haji/">frontpage</a><br><br>
    <h1>signup</h1>

    <form id="signupForm">
        <label for="username">username:</label>
        <input type="text" id="username"><br><br>

        <label for="displayName">display name:</label>
        <input type="text" id="displayName"><br><br>

        <label for="email">email:</label>
        <input type="text" id="email"><br><br>

        <label for="pass">password:</label>
        <input type="password" id="pass">
        <label> Show Password</label>
        <input type="checkbox" id="showPass"><br><br>

        <label for="confPass">confirm password:</label>
        <input type="password" id="confPass"><br><br>

        <input type="submit" value="signup">
    </form>

    <p>Already have an account? <a href="login.php">Log in here</a></p>
</body>
</html>