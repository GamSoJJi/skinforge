# SkinForge

A browser-based Minecraft skin editor. Draw directly on the UV map and see your changes reflected on a 3D character in real time.

## Features

- **Real-time 3D preview** — skinview3d renders your skin on a rotating character as you paint
- **Pixel editor** — full 64×64 UV map with body part labels and guides
- **Tools** — brush, eraser, fill, eyedropper, color replace, rectangle select, magic wand
- **Mirror Stamp** — hover over any body part to highlight it; left-click stamps left→right, right-click stamps right→left. Leg/arm pairs highlight both sides at once and copy with proper face remapping (Front↔Front, Right↔Left, etc.)
- **Pluck (따오기)** — composite two skins by selecting a region on one and stamping it onto another
- **Brush options** — square or circle shape, sizes 1–16
- **Selection modes** — single (replace), add, subtract; works with both rect select and magic wand
- **Color history palette** — colors you use push to the front; right-click any slot to pin it
- **Skin color palette** — extract every color from the current skin at a glance
- **Undo / Redo** — up to 50 steps (Cmd+Z / Ctrl+Z)
- **Normal / Slim arm toggle** — UV guide switches between Alex and Steve proportions
- **Import / Export** — load any 64×64 PNG skin, save your work as a PNG

## Getting Started

### Requirements

- Node.js 18+
- yarn (or npm)

### Install & run

```bash
git clone https://github.com/your-username/skinforge.git
cd skinforge
yarn install
yarn dev
```

Open `http://localhost:5173` in your browser.

### Build for production

```bash
yarn build
yarn preview
```

## Usage

### Drawing

| Tool | Shortcut | What it does |
|---|---|---|
| Brush | `B` | Paint pixels with the active color |
| Eraser | `E` | Make pixels transparent |
| Fill | `G` | Flood-fill a connected region |
| Eyedropper | `I` | Pick a color from the canvas |
| Color Replace | `R` | Replace all pixels of the clicked color |
| Rect Select | `M` | Draw a rectangle selection |
| Magic Wand | `W` | Select connected pixels of the same color |
| Mirror Stamp | — | Stamp a body part's texture onto its mirror side |

- **Left-click drag** to paint continuously
- **`[` / `]`** to decrease / increase brush size (or adjust magic wand tolerance)
- Press `Esc` to clear the active selection
- Hold a selection to restrict all paint operations inside it

### Mirror Stamp

Activate the mirror stamp tool (↔ in the toolbar), then hover over the skin UV map. The body part under your cursor — and its paired opposite (e.g. both legs) — highlights in blue.

- **Left-click** — copy the left part to the right, with face remapping + horizontal flip
- **Right-click** — copy the right part to the left

For unpaired parts (head, hat, body, jacket) the stamp mirrors the UV left or right half within the same part.

### Pluck (따오기)

Open Pluck mode from the toolbar (shirt icon). Load a second skin, select a region on it with rect select or magic wand, then click **Pluck** to copy that region onto your working skin.

### Color palette

- The **기록 (History)** tab shows the colors you've used most recently. New colors push existing ones to the right.
- **Right-click** any palette slot to **pin** it — pinned colors stay in place and won't get pushed out (marked with a red corner triangle).
- The **Skin** tab extracts every color currently in the skin.

### Undo / Redo

| Action | Mac | Windows / Linux |
|---|---|---|
| Undo | `⌘Z` | `Ctrl+Z` |
| Redo | `⌘⇧Z` | `Ctrl+Y` |

The ↩ / ↪ buttons in the bottom bar are disabled when there is nothing to undo or redo.

### Import / Export

- **파일 → 불러오기** — load a 64×64 PNG skin file
- **파일 → 내보내기** — download the current skin as `my_skin.png`

## Tech Stack

| Library | Purpose |
|---|---|
| [React](https://react.dev) + [Vite](https://vitejs.dev) | UI framework and build tool |
| [skinview3d](https://github.com/bs-community/skinview3d) | Three.js-based Minecraft skin renderer |
| [react-colorful](https://github.com/omgovich/react-colorful) | Lightweight color picker |
| Canvas API | Pixel editor and UV map rendering |

## Project Structure

```
skinforge/
├── public/               # Static assets (favicon, default skin)
├── src/
│   ├── App.jsx           # Root component, shared state
│   ├── App.css           # Global styles
│   ├── components/
│   │   ├── PixelEditor.jsx     # Canvas-based UV map editor
│   │   ├── SkinViewer3D.jsx    # skinview3d wrapper
│   │   ├── ToolPanel.jsx       # Tool buttons
│   │   ├── ColorPanel.jsx      # Color picker and palette
│   │   └── SkinMergeModal.jsx  # Pluck (따오기) compositor
│   ├── utils/
│   │   ├── skinLayout.js       # UV part definitions and guide rendering
│   │   └── symmetry.js         # Mirror stamp logic (part grouping, face remapping)
│   └── i18n/                   # Korean / English strings
└── index.html
```

## Contributing

Pull requests are welcome. For larger changes, open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes
4. Open a pull request

## License

MIT
