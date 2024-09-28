<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
</head>
<body>
    <h1>Hello, {{ $name }}</h1>
    <p>You requested to reset your password. Here is your reset code:</p>
    <h2>{{ $resetCode }}</h2>
    <p>Please use this code to reset your password.</p>
    <p>If you didn't request a password reset, you can ignore this email.</p>
</body>
</html>
