<?php
/**
 * Sidebar Component for Dam Haji Platform
 * Include this file in any page using: <?php include 'sidebar.php'; ?>
 *
 * Icons powered by Font Awesome 6 (loaded via CDN below).
 * Browse all available icons: https://fontawesome.com/icons
 * Use more icons anywhere on your site with: <i class="fa-solid fa-ICON_NAME"></i>
 */
?>
<!-- Font Awesome 6 (free) — include once; safe to leave here even if already loaded elsewhere -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link rel="stylesheet" href="/dam_haji/css/sidebar.css">

<aside class="dh-sidebar">
    <!-- Brand / Logo -->
    <div class="dh-sidebar__brand">
        <div class="dh-sidebar__logo">
            <span class="dh-logo-piece"></span>
        </div>
        <span class="dh-sidebar__brand-name">Dam Haji</span>
    </div>

    <!-- Navigation -->
    <nav class="dh-sidebar__nav">
        <a href="play.php" class="dh-nav-item">
            <i class="fa-solid fa-chess-board dh-nav-icon"></i>
            <span class="dh-nav-label">Play</span>
        </a>

        <a href="#" class="dh-nav-item">
            <i class="fa-solid fa-puzzle-piece dh-nav-icon"></i>
            <span class="dh-nav-label">History</span>
        </a>

        <a href="#" class="dh-nav-item">
            <i class="fa-solid fa-users dh-nav-icon"></i>
            <span class="dh-nav-label">Community</span>
        </a>
    </nav>

    <!-- Auth Buttons -->
    <div class="dh-sidebar__auth">
        <a id="signupBtn" href="/dam_haji/signup.php" class="dh-btn dh-btn--primary">Sign Up</a>
        <a id="loginBtn" href="/dam_haji/login.php" class="dh-btn dh-btn--secondary">Log In</a>
        <a id="logoutBtn" class="dh-btn dh-btn--red">Log Out</a>
    </div>

    <script type="module">
        import { callServer } from '/dam_haji/include/call_server.js';
        const data = await callServer('/dam_haji/server_call/user_call.php', "CHECK_LOGIN");
        if (data['is_logged_in'] === "true") {
            document.getElementById('signupBtn').style.display = "none";
            document.getElementById('loginBtn').style.display = "none";
            document.getElementById('logoutBtn').style.display = "";
        }
        else {
            document.getElementById('signupBtn').style.display = "";
            document.getElementById('loginBtn').style.display = "";
            document.getElementById('logoutBtn').style.display = "none";
        }
    </script>
</aside>