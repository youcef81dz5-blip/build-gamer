# Build & Burn

Role: You are an expert Full-Stack Web Developer and UI/UX Designer specializing in Gaming Platforms and Progressive Web Apps (PWA).

Objective: 

I want to build a modern, high-performance PC Builder web application that functions like "PCPartPicker", fully convertible into a Progressive Web App (PWA). In addition to core build features, the site must feature a dynamic "Game Performance & FPS Estimator" based on the selected hardware.

Design & UI/UX Style:

- Aesthetic: Modern Gaming / Dark Cyberpunk Style (Deep dark backgrounds with neon/RGB glow accents).

- Interface: Clean, intuitive, highly responsive, and easy to navigate for non-technical users.

- PWA Features: Installable on Mobile/Desktop, offline caching support, and fast load times.

Key Features & Modules required:

1. PC Part Builder & Compatibility Checker:

   - Interactive list of PC components (CPU, GPU, Motherboard, RAM, Storage, PSU, Cooler, Case).

   - Automated Real-time Compatibility Engine: Checks socket types (e.g., AM5, LGA1700), RAM types (DDR4/DDR5), form factors (ATX, Micro-ATX), and TDP power usage.

   - Live Total Price & Estimated Wattage calculation.

   - Import/Export/Share Build functionality (Generates unique shareable links or PDF summaries).

2. Dynamic Gaming Performance & FPS Predictor:

   - Automatically analyzes the user's current PC Build.

   - Displays a grid of popular global AAA & Esports games (e.g., Cyberpunk 2077, Valorant, Warzone, GTA VI/V, Fortnite).

   - Shows predicted FPS and performance status (e.g., "60 FPS @ 1080p Ultra", "120 FPS @ 1440p High") with resolution toggles (1080p, 1440p, 4K).

   - Highlights potential hardware bottlenecks (e.g., "CPU bottleneck detected").

3. Filters & Search Engine:

   - Advanced filtering options by price range, brand (NVIDIA, AMD, Intel, Corsair, etc.), specs, and user reviews.

Tech Stack Requirements:

- Frontend: Next.js (React), Tailwind CSS, Framer Motion, Lucide-react icons.

- Backend/Database Schema: PostgreSQL (Prisma ORM) or MongoDB structure for PC Parts and Game Benchmarks.

- PWA Integration: next-pwa.

Please provide:

1. Complete Architecture & Folder Structure for the project.

2. The Database Schema (Prisma/SQL or JSON model) for Parts, Compatibility Rules, and Game Performance matrix.

3. Code templates for the Compatibility Engine logic and the UI Layout components.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://build-gamer.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5e0ac7df-f306-4fca-9d14-dacf72b4a1ae).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
