import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/cn'

interface ColorWheelProps {
  color: string
  onChange: (hex: string) => void
  className?: string
}

function hsvToHex(h: number, s: number, v: number) {
  const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`
}

function hexToHsv(hex: string) {
  let r = 0, g = 0, b = 0
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16) / 255
    g = parseInt(hex[2] + hex[2], 16) / 255
    b = parseInt(hex[3] + hex[3], 16) / 255
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16) / 255
    g = parseInt(hex.substring(3, 5), 16) / 255
    b = parseInt(hex.substring(5, 7), 16) / 255
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return { h: h * 360, s, v }
}

export function ColorWheel({ color, onChange, className }: ColorWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Calculate thumb position based on current hex color
  const hsv = hexToHsv(color)
  // angle in radians (subtract 90deg because hue 0 is at top)
  const angleRad = (hsv.h - 90) * (Math.PI / 180)
  const radiusPercent = hsv.s * 100
  
  // position relative to center (-50% to 50%)
  const thumbX = Math.cos(angleRad) * (radiusPercent / 2)
  const thumbY = Math.sin(angleRad) * (radiusPercent / 2)

  const handlePointer = (e: React.PointerEvent | PointerEvent) => {
    if (!wheelRef.current) return
    const rect = wheelRef.current.getBoundingClientRect()
    
    // relative to center
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Calculate angle in degrees, mapping top to 0
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90
    if (angle < 0) angle += 360
    
    const maxRadius = rect.width / 2
    const distance = Math.sqrt(x * x + y * y)
    const saturation = Math.min(1, distance / maxRadius)
    
    onChange(hsvToHex(angle, saturation, 1))
  }

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: PointerEvent) => handlePointer(e)
    const onUp = () => setIsDragging(false)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [isDragging])

  return (
    <div 
      ref={wheelRef}
      className={cn("relative rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.1)] touch-none cursor-crosshair", className)}
      style={{
        background: 'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
      }}
      onPointerDown={(e) => {
        setIsDragging(true)
        handlePointer(e)
      }}
    >
      {/* Saturation gradient overlay (white in center fading to transparent at edge) */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none" 
        style={{ background: 'radial-gradient(circle closest-side, #ffffff, transparent)' }} 
      />
      
      {/* Shadow overlay for depth */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)] pointer-events-none" />

      {/* Thumb indicator */}
      <div 
        className="absolute top-1/2 left-1/2 w-5 h-5 -mt-2.5 -ml-2.5 rounded-full border-[3px] border-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none transition-transform duration-75"
        style={{
          transform: `translate(${thumbX * 2}%, ${thumbY * 2}%)`,
          backgroundColor: color
        }}
      />
    </div>
  )
}
