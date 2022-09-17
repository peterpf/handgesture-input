# Implementation of using hand-gestures as input

Accompanying blog post available [here](https://peterpf.dev/projects/control-video-player-with-hand-gestures/).

<video width="320" height="240" controls>
  <source src="./demo/demo.mov" type="video/mp4">
</video>

## Development

### Requirements

- `npm` and `pnpm` should be installed.
- a webcam.

### Setup

Install the dependencies by running

```bash
pnpm install
```

### Available scripts

#### `pnpm dev`

Runs the app in development mode.
Open [https://localhost:3000](https://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.
You will see the build errors and lint warnings in the console.

#### `pnpm build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed.
