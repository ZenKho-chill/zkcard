<p align="center">
  <img src="./build/structures/images/logo.png" alt="ZKCard logo" width="140" />

  <h1 align="center">ZKCard</h1>
  <em>Node.js library to generate beautiful card images for music and media apps.</em>
</p>

## Overview

ZKCard is a lightweight Node.js library for creating customizable PNG card images. It supports automatic color extraction from thumbnails, multiple international fonts, animated progress bars, and 18+ diverse background themes.

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
  progress: 45,
  color: 'auto',
  brightness: 50
});

const buffer = await card.build();
require('fs').writeFileSync('card.png', buffer);
```

## Features

- ✨ Generate customizable PNG cards with beautiful design
- 🎨 Auto color extraction from thumbnail (`auto`)
- 🌈 Hex color support and custom brightness adjustment
- 📊 Smooth animated progress bar
- 🖼️ Thumbnail from URL or buffer support
- 🔤 International font support (JP / KR / Emoji)
- 🎯 18+ diverse random background themes (themes1 & themes2)
- 🌈 Random color effects for text and borders
- 📏 Auto text truncation for optimal display

## Project index

- Package: `zkcard` — main API to create cards
- Build: `build/` — distribution (index.js, index.d.ts)  
- Functions: `functions/` — helpers (colorFetch, adjustBrightness, rgbToHex)
- Structures: `structures/` — layout, fonts, themes and sample images
  - fonts/ — International fonts (CircularStd, NotoSans, NotoEmoji)
  - images/ — Default avatar and 18+ theme backgrounds (themes1 & themes2)

## Project Structure

```
zkcard/
├── LICENSE — MIT license
├── package.json — metadata & dependencies
├── README.md — Vietnamese documentation
├── README_en.md — English documentation
└── build/ — published build files
    ├── index.js — main entry point
    ├── index.d.ts — TypeScript definitions
    ├── functions/ — helper functions
    │   ├── adjustBrightness.js — brightness adjustment
    │   ├── colorFetch.js — color extraction from images
    │   └── rgbToHex.js — RGB to Hex conversion
    └── structures/ — card resources
        ├── zkcard.js — main card creation logic
        ├── fonts/ — international fonts
        │   ├── circularstd-black.otf
        │   ├── notoemoji-bold.ttf
        │   ├── notosans-black.ttf
        │   ├── notosans-jp-black.ttf
        │   └── notosans-kr-black.ttf
        └── images/ — image templates
            ├── avatar.png — default avatar
            ├── logo.png — ZKCard logo
            ├── themes1/ — theme set 1 (8 backgrounds)
            └── themes2/ — theme set 2 (10 backgrounds)
```

## Quick examples

### Basic Example with Method Chaining

```javascript
(async () => {
  const { zkcard } = require('zkcard');
  const fs = require('fs');

  const card = new zkcard()
    .setName("Ash Again") // Song name
    .setAuthor("Gawr Gura") // Artist name
    .setRequester("ZenKho") // Requester name
    .setColor("auto") // Auto extract color from thumbnail
    .setTheme("classic") // Current theme (only supports classic)
    .setBrightness(50) // Brightness (0-255)
    .setThumbnail("https://your-image-url.com/cover.jpg")
    .setProgress(10) // Music progress (0-100%)

  const cardBuffer = await card.build();
  fs.writeFileSync(`zkcard.png`, cardBuffer);
  console.log("Card created successfully!")
})()
```

### Constructor Options Example

```javascript
(async () => {
  const { zkcard } = require('zkcard');
  const fs = require('fs');

  const card = new zkcard({
    name: "Beautiful Song",
    author: "Amazing Artist", 
    requester: "Music Lover",
    color: "#ff6b6b", // Custom hex color (or 'auto' for automatic)
    brightness: 75,   // Brightness (0-255)
    thumbnail: "https://your-image-url.com/cover.jpg",
    progress: 65      // Progress (0-100%)
  });

  const cardBuffer = await card.build();
  fs.writeFileSync(`custom_card.png`, cardBuffer);
})()
```

### Configuration Options

| Method | Description | Default Value | Notes |
|--------|-------------|---------------|-------|
| `setName(string)` | Song name | **Required** | Auto truncated if >15 chars |
| `setAuthor(string)` | Artist name | **Required** | Auto truncated if >15 chars |
| `setRequester(string)` | Music requester name | **Required** | Auto truncated if >35 chars |
| `setColor(string)` | Theme color (`auto` or hex) | `#ff0000` | `auto` extracts from thumbnail |
| `setTheme(string)` | Card theme | `classic` | Always `classic` |
| `setBrightness(number)` | Brightness (0-255) | `0` | Only applies when color=`auto` |
| `setThumbnail(string)` | Thumbnail URL | Default avatar | Supports URL and data URI |
| `setProgress(number)` | Progress (0-100%) | `0` | Auto clamped to 2-99% |

### v1.5.4 Highlights

- 🎨 **18+ Background Themes**: Auto-randomly selected from themes1/ (8 images) and themes2/ (10 images)
- 🌈 **Random Color System**: 
  - Song name: 6 allowed colors (#000000, #FF0000, #FFFFFF, #800080, #000080, #2F4F4F)
  - Artist name: Fixed red color (#FF0000)
  - Requester: Fully random hex colors
  - Thumbnail border: Random colors
- 📏 **Smart Text Truncation**: Auto truncate long text and add "..."
- 🖼️ **Enhanced Visuals**: Rounded corners, gradient effects and professional layout

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.

---

Author: ZenKho-chill — https://github.com/ZenKho-chill
