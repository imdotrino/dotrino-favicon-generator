<template>
  <!-- Barra superior estándar del ecosistema (§5): marca + volver + idioma +
       perfil (§6.1) + moneda de support, todo en el componente compartido. La app
       no re-arma el header a mano ni tiene toggle propio: el idioma lo manda el
       topbar (persiste 'dotrino.lang' y avisa con 'dotrino-lang'). -->
  <dotrino-topbar
    ref="topbarRef"
    class="topbar"
    brand="Favicon Generator"
    icon="/icon.svg"
    brand-href="./"
    :lang.attr="lang"
    @dotrino-lang="onLang"
    profile
    support-href="https://ko-fi.com/dotrino"
    support-repo="imdotrino/dotrino-favicon-generator"
    support-discord="https://discord.gg/D648uq7cth"
  ></dotrino-topbar>

  <main class="page">
  <div class="container">
    <h1>Favicon Generator</h1>
    <p class="subtitle">{{ t.subtitle }}</p>

    <div class="file-input-container">
      <label class="file-input">
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          @change="handleFileSelect"
          ref="fileInput"
        />
        <span class="file-input-label">
          {{ selectedFile ? selectedFile.name : t.pick }}
        </span>
      </label>
    </div>

    <div v-if="imagePreview" class="preview-container">
      <h3 class="preview-title">{{ t.previewTitle }}</h3>
      <img :src="imagePreview" :alt="t.previewAlt" class="image-preview" />
    </div>

    <div class="button-group">
      <button
        class="btn btn-primary"
        @click="generateIco"
        :disabled="!selectedFile"
      >
        {{ t.btnIco }}
      </button>
      <button
        class="btn btn-secondary"
        @click="generateFavicon"
        :disabled="!selectedFile"
      >
        {{ t.btnFavicon }}
      </button>
      <button
        class="btn btn-tertiary"
        @click="generateAllPwaIcons"
        :disabled="!selectedFile"
      >
        {{ t.btnPwa }}
      </button>
    </div>

    <div v-if="statusMessage" :class="['status-message', statusType]">
      {{ statusMessage }}
    </div>
  </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import JSZip from 'jszip'
import '@dotrino/topbar'
import { getIdentity } from './services/identity'
import { getReputation } from './services/reputation'
import { detectLang, messages, type Lang, type Messages } from './i18n'

interface IcoFile {
  data: ArrayBuffer
  name: string
}

/* ---- Idioma (§9): lo manda <dotrino-topbar>. Arrancamos con su mismo criterio
   ('dotrino.lang' → idioma del navegador) y luego seguimos sus avisos. ---- */
const lang = ref<Lang>(detectLang())
const t = computed(() => messages[lang.value])

const onLang = (e: Event) => {
  const l = (e as CustomEvent<{ lang: Lang }>).detail?.lang
  if (l === 'es' || l === 'en') lang.value = l
}

/* ---- Identidad + perfil (§6.1): el topbar es dueño del modal "Mi perfil";
   la app solo le pasa los pilares (identity/reputation) y el tema. ---- */
const topbarRef = ref<any>(null)
const identityInst = ref<any>(null)
const reputationInst = ref<any>(null)

// Tema del modal de perfil, acorde a la paleta clara de la app (tarjeta blanca,
// texto #2c3e50, acento #3498db) para que no desentone con el resto.
const profileTheme = {
  '--ccp-bg': '#ffffff', '--ccp-bg-2': '#f8f9fa', '--ccp-bg-3': '#ecf0f1', '--ccp-bg-4': '#e4e9ec',
  '--ccp-border': '#bdc3c7', '--ccp-text': '#2c3e50', '--ccp-muted': '#7f8c8d',
  '--ccp-accent': '#3498db', '--ccp-accent-2': '#2980b9', '--ccp-accent-text': '#ffffff',
  '--ccp-gold': '#c98a00', '--ccp-derived': '#b07f00',
  '--ccp-online': '#2ecc71', '--ccp-affinity': '#3498db',
  '--ccp-input-bg': '#f8f9fa', '--ccp-radius': '12px',
  '--ccp-font': "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  '--ccp-font-headline': "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
}

watchEffect(() => {
  const tb = topbarRef.value
  if (!tb) return
  tb.identity = identityInst.value ?? null
  tb.reputation = reputationInst.value ?? null
  tb.profileTheme = profileTheme
})

onMounted(async () => {
  identityInst.value = await getIdentity()
  if (identityInst.value) reputationInst.value = await getReputation()
})

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string>('')
// Guardamos la CLAVE del mensaje, no el texto ya resuelto: así un aviso en
// pantalla también cambia de idioma si el usuario toca el toggle del topbar.
const statusKey = ref<keyof Messages | ''>('')
const statusMessage = computed(() => (statusKey.value ? t.value[statusKey.value] : ''))
const statusType = ref<'status-success' | 'status-error'>('status-success')

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  // Validate file type
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
  if (!validTypes.includes(file.type)) {
    showStatus('errType', 'status-error')
    return
  }

  selectedFile.value = file
  statusKey.value = ''

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const showStatus = (key: keyof Messages, type: 'status-success' | 'status-error' = 'status-success') => {
  statusKey.value = key
  statusType.value = type
  setTimeout(() => {
    statusKey.value = ''
  }, 5000)
}

const generateIco = async () => {
  if (!selectedFile.value) return

  try {
    // Convert image to canvas for processing
    const canvas = await createCanvasFromFile(selectedFile.value)
    
    // Create ICO file data
    const icoData = await generateIcoData(canvas)
    
    // Download the ICO file
    downloadFile(icoData.data, icoData.name)
    showStatus('okIco')
  } catch (error) {
    console.error('Error generating ICO:', error)
    showStatus('errIco', 'status-error')
  }
}

const generateFavicon = async () => {
  if (!selectedFile.value) return

  try {
    // Convert image to canvas for processing
    const canvas = await createCanvasFromFile(selectedFile.value)
    
    // Create favicon.ico file data
    const icoData = await generateIcoData(canvas, 'favicon.ico')
    
    // Download the favicon.ico file
    downloadFile(icoData.data, icoData.name)
    showStatus('okFavicon')
  } catch (error) {
    console.error('Error generating favicon:', error)
    showStatus('errFavicon', 'status-error')
  }
}

const generateAllPwaIcons = async () => {
  if (!selectedFile.value) return

  try {
    showStatus('pwaWorking')
    
    // Create canvas from file
    const canvas = await createCanvasFromFile(selectedFile.value)
    
    // Generate all PWA icons
    const zip = new JSZip()
    const iconsFolder = zip.folder('pwa-icons')
    
    if (!iconsFolder) {
      throw new Error('Could not create icons folder in ZIP')
    }

    // PWA icon sizes
    const pwaSizes = [
      { name: 'icon-192.png', size: 192 },
      { name: 'icon-512.png', size: 512 },
      { name: 'maskable-icon-512.png', size: 512 },
      { name: 'apple-touch-icon-180.png', size: 180 },
      { name: 'favicon-32.png', size: 32 },
      { name: 'favicon-16.png', size: 16 }
    ]

    // Generate each icon
    for (const icon of pwaSizes) {
      const iconCanvas = await resizeCanvas(canvas, icon.size, icon.size)
      const blob = await canvasToBlob(iconCanvas, 'image/png')
      iconsFolder.file(icon.name, blob)
    }

    // Generate manifest.json
    const manifest = {
      name: 'My PWA App',
      short_name: 'MyApp',
      description: 'My Progressive Web App',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#000000',
      icons: [
        {
          src: '/pwa-icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/pwa-icons/maskable-icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    }

    iconsFolder.file('manifest.json', JSON.stringify(manifest, null, 2))

    // Generate HTML snippet for iOS icons
    const htmlSnippet = `<!-- Add these to your HTML head section -->
<link rel="apple-touch-icon" href="/pwa-icons/apple-touch-icon-180.png">
<link rel="icon" type="image/png" sizes="32x32" href="/pwa-icons/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/pwa-icons/favicon-16.png">`

    iconsFolder.file('html-snippet.html', htmlSnippet)

    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    
    // Download ZIP
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pwa-icons.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    showStatus('okPwa')
  } catch (error) {
    console.error('Error generating PWA icons:', error)
    showStatus('errPwa', 'status-error')
  }
}

const createCanvasFromFile = (file: File): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.onload = () => {
        // Create canvas with standard favicon sizes
        const sizes = [16, 32, 48, 64, 128, 256]
        const maxSize = Math.max(...sizes)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        
        // Set canvas to largest size needed
        canvas.width = maxSize
        canvas.height = maxSize
        
        // Draw image centered and scaled to fit
        const scale = Math.min(maxSize / img.width, maxSize / img.height)
        const width = img.width * scale
        const height = img.height * scale
        const x = (maxSize - width) / 2
        const y = (maxSize - height) / 2
        
        ctx.clearRect(0, 0, maxSize, maxSize)
        ctx.drawImage(img, x, y, width, height)
        
        resolve(canvas)
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const generateIcoData = async (canvas: HTMLCanvasElement, filename: string = 'icon.ico'): Promise<IcoFile> => {
  // For this implementation, we'll create a simple ICO file structure
  // In a real implementation, you would use a library like 'to-ico'
  // but for simplicity, we'll create a basic version
  
  const sizes = [16, 32, 48, 64]
  const images: ArrayBuffer[] = []

  for (const size of sizes) {
    const resizedCanvas = document.createElement('canvas')
    const ctx = resizedCanvas.getContext('2d')!
    resizedCanvas.width = size
    resizedCanvas.height = size
    
    // Draw the image scaled to the target size
    ctx.drawImage(canvas, 0, 0, size, size)
    
    // Convert to PNG data
    const pngData = await new Promise<ArrayBuffer>((resolve) => {
      resizedCanvas.toBlob((blob) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as ArrayBuffer)
        reader.readAsArrayBuffer(blob!)
      }, 'image/png')
    })
    
    images.push(pngData)
  }

  // Create ICO file structure
  const icoFile = createIcoFile(images, sizes)
  
  return {
    data: icoFile,
    name: filename
  }
}

const createIcoFile = (images: ArrayBuffer[], sizes: number[]): ArrayBuffer => {
  // ICO file header
  const header = new Uint8Array([
    0x00, 0x00, // Reserved (2 bytes)
    0x01, 0x00, // Type: 1 for ICO (2 bytes)
    sizes.length, 0x00 // Number of images (2 bytes)
  ])

  // Calculate total size
  let totalSize = header.length + (16 * sizes.length) // Header + directory entries
  for (const image of images) {
    totalSize += image.byteLength
  }

  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)
  const uint8Array = new Uint8Array(buffer)

  // Write header
  uint8Array.set(header, 0)

  // Write directory entries and collect image data
  let currentOffset = header.length + (16 * sizes.length)
  let directoryOffset = header.length

  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i]
    const image = images[i]
    
    // Directory entry
    view.setUint8(directoryOffset, size) // Width
    view.setUint8(directoryOffset + 1, size) // Height
    view.setUint8(directoryOffset + 2, 0) // Color palette
    view.setUint8(directoryOffset + 3, 0) // Reserved
    view.setUint16(directoryOffset + 4, 1, true) // Color planes
    view.setUint16(directoryOffset + 6, 32, true) // Bits per pixel
    view.setUint32(directoryOffset + 8, image.byteLength, true) // Image size
    view.setUint32(directoryOffset + 12, currentOffset, true) // Image offset
    
    directoryOffset += 16
    
    // Copy image data
    uint8Array.set(new Uint8Array(image), currentOffset)
    currentOffset += image.byteLength
  }

  return buffer
}

const downloadFile = (data: ArrayBuffer, filename: string) => {
  const blob = new Blob([data], { type: 'image/x-icon' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const resizeCanvas = (sourceCanvas: HTMLCanvasElement, width: number, height: number): Promise<HTMLCanvasElement> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = width
    canvas.height = height
    
    // Draw the image scaled to the target size
    ctx.drawImage(sourceCanvas, 0, 0, width, height)
    resolve(canvas)
  })
}

const canvasToBlob = (canvas: HTMLCanvasElement, type: string = 'image/png'): Promise<Blob> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!)
    }, type)
  })
}
</script>