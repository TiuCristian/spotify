<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign in - Google Accounts</title>
    <style>
        body {
            background-color: #202124;
            color: #e8eaed;
            font-family: "Google Sans", Roboto, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background: #202124;
            border: 1px solid #5f6368;
            border-radius: 8px;
            width: 450px;
            padding: 40px;
            box-sizing: border-box;
        }
        .header {
            text-align: left;
            margin-bottom: 30px;
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 24px;
            font-weight: 400;
            margin: 0 0 10px 0;
        }
        p {
            font-size: 16px;
            margin: 0;
            color: #9aa0a6;
        }
        .account-list {
            list-style: none;
            padding: 0;
            margin: 0;
            border-top: 1px solid #5f6368;
        }
        .account-item {
            display: flex;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #5f6368;
            cursor: pointer;
            text-decoration: none;
            color: #e8eaed;
            transition: background 0.2s;
        }
        .account-item:hover {
            background: rgba(255,255,255,0.04);
        }
        .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #8ab4f8;
            color: #202124;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            margin-right: 15px;
            font-weight: 500;
        }
        .avatar.purple { background: #c58af9; }
        .avatar.brown { background: #f28b82; }
        .avatar.pink { background: #ff8bcb; }
        .info {
            display: flex;
            flex-direction: column;
        }
        .name {
            font-size: 14px;
            font-weight: 500;
        }
        .email {
            font-size: 12px;
            color: #9aa0a6;
            margin-top: 2px;
        }
        .footer {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #9aa0a6;
        }
        .footer-links span {
            margin-left: 20px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign in with Google
            </div>
            <h1>Choose an account</h1>
            <p>to continue to Stainify</p>
        </div>

        <div class="account-list">
            <a href="{{ route('google.callback', ['simulated' => 'true', 'email' => 'tiucrs@gmail.com', 'name' => 'Tiu Cristi']) }}" class="account-item">
                <div class="avatar">T</div>
                <div class="info">
                    <span class="name">Tiu Cristi</span>
                    <span class="email">tiucrs@gmail.com</span>
                </div>
            </a>
            <a href="{{ route('google.callback', ['simulated' => 'true', 'email' => 'cristian.tiu92@gmail.com', 'name' => 'Cristian Tiu']) }}" class="account-item">
                <div class="avatar purple">C</div>
                <div class="info">
                    <span class="name">Cristian Tiu</span>
                    <span class="email">cristian.tiu92@gmail.com</span>
                </div>
            </a>
            <a href="{{ route('google.callback', ['simulated' => 'true', 'email' => 'tiugeorgecristian@gmail.com', 'name' => 'Tiu Cristian']) }}" class="account-item">
                <div class="avatar brown">T</div>
                <div class="info">
                    <span class="name">Tiu Cristian</span>
                    <span class="email">tiugeorgecristian@gmail.com</span>
                </div>
            </a>
            <a href="{{ route('google.callback', ['simulated' => 'true', 'email' => 'tiu.cati24@gmail.com', 'name' => 'Cati Tiu']) }}" class="account-item">
                <div class="avatar pink">C</div>
                <div class="info">
                    <span class="name">Cati Tiu</span>
                    <span class="email">tiu.cati24@gmail.com</span>
                </div>
            </a>
            <a href="#" class="account-item" style="border-bottom: none;">
                <div class="avatar" style="background:transparent; border: 1px solid #5f6368; color: #e8eaed;">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                </div>
                <div class="info">
                    <span class="name">Use another account</span>
                </div>
            </a>
        </div>

        <div class="footer">
            <div>English (United States) ▾</div>
            <div class="footer-links">
                <span>Help</span>
                <span>Privacy</span>
                <span>Terms</span>
            </div>
        </div>
    </div>
</body>
</html>
