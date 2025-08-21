<p align="center">
  <img src="./build/structures/images/logo.png" alt="ZKCard logo" width="140" />

  <h1 align="center">ZKCard</h1>
  <em>Node.js library to generate beautiful card images for music and media apps.</em>
</p>

## Overview

ZKCard is a lightweight Node.js library for creating customizable PNG card images. It supports automatic color extraction from thumbnails, multiple international fonts, and animated progress bars.

## Table of Contents

- [Quickstart](#quickstart)
- [Features](#features)
- [Project index](#project-index)
- [Project Structure](#project-structure)
- [Quick examples](#quick-examples)
- [License](#license)
- [Switch back to Vietnamese README (default)](README.md)

## Quickstart

```bash
npm install zkcard
```

Basic usage:

```javascript
const { zkcard } = require('zkcard');

const card = new zkcard({
  name: 'Song Name',
  author: 'Artist Name',
  requester: 'User',
  progress: 45
});

const buffer = await card.build();
require('fs').writeFileSync('card.png', buffer);
```

## Features

- ✨ Generate customizable PNG cards
- 🎨 Auto color extraction from thumbnail (auto)
- 🌈 Hex color support and brightness adjustment
- 📊 Animated progress bar
- 🖼️ Thumbnail from URL or buffer
- 🔤 International font support (JP / KR / Emoji)

## Project index

- Package: `zkcard` — main API to create cards
- Build: `build/` — distribution (index.js, index.d.ts)
- Functions: `functions/` — helpers (colorFetch, adjustBrightness)
- Structures: `structures/` — layout, fonts, sample images

## Project Structure

- LICENSE — project license
- package.json — metadata & scripts
- build/ — published build files
- functions/ — helper functions
- structures/ — fonts & sample images

## Quick examples

Create a card and save to file:

```javascript
(async () => {
  const { zkcard } = require('zkcard');
  const fs = require('fs');

  const card = new zkcard()
    .setName("Ash Again") // Song Name
    .setAuthor("Gawr Gura") //  Song Author Name
    .setRequester("ZenKho") // Name of the person requesting the song
    .setColor("auto")
    .setTheme("classic") // Don't change, only support 'classic'
    .setBrightness(50)
    .setThumbnail("https://raw.githubusercontent.com/ZenKho-chill/zkcard/ac5eda846c33f65c22cf0c76ec7ddecd7a8febfd/build/structures/images/avatar.png")
    .setProgress(10) // Time line bar
    .setStartTime("0.00")
    .setEndTime("4:59")

  const cardBuffer = await card.build();

  fs.writeFileSync(`zkcard.png`, cardBuffer);
  console.log("Task Done!")
})()
```

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.

---

Author: ZenKho-chill — https://github.com/ZenKho-chill
