import { useEffect, useState } from 'react'
import { detectIsRtl } from '../utils/textUtils'

export type DirectionMode = 'auto' | 'ltr' | 'rtl'

interface UseTextDirectionOptions {
  text: string
  initialMode?: DirectionMode
}

interface UseTextDirectionReturn {
  directionMode: DirectionMode
  setDirectionMode: (mode: DirectionMode) => void
  detectedRtl: boolean
  resolvedDirection: 'ltr' | 'rtl'
  directionLabel: string
}

/**
 * Custom hook to manage text direction (RTL/LTR) detection and manual override
 * @param options - Configuration options
 * @returns Text direction state and controls
 */
export function useTextDirection({
  text,
  initialMode = 'auto'
}: UseTextDirectionOptions): UseTextDirectionReturn {
  const [detectedRtl, setDetectedRtl] = useState(false)
  const [directionMode, setDirectionMode] = useState<DirectionMode>(initialMode)

  useEffect(() => {
    setDetectedRtl(detectIsRtl(text))
  }, [text])

  const resolvedDirection: 'ltr' | 'rtl' =
    directionMode === 'auto' ? (detectedRtl ? 'rtl' : 'ltr') : directionMode

  const directionLabel =
    directionMode === 'auto'
      ? `Auto (${detectedRtl ? 'RTL' : 'LTR'})`
      : `Set to ${directionMode.toUpperCase()}`

  return {
    directionMode,
    setDirectionMode,
    detectedRtl,
    resolvedDirection,
    directionLabel
  }
}
