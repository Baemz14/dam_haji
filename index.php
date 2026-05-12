<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DamHaji | frontpage</title>

    <link rel="stylesheet" href="css/index.css">

    <script type="module">
        import { onFrontLoad } from "/dam_haji/script/index.js";
        window.onload = onFrontLoad;
    </script>
</head>
<body>
    <?php include('sidebar.php'); ?>

    <main class="dh-has-sidebar dh-main">
        <h1>Welcome to Dam Haji</h1>
        <p>hello <span id="displayName">player</span>.</p>
    </main>
</body>
</html>