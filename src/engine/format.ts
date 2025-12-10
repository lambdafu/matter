/**
 * Number formatting utilities for display.
 *
 * These can be customized per topic or globally in the future.
 */

export type FormatStyle = 'scientific' | 'compact' | 'full'

interface FormatOptions {
  style?: FormatStyle
  precision?: number
  minForScientific?: number
}

const defaultOptions: FormatOptions = {
  style: 'scientific',
  precision: 1,
  minForScientific: 1000,
}

/**
 * Format a number for display in tight spaces (e.g., grid cells)
 */
export function formatCompact(value: number, options: FormatOptions = {}): string {
  const { style, precision, minForScientific } = { ...defaultOptions, ...options }

  const absValue = Math.abs(value)
  const truncated = Math.trunc(value)

  // Small numbers: show as-is
  if (absValue < (minForScientific ?? 1000)) {
    return truncated.toString()
  }

  switch (style) {
    case 'scientific':
      return formatScientific(value, precision ?? 1)
    case 'compact':
      return formatSIPrefix(value, precision ?? 1)
    case 'full':
    default:
      return truncated.toLocaleString()
  }
}

/**
 * Format in scientific notation: 1.2e6
 */
function formatScientific(value: number, precision: number): string {
  if (value === 0) return '0'

  const exponent = Math.floor(Math.log10(Math.abs(value)))
  const mantissa = value / Math.pow(10, exponent)

  // For cleaner display, adjust precision based on mantissa
  const mantissaStr = mantissa.toFixed(precision).replace(/\.?0+$/, '')

  return `${mantissaStr}e${exponent}`
}

/**
 * Format with SI prefixes: 1.2M, 3.4K
 */
function formatSIPrefix(value: number, precision: number): string {
  const prefixes = [
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ]

  const absValue = Math.abs(value)

  for (const prefix of prefixes) {
    if (absValue >= prefix.value) {
      const scaled = value / prefix.value
      return scaled.toFixed(precision).replace(/\.?0+$/, '') + prefix.symbol
    }
  }

  return Math.trunc(value).toString()
}

/**
 * Format a rate (per second) for display
 */
export function formatRate(value: number, options: FormatOptions = {}): string {
  const sign = value >= 0 ? '+' : ''
  const formatted = formatCompact(Math.abs(value), { ...options, minForScientific: 100 })
  return `${sign}${value < 0 ? '-' : ''}${formatted}/s`
}
