// Bilingüe es/en (CONVENCIONES §9). Español neutro / tuteo, SIN voseo.
// Lenguaje llano (§9.1): hablamos del beneficio, no de la implementación.
//
// El idioma lo manda <dotrino-topbar>: persiste 'dotrino.lang' en localStorage y
// emite 'dotrino-lang' al cambiarlo. Esta app NO tiene toggle ni clave propios;
// `detectLang` solo replica el criterio del topbar para el primer render.

export type Lang = 'es' | 'en'

/** Clave del topbar (@dotrino/topbar). Única fuente de verdad del idioma. */
export const LANG_KEY = 'dotrino.lang'

export function detectLang (): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'es' || saved === 'en') return saved
  } catch (_) {}
  return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es'
}

export interface Messages {
  subtitle: string
  pick: string
  previewTitle: string
  previewAlt: string
  btnIco: string
  btnFavicon: string
  btnPwa: string
  errType: string
  okIco: string
  errIco: string
  okFavicon: string
  errFavicon: string
  pwaWorking: string
  okPwa: string
  errPwa: string
}

export const messages: Record<Lang, Messages> = {
  es: {
    subtitle: 'Convierte una imagen PNG o JPG en el icono que se ve en la pestaña del navegador. Todo aquí, en tu equipo: tu imagen no se sube a ningún lado.',
    pick: 'Elige una imagen PNG o JPG',
    previewTitle: 'Vista previa',
    previewAlt: 'La imagen que elegiste',
    btnIco: 'Crear archivo .ico',
    btnFavicon: 'Crear favicon.ico',
    btnPwa: 'Crear todos los iconos de la app',
    errType: 'Elige una imagen PNG o JPG.',
    okIco: '¡Listo! Se descargó tu archivo .ico.',
    errIco: 'No se pudo crear el archivo .ico. Inténtalo de nuevo.',
    okFavicon: '¡Listo! Se descargó tu favicon.ico.',
    errFavicon: 'No se pudo crear el favicon.ico. Inténtalo de nuevo.',
    pwaWorking: 'Creando los iconos…',
    okPwa: '¡Listo! Todos los iconos se descargaron en un ZIP.',
    errPwa: 'No se pudieron crear los iconos. Inténtalo de nuevo.',
  },
  en: {
    subtitle: 'Turn a PNG or JPG image into the icon that shows up in the browser tab. It all happens on your own device — your image is never uploaded.',
    pick: 'Choose a PNG or JPG image',
    previewTitle: 'Preview',
    previewAlt: 'The image you chose',
    btnIco: 'Create .ico file',
    btnFavicon: 'Create favicon.ico',
    btnPwa: 'Create every app icon',
    errType: 'Choose a PNG or JPG image.',
    okIco: 'Done — your .ico file has been downloaded.',
    errIco: "Couldn't create the .ico file. Please try again.",
    okFavicon: 'Done — your favicon.ico has been downloaded.',
    errFavicon: "Couldn't create favicon.ico. Please try again.",
    pwaWorking: 'Creating the icons…',
    okPwa: 'Done — all the icons downloaded in a ZIP.',
    errPwa: "Couldn't create the icons. Please try again.",
  },
}
