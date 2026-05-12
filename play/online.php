<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DamHaji | home</title>

    <link rel="stylesheet" href="css/online.css">
    <link rel="stylesheet" href="css/play.css">
    <link rel="stylesheet" href="/dam_haji/css/sidebar.css">

    <script type="module">
        import { onOnlineLoad } from "./script/online.js";
        window.onload = onOnlineLoad;
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
                <canvas width="1600" height="1600" class="game-canvas"></canvas>
                <canvas id="input_canvas" width="1600" height="1600" class="game-canvas"></canvas>
            </div>
            <div id="white_showing">
                white
            </div>
        </div>
        <div class="menu-container">
            <div class="menu-title">Online Play</div>
            
            <div class="menu-selection">
                <div id="new_tab" class="menu-tab active">New Game</div>
                <div id="games_tab" class="menu-tab">Games</div>
                <div id="players_tab" class="menu-tab">Players</div>
            </div>

            <div class="menu-meat">
                <div id="new_container" class="">
                    <button id="findBtn">Find Game</button>
                </div>

                <div id="finding_container" class="">
                    <div>lookig for game...</div>
                    <button id="cancelFind">Cancel</button>
                </div>

                <div id="games_container" class="">

                </div>

                <div id="players_container" class="analysis-cont">

                </div>
            </div>

            <div class="menu-footer" style="padding: 10px;">
                <div>footer</div>
            </div>
        </div>
    </main>
</body>
</html>