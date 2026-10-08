## 🌌 **daedalOS** 🌌

## _Desktop environment in the browser_

![Screenshot](https://raw.githubusercontent.com/DustinBrett/daedalOS/refs/heads/main/public/screenshot.png?raw=true)

> **⚡ Quick Run:**
>
> ```sh
> yarn install && yarn build:prebuild && yarn dev
> ```
>
> Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Feature Overview

[![Feature Overview](https://img.youtube.com/vi/djCqHH0SCmA/mqdefault.jpg)](https://www.youtube.com/watch?v=djCqHH0SCmA)

# System 🧠

### [File System](https://github.com/jvilk/BrowserFS)

- File Explorer
  - Back, Forward, Recent locations, Up one level, Address bar, Search
  - Thumbnail & Details Views
- [Drag & Drop](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) File Support (internal & external)
  - Loading progress dialog
- Archives
  - Browse [ZIP](https://github.com/jvilk/BrowserFS/blob/master/src/backends/ZipFS.ts) & [ISO](https://github.com/jvilk/BrowserFS/blob/master/src/backends/IsoFS.ts) files as folders
  - Create ZIP files ([fflate](https://www.npmjs.com/package/fflate))
  - Extract 7Z/GZ/RAR/TAR/etc. ([7z-wasm](https://github.com/use-strict/7z-wasm))
- Writes to [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- Group selection/manipulation & drag to sort/arrange
  - Sort by name, size, type or date
  - Persists icon position/sort order
- Dynamic and auto cached icons for [music](https://github.com/Borewit/music-metadata-browser), images, video & emulator states
- Context Menus
  - Cut, Copy, Create shortcut, Delete, Rename
  - [Add file(s)](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications), [Map directory](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
  - Open with options/dialog, Open file/folder location, Open in new window, Open Terminal here
  - Download, Add to archive, Extract here, Set as wallpaper, Set as mouse pointer, Convert audio/video/photo/spreadsheets, Properties (w/Details)
  - Sort by, New Folder, New Text Document
  - Screen Capture
- Keyboard Shortcuts
  - CTRL+A, CTRL+C, CTRL+X, CTRL+V, Delete (or CTRL+D)
  - F2 (Rename), F5 or CTRL+R (Refresh), Backspace (Up one level)
  - Arrows, Home, End, Enter (Open), ALT+Enter (Properties), ALT+N (New window)
  - CTRL+SHIFT+3 (Thumbnail view), CTRL+SHIFT+6 (Details view)
- File information tooltips

### Windows

- [Resizable and Draggable](https://github.com/bokuweb/react-rnd)
- Minimize, Maximize & Close
- Persists size/position/maximized states
- [Animates](https://motion.dev/) opening and closing

### Start Menu

- Expandable Sidebar
  - Apps list, Documents/Pictures/Videos shortcuts, Power (clears session)
- Spotlight visual effect
- Folder support
- Opens with **_SHIFT+ESC_** (or the Windows key in fullscreen)

### Taskbar

- [Peek](https://github.com/bubkoo/html-to-image) hover preview of windows
- Focused window indicator
- Search menu (w/Recent files)
- AI Chat Agent ([Prompt API](https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit) & [WebLLM](https://github.com/mlc-ai/web-llm)) (w/Summarize & Image Generation)

### Keyboard Shortcuts

| Shortcut             | Action                           |
| -------------------- | -------------------------------- |
| SHIFT+ESC            | Start Menu                       |
| SHIFT+CTRL+E         | File Explorer                    |
| SHIFT+CTRL+R         | Run dialog                       |
| SHIFT+CTRL+S         | Search                           |
| SHIFT+CTRL+X         | Start button context menu        |
| SHIFT+CTRL+D         | Show desktop                     |
| SHIFT+CTRL+Up / Down | Maximize / Minimize (or restore) |
| SHIFT+F5             | Reload                           |
| SHIFT+F10            | Terminal                         |
| SHIFT+F12            | DevTools                         |
| CTRL+ALT+F4          | Close focused window             |
| F11                  | Toggle fullscreen                |

In fullscreen the Windows key opens the Start Menu, Windows key combos work in place of SHIFT+CTRL (e.g. Windows Key + R), ALT+F4 closes the focused window and ESC exits fullscreen.

### Clock

- Runs in a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
  - Drawn in an [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)
- NTP server time mode ([ntp.js](http://www.ntpjs.org/))
- Synced to system clock on load
- Date tooltip
- Calendar popup

### Background & Screensaver

- Dynamic animated wallpapers ([OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)/[Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers))
  - Milky Way ([density wave theory](https://beltoforion.de/en/spiral_galaxy_renderer/), device orientation parallax)
  - [Vanta Waves](https://www.vantajs.com/?effect=waves)
  - [Hexells](https://znah.net/hexells/)
  - [Matrix](https://rezmason.github.io/matrix/) (2D & 3D)
  - [Coastal Landscape](https://www.shadertoy.com/view/fstyD4)
- Set via image/video (Fill, Fit, Stretch, Tile, Center)
- Picture Slideshow
- Online image sources
  - [NASA Astronomy Picture of the Day](https://api.nasa.gov/#apod)
  - [Art Institute of Chicago](https://api.artic.edu/docs/)
  - [Metropolitan Museum of Art](https://metmuseum.github.io/)
  - [Lorem Picsum](https://picsum.photos/)
- AI generated wallpapers via [Stable Diffusion](https://stability.ai/stable-diffusion) (requires WebGPU)
- Screen saver file support (**_.xscr_**)
  - [3D FlowerBox](https://github.com/kevin-shannon/3D-FlowerBox)
  - [3D Maze](https://github.com/ibid-11962/Windows-95-3D-Maze-Screensaver)
  - [3D Pipes](https://github.com/1j01/pipes)
  - Hackers

### Run Dialog

- Launch apps by alias or paths
- Opens `ipfs://` & `nostr:` URIs

### URL

- Query parameter loading
  - Examples:
    - `/?url=/CREDITS.md`
    - `/?app=Browser`

# Apps 🧪

### [AWS S3 File Manager](components/apps/S3FileManager) ☁️

- Cloud file management directly within the browser desktop
- Connect to any AWS S3 bucket (with custom region and endpoint support for MinIO, LocalStack, Cloudflare R2, Wasabi, etc.)
- Browse folders, upload files, download files, create new folders, and delete objects
- Generate pre-signed download URLs on demand
- **Monaco Editor Cloud Sync**: Open S3 files directly in Monaco Editor and save back with automated cloud sync
- **Context Menu Integration**: Right-click any file to "Upload to AWS S3" or right-click any folder to "Open AWS S3 Manager"
- **Client-Side Security**: Credentials are stored strictly in client-side `localStorage` (`daedalos_aws_s3_config`) — no credentials in `.env`, server logs, or git commits

### [BoxedWine](http://www.boxedwine.org/) (**_.exe, .zip_**)

- Runs 16/32-bit Windows applications

### Browser (**_.htm, .html_**)

- Loads websites (_w/CORS support_)
- Bookmark bar with favicon support
- Proxy support (Wayback Machine & The Old Net)
- Back/Forward & Reload
- Google search via Address bar
- IPFS protocol support
- [chrome://dino](https://github.com/wayou/t-rex-runner) game

### [DesktopFly](https://github.com/DenisSergeevitch/desktop-fly)

- Fruit fly pets driven by a live spiking simulation of 9,907 real [FlyWire](https://flywire.ai/) connectome neurons, with escape, backward retreat, grooming, sleep & circadian rhythm
- Every fly has its own brain & senses: window edges are walkable terrain, dragged windows & the cursor loom, clicks swat, and a takeoff startles nearby flies
- Flies learn: swat one while it is watching something and it learns to avoid that thing
- Spawn via `fly [count]` (up to 5) in Terminal or the Run dialog, see `fly help` for details

### [DevTools](https://eruda.liriliri.io/)

- Console, Elements, Network, Resources, Sources, DOM
- Activate from Start Menu or **_SHIFT+F12_**

### [EmulatorJS](https://github.com/ethanaobrien/emulatorjs) (**_.32x, .a26, .a52, .a78, .gb, .gba, .gbc, .gen, .gg, .j64, .jag, .lnx, .n64, .nds, .nes, .ngc, .ngp, .pce, .sfc, .smc, .smd, .sms, .v64, .vb, .vboy, .ws, .wsc, .z64_**)

- Plays console game ROMs

### [IRC](https://kiwiirc.com/)

- Internet Relay Chat Client
- Connects over WebSockets

### [js-dos](https://js-dos.com/) (**_.exe, .jsdos, .zip_**)

- DOS emulator
- Automatic save states on close
  - /Users/Public/Snapshots
- Automatic window resize

### [Marked](https://marked.js.org/) (**_.md_**)

- Markdown Viewer

### Messenger

- Encrypted direct messaging client
- Utilizes [Nostr Protocol](https://nostr.com/) ([NIP-17](https://github.com/nostr-protocol/nips/blob/master/17.md), [NIP-04](https://github.com/nostr-protocol/nips/blob/master/04.md) for older clients)
- Automatic public/private key creation
- Sign in with a [NIP-07](https://github.com/nostr-protocol/nips/blob/master/07.md) extension or nsec
- Message requests, spam folder, bulk delete & blocking
- Default contacts from the author npub & the site's `/.well-known/nostr.json` ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md))

### [Monaco Editor](https://microsoft.github.io/monaco-editor/)

- Code/text editor
- Supports all file types
- Save files via **_CTRL+S_**
- Line count, cursor position, language id
- [Prettier](https://prettier.io/) formatting
  - JSON, JS/TS, CSS/Sass/Less, HTML, Markdown, XML

### [OpenType](https://github.com/opentypejs/opentype.js) (**_.otf, .ttf, .woff_**)

- Font viewer

### [Paint](https://github.com/1j01/jspaint) (**_.bmp, .gif, .ico, .jpeg, .jpg, .png, .tif, .tiff, .webp_**)

- Create & edit images

### [PDF](https://mozilla.github.io/pdf.js/) (**_.pdf_**)

- Render/Print PDFs
- Page current/count & Zoom

### Photos

- [Supported Formats](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#supported_image_formats)
  - [HEIF](https://github.com/catdad-experiments/libheif-js) (**_.heic, .heif_**)
  - [JPEG XL](https://github.com/niutech/jxl.js) (**_.jxl_**)
  - [QOI](https://gist.github.com/nicolaslegland/f0577cb49b1e56b729a2c0fc0aa151ba) (**_.qoi_**)
  - [TIFF & RAW](https://github.com/photopea/UTIF.js) (**_.tif, .tiff, .cr2, .dng, .nef_**)
  - Cursors (**_.ani, .cur_**)
- Fullscreen & [Zoom](https://github.com/anvaka/panzoom)

### [Ruffle](https://ruffle.rs/) (**_.swf, .spl_**)

- Flash Player emulator

### [Stable Diffusion](https://stability.ai/stable-diffusion)

- Creates 512x512 images using artificial intelligence
- Runs locally using [WebSD](https://mlc.ai/web-stable-diffusion/) (requires WebGPU)

### [Terminal](https://xtermjs.org/)

- Activate from Start Menu or **_SHIFT+F10_**
- File system support
- Autocomplete & history
- Pipe commands together
- Command list via `help`
- [Git support](https://isomorphic-git.org/) (checkout & clone)
- [Python support](https://pyodide.org/) (**_.py_**)
- [JavaScript support](https://bellard.org/quickjs/) via `qjs`
- [WebAssembly Package Manager](https://wapm.io/) (**_.wasm_**)
  - Ex: `wapm cowsay moo` ([\#](https://wapm.io/package/cowsay))
- [FFmpeg](https://github.com/ffmpegwasm/ffmpeg.wasm) & [ImageMagick](https://github.com/KnicKnic/WASM-ImageMagick) conversion
- [Weather information](https://wttr.in/)
- [eSheep](https://adrianotiger.github.io/web-esheep/)
- Neofetch
- Boots Linux in Virtual x86 via `linux` or `wsl`

### [TIC-80](https://tic80.com/) (**_.tic_**)

- Runs "fantasy computer" games

### [TinyMCE](https://www.tiny.cloud/tinymce/) (**_.rtf, .whtml_**)

- Read & WYSIWYG modes
- File save support

### [Virtual x86](https://copy.sh/v86/) (**_.bin, .dsk, .img, .iso_**)

- x86 emulator
- Automatic save states on close
  - /Users/Public/Snapshots
- Automatic window resize

### [Video Player](https://videojs.com/)

- [Supported Formats](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs) (**_.mp4, .webm, .mkv, .mov, .m4v, .ogv, .3gp, .m3u8, etc._**)
  - AVI/DivX decoded via [codecbox.js](https://github.com/duanyao/codecbox.js)
- Plays [YouTube](https://github.com/videojs/videojs-youtube) videos/shortcuts
- Keyboard Shortcuts (Volume, Seek, Scale, Fullscreen)

### [Vim](https://github.com/coolwanglu/vim.js)

- Code/text editor
- Supports all file types

### [Webamp](https://webamp.org/) (**_.mp3, .wsz, .asx, .m3u, .pls_**)

- Winamp audio player
- [Skin support](https://skins.webamp.org/) (w/random skins via [Winamp Skin Museum](https://skins.webamp.org/))
- Playlist & streaming support
- Visualization support (["Milkdrop"](https://github.com/jberg/butterchurn))

# Games 🎮

### [Chess](https://github.com/jhlywa/chess.js) (**_.pgn_**)

- Play against [stockfish.js](https://github.com/nmrugg/stockfish.js), a friend, or watch CPU vs CPU
- Load PGN games w/move navigation

### [ClassiCube](https://www.classicube.net/)

- Minecraft Classic compatible client

### [DX-Ball](https://habr.com/en/post/147339/)

- Block breaker arcade game like Arkanoid

### [Space Cadet Pinball](https://github.com/alula/SpaceCadetPinball)

- Reverse engineering of 3D Pinball from Windows

### [Quake III Arena](https://github.com/lrusso/Quake3)

- Port of the classic first-person shooter

# How to Run & Deploy 🚀

### System Prerequisites

- **[Node.js](https://nodejs.org/en/download/)**: Version 22.x or higher
- **[Yarn](https://classic.yarnpkg.com/)**: Version 1.22+ (Classic)
- **Git**

---

### Step-by-Step Local Setup

#### 1. Clone the Repository

```sh
git clone https://github.com/surajorg48/Browser-OS.git
cd Browser-OS
```

#### 2. Install Dependencies

```sh
yarn install
```

#### 3. Run Pre-Build Script (Mandatory)

Before starting the development server or building, you **must** run `build:prebuild`. This script scans the `public/` directory and generates the required filesystem indexes (`public/.index/fs.9p.json`) and search databases that the virtual OS mounts at startup.

```sh
yarn build:prebuild
```

> **Note:** Re-run `yarn build:prebuild` anytime you add, delete, or modify files inside `public/`.

#### 4. Start Development Server

```sh
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The browser desktop will boot up immediately.

---

### Production Deployment

#### Static Export Build

Builds an optimized static HTML/CSS/JS export to `out/` and serves it locally:

```sh
yarn install
yarn build
yarn serve
```

Open [http://localhost:3000](http://localhost:3000).

#### Docker Deployment

You can also run Browser-OS inside a Docker container:

```sh
docker build -t browser-os .
docker run -dp 3000:3000 --rm --name browser-os browser-os
```

---

### AWS S3 Cloud Integration Setup ☁️

Browser-OS features a built-in **AWS S3 File Manager** app that lets you manage cloud storage, upload/download files, and edit cloud files directly in Monaco Editor.

#### 🔒 Security Architecture (Zero Secret Keys in Code)

- **No secret keys or `.env` files are required or tracked in this repository.**
- All AWS credentials (Access Key ID, Secret Access Key, Session Token, Region, and Bucket) are entered directly into the client-side Connection Dialog and stored strictly in the user's browser `localStorage` (`daedalos_aws_s3_config`).
- All AWS SDK API requests are executed directly from your browser to Amazon S3 via `@aws-sdk/client-s3`.

#### S3 Bucket CORS Configuration

Because requests are sent directly from the browser to Amazon S3, your S3 bucket must have CORS enabled.

1. Go to the **AWS S3 Console** → select your bucket → **Permissions** tab.
2. Scroll to **Cross-origin resource sharing (CORS)** and paste the following configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://*.vercel.app",
      "https://*.github.io"
    ],
    "ExposeHeaders": ["ETag", "x-amz-server-side-encryption"]
  }
]
```

#### Recommended IAM Policy

For least-privilege security, create an IAM user with only the necessary S3 permissions for the target bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BrowserOSS3Access",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

---

### Available Scripts

| Command               | Description                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| `yarn install`        | Installs project dependencies                                              |
| `yarn build:prebuild` | Generates file system tree and search indexes in `public/.index/`          |
| `yarn dev`            | Runs the Next.js development server on `http://localhost:3000`             |
| `yarn build`          | Generates the static export bundle in `out/`                               |
| `yarn serve`          | Serves the static export locally                                           |
| `yarn test`           | Runs Jest unit tests                                                       |
| `yarn lint`           | Runs Oxlint linter for code quality                                        |
| `yarn e2e`            | Runs Playwright end-to-end tests (requires `yarn playwright install` once) |

---

### Troubleshooting

- **Virtual Desktop shows empty icons or filesystem errors:**
  Ensure you ran `yarn build:prebuild`. If files were added to `public/`, run `yarn build:prebuild` again.
- **S3 Connection fails with Network Error or CORS Error:**
  Verify that your AWS S3 bucket has the CORS permissions configured as described in the [S3 Bucket CORS Configuration](#s3-bucket-cors-configuration) section above.
- **Port 3000 is already in use:**
  Run `yarn dev -p 3001` or terminate the process occupying port 3000.
