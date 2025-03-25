<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Medical App</title>
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}" />

    @if (app()->isLocal())
        @viteReactRefresh
        @vite('resources/react/src/main.jsx')
    @else
        @php
            $manifest = json_decode(file_get_contents(public_path('build/manifest.json')), true);
        @endphp
        <link rel="stylesheet" href="{{ asset('build/' . $manifest['resources/react/src/main.jsx']['css'][0]) }}">
        <script type="module" src="{{ asset('build/' . $manifest['resources/react/src/main.jsx']['file']) }}"></script>
    @endif
</head>

<body>
    <div id="root"></div>
</body>

</html>
