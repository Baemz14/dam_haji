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
                <div id="analysis_tab" class="menu-tab">Stuff</div>
            </div>

            <div class="menu-meat">
                <div id="move_container" class="move-cont">
                    <span class="move-item">
                        <span class="m-num">1.</span>
                        <span class="m-white">e3d4</span>
                        <span class="m-black">d6e5</span>
                    </span>

                    <span class="move-item">
                        <span class="m-num">2.</span>
                        <span class="m-white active-move">c3d4</span>
                    </span>

                    <div class="variation-block">
                        <span class="move-item">
                            <span class="m-num">1. ...</span>
                            <span class="m-black">f6e5</span>
                        </span>
                        <span class="move-item">
                            <span class="m-num">2.</span>
                            <span class="m-white">c3d4</span>
                        </span>
                        <div class="variation-block">
                            <span class="move-item">
                                <span class="m-num">1. ...</span>
                                <span class="m-black">f6e5</span>
                            </span>
                            <span class="move-item">
                                <span class="m-num">2.</span>
                                <span class="m-white active-move">c3d4</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div id="settings_container" class="settings-cont">

                    <div class="settings-group">
                        <label for="start_pos">Starting Position (FEN)</label>
                        <input 
                            id="startPos" 
                            type="text" 
                            value="1b1b1b1b/b1b1b1b1/1b1b1b1b/8/8/w1w1w1w1/1w1w1w1w/w1w1w1w1"
                            placeholder="Enter custom FEN..."
                        >
                        <div class="setting-item">
                            <input type="checkbox" id="whiteMove" checked>
                            <label for="whiteMove">White To Move</label>
                        </div>
                    </div>

                    <div class="settings-group">
                        <label>Player Time (mins)</label>
                        <input type="number" id="playerTime" value="10" min="1" max="60">
                    </div>

                    <hr> <div class="settings-grid">
                        <div class="setting-item">
                            <input type="checkbox" id="linkCaptureBehind" checked>
                            <label for="linkCaptureBehind">Link Capture Behind</label>
                        </div>

                        <div class="setting-item">
                            <input type="checkbox" id="forceCaptureMax" checked>
                            <label for="forceCaptureMax">Force Max Capture</label>
                        </div>

                        <div class="setting-item">
                            <input type="checkbox" id="noCaptureDie">
                            <label for="noCaptureDie">No Capture = Die</label>
                        </div>

                        <div class="setting-item">
                            <input type="checkbox" id="flyingHaji" checked>
                            <label for="flyingHaji">Flying Haji</label>
                        </div>

                        <div class="setting-item">
                            <input type="checkbox" id="flyingHajiCapture" checked>
                            <label for="flyingHajiCapture">Flying Haji Capture</label>
                        </div>
                    </div>

                    <div class="settings-group">
                        <label>Draw after turns (No capture)</label>
                        <input type="number" id="drawTurns" value="40">
                    </div>

                    <div class="settings-footer">
                        <button id="restart_game" class="danger-btn">RESTART GAME</button>
                    </div>

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
                </div>
            </div>
        </div>
    </main>
</body>
</html>