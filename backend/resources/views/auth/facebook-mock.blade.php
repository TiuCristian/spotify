<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facebook OAuth Mock</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f2f5; margin: 0; }
        .card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
        h1 { color: #1877f2; margin-bottom: 20px; font-size: 24px; }
        p { color: #606770; margin-bottom: 30px; font-size: 15px; }
        input { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-size: 16px; }
        button { width: 100%; padding: 12px; background: #1877f2; color: white; border: none; border-radius: 6px; font-weight: bold; font-size: 16px; cursor: pointer; transition: background 0.2s; }
        button:hover { background: #166fe5; }
    </style>
</head>
<body>
    <div class="card">
        <h1>facebook</h1>
        <p>Log in to use your Facebook account with Stainify.</p>
        <form action="{{ route('facebook.callback') }}" method="GET">
            <input type="hidden" name="simulated" value="1">
            <input type="text" name="name" placeholder="Full Name" value="Facebook User" required>
            <input type="email" name="email" placeholder="Email Address" value="fb_user@example.com" required>
            <button type="submit">Continue as Facebook User</button>
        </form>
    </div>
</body>
</html>
