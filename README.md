# CG Project T04-G09

## Grade: 19.2/20

## Overview

This repository contains the Computer Graphics (Computação Gráfica) course project for group T04-G09. The project is a real-time WebGL scene built using the `CGF.js` framework. It features a helicopter scene with interactive controls, textured terrain, buildings, trees, and a particle-based fire effect implemented with custom GLSL shaders.

## Features

- Helicopter model with animation and user controls
- Textured terrain, buildings and vegetation
- Particle-based fire effect using custom GLSL shaders (`fire.vert` / `fire.frag`)
- Lighting and shading using shader programs in `project/shaders`
- Interactive GUI controls exposed through `MyInterface.js`

## Project Structure

- `index.html` — project entry page (open this in your browser)
- `main.js` — bootstraps the CGF scene and interface
- `MyScene.js` — main scene implementation
- `MyInterface.js` — dat.GUI interface configuration
- `MyHeli.js`, `MyBuilding.js`, `MyTree.js`, `MyFire.js`, etc. — scene object classes
- `shaders/` — GLSL shader sources used by the scene
- `textures/` — project textures

See the project folder for the full list of scene objects and shaders.

## Controls

Controls are defined in `MyInterface.js` and `main.js`. Use the GUI to toggle scene elements and adjust parameters. Keyboard and mouse camera controls are available via the CGF framework.

## Group Members

- José Diogo Alves Granja — 202205143
- Leonardo Monteiro Ribeiro — 202205144

---
