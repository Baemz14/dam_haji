<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DamHaji | home</title>

    <link rel="stylesheet" href="css/home.css">
    <link rel="stylesheet" href="css/sidebar.css">

    <script type="module">
        import { onHomeLoad } from "/dam_haji/script/home.js";
        window.onload = onHomeLoad;
    </script>
</head>
<body>
    <?php include('sidebar.php'); ?>

    <main class="dh-has-sidebar dh-main">
        <h1>Home</h1>
        <p>hello player.</p>
    </main>
</body>
</html>