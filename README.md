# ✿ TULIPA — A Living Botanical Cinema

> **"Every petal, placed with love."**
> A state-of-the-art interactive digital tulip field, growth studio, and auditory landscape.

TULIPA is an immersive, living frontend experience that blends botanical aesthetics with creative coding. Walk through color-coded micro-climates, witness curated tulip varieties react to your presence, control synthesized monsoon systems, and cultivate your own digital bouquet using a modular SVG rendering pipeline.

---

## ✦ Key Features

### 1. The Dawn Field (Hero Parallax)
* **Atmospheric Gradients:** A radial backdrop that transitions from void dark to dawn HSL gradients.
* **Multi-Layer Parallax:** Three distinct layered container planes populated by dynamic wind-swayed tulip fields.
* **Mist Veil & Float Physics:** Ambient floating mist orbs that react organically to scroll coordinates.
* **GSAP Choreography:** High-performance, letter-by-letter stagger animations revealing the title card upon load.

### 2. The Color Walk (Horizontal Cinema)
* **Pinned Scrolling:** Implements GSAP `ScrollTrigger` to lock vertical scroll and translate viewport movement horizontally.
* **Zone Progress HUD:** An active, section-aware progress indicator with custom HSL glowing indicators.
* **Dynamic Micro-Climates:** Five distinct color zones modeled on real-world cultivars, complete with variable wind sway intensities, depths, and densities:
  1. **Scarlet Forest** (*Tulipa Gesneriana* · Darwin Hybrid Red · 54°N)
  2. **Blush Garden** (*Tulipa Triumph* · Blush Pink Variety · 52°N)
  3. **Violet Dream** (*Tulipa Parrot* · Purple Variety · 51°N)
  4. **Golden Hour** (*Tulipa Fosteriana* · Golden Emperor · 53°N)
  5. **Snow Bloom** (*Tulipa Triumph* · Inzell White · 52°N)

### 3. Curated Bloom Gallery
* **Interactive Life Cycle:** Six specialized botanical cards featuring active SVG renders. On hover, the tulips transition from sleeping buds into full bloom stages.
* **Palette Breakdown:** Color swatch extractions representing the genetic color profile of each flower.
* **Studio Hand-Off:** One-click links that import the card's profile directly into the Interactive Studio.

### 4. The Monsoon Moment
* **HTML5 Rain Simulator:** A high-frequency canvas render loops rain streaks and falling petals with variable wind drifts and rotations.
* **Web Audio API Soundscape Synth:** A browser-native synthesizer generating ambient sounds:
  * *Mist Hum & Drizzle:* A white noise buffer processed through lowpass and highpass biquad filters to remove heavy low-end rumble.
  * *Water Drop Generative Sine:* Periodic sine wave oscillators starting at high frequencies and rapidly dropping pitch to simulate realistic water impacts.

### 5. Interactive Tulip Studio
A state-of-the-art customization suite allowing users to model unique botanical specimens:
* **Canvas Hue Wheel:** A custom HSL color space rendered to a canvas, enabling fine-grained color extraction via radial coordinates math.
* **Variegated Toggle:** Options to apply secondary color layers to alternate petals.
* **Structural Modifiers:** Fully adjustable stem height sliders (60px to 200px), petal count controls (3, 5, 6, or 8 petals), and petal shape selections (Rounded, Pointed, and Ruffled).
* **Planted Accumulator:** A botanical tray where created flowers are animated from the studio canvas using wind sway loop triggers and synthesized audio feedback ("pop" sounds).
* **Bouquet Sharing:** Encodes the entire SVG state into URL search parameters for clipboard copy and instant sharing.

---

## ✦ System Architecture & Design Details

### Technologies Used
* **Framework:** Vanilla HTML5, CSS3, and ES6+ JavaScript.
* **Animation Suite:** [GreenSock Animation Platform (GSAP)](https://greensock.com/gsap/) with `ScrollTrigger` & `ScrollToPlugin`.
* **Sound Generation:** Web Audio API (Fully synthesized, zero-audio-files required).
* **Vector Render Pipeline:** Dynamic XML-compliant inline SVG rendering.

### Design Tokens (CSS Custom Properties)
The application is built on a custom design system centered around deep field darkness and neon botanical highlights:
* `--void` (#0B0715): Deepest field midnight background.
* `--field-depth` (#1A0A2E): Violet horizon night shadow.
* `--monsoon-mist` (#F0EAF8): Lavender off-white text.
* `--velvet-rose` (#E8A0BF): Soft dusty pink warmth.
* `--tulip-violet` (#9B5DE5): Electric lavender accents.
* `--golden-hour` (#F4C842): Warm gold highlights.
* `--botanical-green` (#2A5C45): Deep forest green stems.

---

## ✦ Getting Started & Local Development

### Prerequisites
To run TULIPA locally, you only need a modern web browser. The project requires no build tools or package installation.

### Running the Project
1. Clone or download this repository.
2. Open the [index.html](file:///c:/Users/rishi/OneDrive/Desktop/tulip-test/Tulipa/index.html) file directly in any modern browser, or run a local development server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node (npx)
   npx serve .
   ```
3. Open `http://localhost:8000` (or the respective port) to view the application.

---

## ✦ Creative Credits
Created with ✿ by Rishi in 2026.
