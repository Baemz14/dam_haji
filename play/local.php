<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DamHaji | home</title>

    <link rel="stylesheet" href="css/local.css">
    <link rel="stylesheet" href="css/play.css">
    <link rel="stylesheet" href="/dam_haji/css/sidebar.css">

    <script type="module">
        import { onLocalLoad } from "./script/local.js";
        window.onload = onLocalLoad;
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
            <div class="menu-title">Local Play</div>
            
            <div class="menu-selection">
                <div id="move_tab" class="menu-tab active">Moves</div>
                <div id="settings_tab" class="menu-tab">Settings</div>
                <div id="analysis_tab" class="menu-tab">Analysis</div>
            </div>
        </div>
    </main>
</body>
</html>