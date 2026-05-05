<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DamHaji | home</title>

    <link rel="stylesheet" href="css/play_index.css">
    <link rel="stylesheet" href="/dam_haji/css/sidebar.css">
    <link rel="stylesheet" href="css/play.css">

    <script type="module">
        import { onPlayLoad } from "./script/play_index.js";
        window.onload = onPlayLoad;
    </script>
</head>
<body>
    <?php include(__DIR__ . '/../sidebar.php'); ?>
    <main class="dh-has-sidebar dh-main ">
        <div class="play-container">
            <div id="black_showing">
                black
            </div>
            <div id="canvas_container" class="canvas-container">
                <canvas width="1600" height="1600" class="game-canvas"></canvas>
                <canvas width="1600" height="1600" class="game-canvas"></canvas>
                <canvas width="1600" height="1600" class="game-canvas"></canvas>
                <canvas width="1600" height="1600" class="game-canvas"></canvas>
                <canvas width="1600" height="1600" class="game-canvas"></canvas>
                <canvas id="input_canvas" width="1600" height="1600" class="game-canvas"></canvas>
            </div>
            <div id="white_showing">
                white
            </div>
        </div>
        <div class="menu-container">
            <div class="button-container">
                <button class="menu-button" onclick="window.location.href='./local.php'">Play Local</button>
                <button class="menu-button" onclick="window.location.href='./online.php'">Play Online</button>
                <button class="menu-button" onclick="window.location.href='./bot.php'">Play Bot</button>
            </div>
        </div>
    </main>
</body>
</html>