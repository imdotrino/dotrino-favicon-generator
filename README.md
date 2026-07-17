# Favicon Generator

> **Parte del ecosistema [Dotrino](https://dotrino.com).** Dotrino es un ecosistema de aplicaciones centradas en la privacidad de los datos: tu información es tuya, y las decisiones sobre ella también — qué compartes, con quién, cuándo y por qué. Sin anuncios, sin cookies, sin rastreo de datos, sin vender tu identidad a nadie.

[![Live App](https://img.shields.io/badge/Live-App-brightgreen)](https://dotrino.github.io/favicon-generator)

A Progressive Web App (PWA) built with Vite, TypeScript, and Vue that allows you to convert PNG/JPG images to Windows-compatible .ico files and favicon.ico files.

**Live App**: [https://dotrino.github.io/favicon-generator](https://dotrino.github.io/favicon-generator)

## Features

- **Image Selection**: Upload PNG or JPG images
- **ICO Generation**: Create Windows-compatible .ico files with multiple sizes (16x16, 32x32, 48x48, 64x64)
- **Favicon Generation**: Generate standard favicon.ico files
- **PWA Support**: Install as a Progressive Web App
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Preview**: See your image before generating the icon

## Project Structure

```
favicon-generator/
├── src/
│   ├── App.vue          # Main application component
│   ├── main.ts          # Vue application entry point
│   └── style.css        # Application styles
├── package.json         # Project dependencies and scripts
├── vite.config.ts       # Vite configuration with PWA plugin
├── tsconfig.json        # TypeScript configuration
├── index.html           # HTML template
└── env.d.ts            # TypeScript environment declarations
```

## Setup Instructions

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## Usage

1. **Select an Image**: Click on the file input area and choose a PNG or JPG image
2. **Preview**: See your selected image in the preview area
3. **Generate ICO**: Click "Generate .ico File" to create a Windows-compatible icon
4. **Generate Favicon**: Click "Generate favicon.ico" to create a standard favicon

## Technical Details

### ICO File Format

The application generates ICO files that include multiple image sizes:
- 16x16 pixels
- 32x32 pixels  
- 48x48 pixels
- 64x64 pixels

This ensures compatibility with various Windows applications and contexts.

### PWA Features

- **Offline Support**: Service worker caches assets for offline use
- **Installable**: Can be installed as a standalone app
- **Auto Updates**: Automatically updates when new versions are available

### Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Dependencies

### Core Dependencies
- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and development server

### PWA Dependencies
- **vite-plugin-pwa**: PWA support for Vite
- **workbox-window**: Service worker management

## Development

The application uses modern web technologies:
- **Vue 3 Composition API** with `<script setup>` syntax
- **TypeScript** for type safety
- **CSS3** with modern features and responsive design
- **Canvas API** for image processing and ICO generation

## License

This project is open source and available under the MIT License.
