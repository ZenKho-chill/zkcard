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
  color: 'auto',
  theme: 'zk', // "zk" or "themes2"
  brightness: 50
});

const buffer = await card.build();
require('fs').writeFileSync('card.png', buffer);
```

## Features

- ✨ Generate customizable PNG cards with beautiful design
- 🎨 Auto color extraction from thumbnail (`auto`)
- 🌈 Hex color support and custom brightness adjustment
- ️ Thumbnail from URL or buffer support
- 🔤 International font support (JP / KR / Emoji)
- 🎯 **28 diverse background themes** - from anime characters to abstract designs
- 🌈 Random color effects for text and borders
- 📏 Auto text truncation for optimal display
- 🖼️ Auto thumbnail loading with simulated headers to avoid blocking
- 🎭 Special themes: bebe, cute, miko, kobokanaeru, vestiazeta, yui and many more

## Project index

- Package: `zkcard` — main API to create cards
- Build: `build/` — distribution (index.js, index.d.ts)  
- Functions: `functions/` — helpers (colorFetch, adjustBrightness, rgbToHex, getAvailableThemes)
- Structures: `structures/` — layout, fonts, themes and sample images
  - fonts/ — International fonts (CircularStd, NotoSans, NotoEmoji)
  - images/ — Default avatar, logo and **28 diverse theme backgrounds**
    - **Character Themes**: bebe, cute, kobokanaeru, miko, vestiazeta, yui
    - **Abstract Themes**: themes1-20 (20 themes with abstract designs)
    - **Special Themes**: blank (minimal design), zk (original theme)

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
    │   ├── getAvailableThemes.js — get available themes list
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
            ├── bebe/ — Bebe theme (1 background)
            ├── blank/ — Minimal theme (1 background)
            ├── cute/ — Cute theme (8 backgrounds)
            ├── kobokanaeru/ — Kobo Kanaeru theme (15 backgrounds)
            ├── miko/ — Miko theme (42 backgrounds)
            ├── themes1/ — Abstract theme 1 (1 background)
            ├── themes2/ — Abstract theme 2 (10 backgrounds)
            ├── themes3/ — Abstract theme 3 (10 backgrounds)
            ├── themes4/ — Abstract theme 4 (14 backgrounds)
            ├── themes5/ — Abstract theme 5 (15 backgrounds)
            ├── themes6-20/ — Abstract themes 6-20 (varied backgrounds)
            ├── vestiazeta/ — Vestia Zeta theme
            ├── yui/ — Yui theme
            └── zk/ — Original ZK theme (8 backgrounds)
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
    .setTheme("zk") // Available themes: "zk" or "themes2"
    .setBrightness(50) // Brightness (0-255)
    .setThumbnail("https://your-image-url.com/cover.jpg")

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
    theme: "themes2",  // Card theme (zk or themes2)
    brightness: 75,   // Brightness (0-255)
    thumbnail: "https://your-image-url.com/cover.jpg",
  });

  const cardBuffer = await card.build();
  fs.writeFileSync(`custom_card.png`, cardBuffer);
})()
```

### Check Available Themes

```javascript
const { zkcard, getAvailableThemes } = require('zkcard');

// Get list of all available themes (28 themes)
const availableThemes = getAvailableThemes();
console.log('Available themes:', availableThemes); 
// ['bebe', 'blank', 'cute', 'kobokanaeru', 'miko', 'themes1', 'themes2', ..., 'zk']

// Use random theme
const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
const card = new zkcard()
  .setName("Random Theme Song")
  .setAuthor("Artist")
  .setRequester("User")
  .setTheme(randomTheme)
  .setColor("#ff6b6b");
```

### Configuration Options

| Method | Description | Default Value | Notes |
|--------|-------------|---------------|-------|
| `setName(string)` | Song name | **Required** | Auto truncated if >15 chars |
| `setAuthor(string)` | Artist name | **Required** | Auto truncated if >15 chars |
| `setRequester(string)` | Music requester name | **Required** | Auto truncated if >35 chars |
| `setColor(string)` | Theme color (`auto` or hex) | `#ff0000` | `auto` extracts from thumbnail |
| `setTheme(string)` | Card theme | `zk` | See [28 available themes](#-available-themes) |
| `setBrightness(number)` | Brightness (0-255) | `0` | Only applies when color=`auto` |
| `setThumbnail(string)` | Thumbnail URL | Default avatar | Supports URL and data URI |

### v1.5.9 Highlights

- 🎨 **28 Diverse Background Themes**: 
  - **Character themes**: bebe, cute, kobokanaeru, miko (42 backgrounds), vestiazeta, yui
  - **Abstract themes**: themes1-20 with unique abstract designs
  - **Special themes**: blank (minimal), zk (original)
- 🌈 **Random Color System**: 
  - Song name: 6 allowed colors (#000000, #FF0000, #FFFFFF, #800080, #000080, #2F4F4F)
  - Thumbnail border: white with shadow effects
- 📏 **Smart Text Truncation**: Auto truncate long text and add "..."
- 🖼️ **Enhanced Visuals**: Rounded corners, gradient effects and professional layout
- 🔗 **Improved Image Loading**: Simulated headers to avoid blocking when loading thumbnails
- 🎯 **Optimized Performance**: Improved render speed and memory usage
- 🎭 **Theme Variety**: From anime characters to abstract art, suitable for all preferences

## 🎨 Available Themes

ZKCard provides **28 diverse themes** divided into the following groups:

### 👥 Character Themes (6 themes)
- `bebe` - Bebe theme with 1 background
- `cute` - Cute theme with 8 adorable backgrounds
- `kobokanaeru` - Kobo Kanaeru theme with 15 backgrounds
- `miko` - Miko theme with 42 backgrounds (most diverse)
- `vestiazeta` - Vestia Zeta theme
- `yui` - Yui theme

### 🌈 Abstract Themes (20 themes)
- `themes1` to `themes20` - Abstract and artistic designs
- Each theme has 1-15 different backgrounds
- Diverse styles from minimalist to vibrant

### ⭐ Special Themes (2 themes)
- `blank` - Minimal design with 800x200 canvas, perfect for simple cards
- `zk` - Original ZK theme with 8 classic backgrounds

### 🖼️ Preview
To see preview of all themes, run:

```bash
# Clone repo and generate preview
git clone https://github.com/ZenKho-chill/zkcard.git
cd zkcard
npm install
node test.js

# Open preview/README.md to see gallery with all 28 themes
```

**🔗 [View Complete Preview Gallery](./preview/README.md)**

### 📋 Themes list by category:

#### 👥 Character Themes:
- [`bebe`](./preview/README.md#bebe) - [`cute`](./preview/README.md#cute) - [`kobokanaeru`](./preview/README.md#kobokanaeru) 
- [`miko`](./preview/README.md#miko) - [`vestiazeta`](./preview/README.md#vestiazeta) - [`yui`](./preview/README.md#yui)

#### 🌈 Abstract Themes:
- [`themes1`](./preview/README.md#themes1) - [`themes2`](./preview/README.md#themes2) - [`themes3`](./preview/README.md#themes3) - [`themes4`](./preview/README.md#themes4) - [`themes5`](./preview/README.md#themes5)
- [`themes6`](./preview/README.md#themes6) - [`themes7`](./preview/README.md#themes7) - [`themes8`](./preview/README.md#themes8) - [`themes9`](./preview/README.md#themes9) - [`themes10`](./preview/README.md#themes10)
- [`themes11`](./preview/README.md#themes11) - [`themes12`](./preview/README.md#themes12) - [`themes13`](./preview/README.md#themes13) - [`themes14`](./preview/README.md#themes14) - [`themes15`](./preview/README.md#themes15)
- [`themes16`](./preview/README.md#themes16) - [`themes17`](./preview/README.md#themes17) - [`themes18`](./preview/README.md#themes18) - [`themes19`](./preview/README.md#themes19) - [`themes20`](./preview/README.md#themes20)

#### ⭐ Special Themes:
- [`blank`](./preview/README.md#blank) - [`zk`](./preview/README.md#zk)

Or use code to create previews:

```javascript
const { zkcard, getAvailableThemes } = require('zkcard');

// Create preview for specific theme
async function createPreview(themeName) {
  const card = new zkcard({
    name: 'Preview Song',
    author: 'Artist Name',
    requester: 'Preview User',
    theme: themeName,
    color: 'auto',
    brightness: 80
  });
  
  const buffer = await card.build();
  require('fs').writeFileSync(`${themeName}_preview.png`, buffer);
  console.log(`Preview for ${themeName} created!`);
}

// Create preview for all themes
getAvailableThemes().forEach(theme => createPreview(theme));
```

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.

---

Author: ZenKho-chill — https://github.com/ZenKho-chill
