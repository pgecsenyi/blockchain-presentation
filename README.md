# Blockchain presentation

A slideshow on bitcoin and the blockchain powered by a minimalist custom presentation framework.

## Installation and the build process

In order to build the slideshow you will need _Node.js_ and _Yarn_ or _npm_. Once you have them, run `yarn install` from the project's top level directory containing the `package.json` file.

To build the presentation bundle, execute the following commands.
    
    yarn run build

To build the debug version with source maps and to monitor the changes continously, run the following.

    yarn run debug

Using _webpack development server_ you can access to the running slideshow by default at address `localhost:8080`.

## Usage

The _left_ and _right_ arrow buttons can be used to navigate between the slides. _Home_ jumps to the very first slide, while _End_ jumps to the last one. _Space_ and _Backspace_ can also be used for navigation.

### Using the timeline

  * `a`: display _all_ moments.
  * `n`: display _next_ moment.

### Using the curve plotter

  * `a`, `d`, `w`, `s`: navigate in the coordinate system.
  * `i`, `o`: zoom _in_ or _out_.
  * `e`: _edit_ curve parameters.
  * `c`: _clear_ displayed points.
  * `r`: _reset_ display.
  * `z`: calculate the summary of the displayed points.
  * left click: add new points.

## Development environment

  * Yarn 0.27.5
  * Visual Studio Code 1.19.2
  * Mozilla Firefox 57.0.4
  * Chromium 61.0
