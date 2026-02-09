<div id="title" align="center">
    <img src="./public/assets/favicon-logo.jpg" width="300">
    <h1>Eye-TAP</h1>
</div>

A platform to connect gaze points to bounding boxes of texts.
Deployed version can be found [here](https://group-p23.webdev-25.ivia.isginf.ch/)

## Development
Run the app in development mode normally.
```bash
npm run dev
```
To pass an environment variable, prepend it to the above command.
The following environment variables are available:
```bash
VITE_OVERRIDE_PROD=true # Makes the app use the prod backend, even if you are running dev server
VITE_BACKEND_URL=<your URL> # Specify your own backend URL (highest priority)
VITE_DISABLE_LOGIN_CHECK=true # Allows you to develop the frontend without a backend
```

To compile and typecheck the app, run
```bash
npm run build
```
or, to omit type-checking (highly discouraged), run
```bash
npm run build-only
```

It is recommended that you run 
```bash
npm run lint-fix
```
before each push to not get a failed pipeline. You can run `npm run lint` to get a list of all errors
