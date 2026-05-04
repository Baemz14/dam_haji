<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DamHaji | home</title>

    <link rel="stylesheet" href="css/play.css">
    <link rel="stylesheet" href="css/sidebar.css">

    <script type="module">
        import { onPlayLoad } from "/dam_haji/script/play.js";
        window.onload = onPlayLoad;
    </script>
</head>
<body>
    <?php include('sidebar.php'); ?>

    <main class="dh-has-sidebar dh-main">

        <div id="canvas_container" class="canvas-container">
            <canvas width="1600" height="1600" class="game-canvas"></canvas>
            <canvas width="1600" height="1600" class="game-canvas"></canvas>
            <canvas width="1600" height="1600" class="game-canvas"></canvas>
            <canvas width="1600" height="1600" class="game-canvas"></canvas>
            <canvas width="1600" height="1600" class="game-canvas"></canvas>
            <canvas id="input_canvas" width="1600" height="1600" class="game-canvas"></canvas>
        </div>

    </main>
</body>
</html>