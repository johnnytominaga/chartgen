export interface FontOption {
    family: string
    category: 'sans-serif' | 'serif' | 'monospace' | 'display'
}

export const FONT_OPTIONS: FontOption[] = [
    { family: 'Inter', category: 'sans-serif' },
    { family: 'Roboto', category: 'sans-serif' },
    { family: 'Open Sans', category: 'sans-serif' },
    { family: 'Lato', category: 'sans-serif' },
    { family: 'Poppins', category: 'sans-serif' },
    { family: 'Montserrat', category: 'sans-serif' },
    { family: 'Nunito', category: 'sans-serif' },
    { family: 'Raleway', category: 'sans-serif' },
    { family: 'Merriweather', category: 'serif' },
    { family: 'Playfair Display', category: 'serif' },
    { family: 'Lora', category: 'serif' },
    { family: 'PT Serif', category: 'serif' },
    { family: 'Libre Baskerville', category: 'serif' },
    { family: 'Source Code Pro', category: 'monospace' },
    { family: 'JetBrains Mono', category: 'monospace' },
    { family: 'Fira Code', category: 'monospace' },
    { family: 'Space Grotesk', category: 'display' },
    { family: 'Sora', category: 'display' },
    { family: 'DM Sans', category: 'display' },
    { family: 'Outfit', category: 'display' },
]

const loadedFonts = new Set<string>()

export function loadGoogleFont(family: string): void {
    if (loadedFonts.has(family)) return

    const linkId = `google-font-${family.replace(/\s+/g, '-').toLowerCase()}`
    if (document.getElementById(linkId)) {
        loadedFonts.add(family)
        return
    }

    const link = document.createElement('link')
    link.id = linkId
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;500;600;700&display=swap`
    document.head.appendChild(link)
    loadedFonts.add(family)
}

export function getGoogleFontURL(family: string): string {
    return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;500;600;700&display=swap`
}
