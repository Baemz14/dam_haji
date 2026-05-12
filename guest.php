<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DamHaji | guest</title>

    <link rel="stylesheet" href="">

    <script type="module">
        import { onGuestLoad } from '/dam_haji/script/guest.js';
        window.onload = onGuestLoad;
    </script>
</head>
<body>
    <a href="/dam_haji/">frontpage</a><br><br>
    <h1>Hello guest</h1>

    <form id="guestForm">
        <label for="displayName">display name:</label>
        <input type="text" id="displayName"><br><br>

        <input type="submit" value="confirm">
    </form>

    <p>Already have an account? <a href="login.php">Log in here</a></p>
    <p>Don't have an account? <a href="signup.php">Sign up here</a></p>
</body>
</html>