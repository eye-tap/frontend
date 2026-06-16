<div id="title" align="center">
    <img src="./public/assets/favicon-logo.jpg" width="300">
    <h1>EYE-TAP</h1>
</div>

A platform to connect fixations to bounding boxes of texts.
Deployed version can be found [here](https://eyetap.ivia.ch/)

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
VITE_DEV_MDOE=true # Allows you to develop the frontend without a backend
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


## License

eyetap-frontend
Copyright (C) 2026  EYE-TAP contributors

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
