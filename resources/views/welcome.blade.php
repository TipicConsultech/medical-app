<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Medical App</title>
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}" />
    @viteReactRefresh
    @vite('resources/react/src/main.jsx')
</head>
<body>
<div id="root"></div>
</body>
</html>