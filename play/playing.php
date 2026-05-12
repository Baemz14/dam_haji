<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DamHaji | home</title>

    <link rel="stylesheet" href="css/playing.css">
    <link rel="stylesheet" href="css/play.css">
    <link rel="stylesheet" href="/dam_haji/css/sidebar.css">

    <script type="module">
        import { onPlayingLoad } from "./script/playing.js";
        window.onload = onPlayingLoad;
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
            <div class="menu-title">Local Play</div>
            
            <div class="menu-selection">
                <div id="move_tab" class="menu-tab active">Moves</div>
                <div id="chat_tab" class="menu-tab">Chat</div>
                <div id="analysis_tab" class="menu-tab">Stuff</div>
            </div>

            <div class="menu-meat">
                <div id="move_container" class="move-cont">
                </div>

                <div id="chat_container" class="chat-cont">

                </div>

                <div id="analysis_container" class="analysis-cont">

                </div>
            </div>

            <div class="menu-footer">
                <div class="gc-btn-container">
                    <button id="first_move">|<</button>
                    <button id="undo"><</button>
                    <button id="redo">></button>
                    <button id="last_move">>|</button>  
                    <button id="resignBtn">resign</button>                  
                </div>
            </div>
        </div>
    </main>
</body>
</html>