'use client'

import { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { FONT_OPTIONS, loadGoogleFont } from '@/lib/font-utils'

interface FontSelectorProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

const SYSTEM_DEFAULT = '__system__'

const grouped = {
    'Sans Serif': FONT_OPTIONS.filter((f) => f.category === 'sans-serif'),
    'Serif': FONT_OPTIONS.filter((f) => f.category === 'serif'),
    'Monospace': FONT_OPTIONS.filter((f) => f.category === 'monospace'),
    'Display': FONT_OPTIONS.filter((f) => f.category === 'display'),
}

export function FontSelector({ value, onChange, disabled }: FontSelectorProps) {
    // Preload all fonts for preview
    useEffect(() => {
        FONT_OPTIONS.forEach((font) => loadGoogleFont(font.family))
    }, [])

    const handleChange = (val: string) => {
        if (val === SYSTEM_DEFAULT) {
            onChange('')
            return
        }
        loadGoogleFont(val)
        onChange(val)
    }

    return (
        <div className="space-y-2">
            <Label>Font</Label>
            <Select value={value || SYSTEM_DEFAULT} onValueChange={handleChange} disabled={disabled}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={SYSTEM_DEFAULT}>
                        System Default (Geist)
                    </SelectItem>
                    {Object.entries(grouped).map(([category, fonts]) => (
                        <SelectGroup key={category}>
                            <SelectLabel>{category}</SelectLabel>
                            {fonts.map((font) => (
                                <SelectItem key={font.family} value={font.family}>
                                    <span style={{ fontFamily: font.family }}>
                                        {font.family}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
