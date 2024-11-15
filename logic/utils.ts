// @ts-expect-error no types
import chroma from 'chroma-js'

export function getAspectRatio(width: number, height: number) {
  const gcd = (a: number, b: number): number => {
    if (!b)
      return a
    return gcd(b, a % b)
  }
  const ratio = gcd(width, height)
  if (ratio > 3)
    return `${width / ratio}:${height / ratio}`
  return `${width}:${height}`
}

export function colorHexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!result)
    return null
  return [
    Number.parseInt(result[1], 16),
    Number.parseInt(result[2], 16),
    Number.parseInt(result[3], 16),
  ]
}

export function colorRgbToHex(rgb: number[]) {
  return `#${rgb.map(c => Math.round(c).toString(16).padStart(2, '0')).join('')}`
}

/**
 * 根据输入的十六进制颜色值，生成从浅到深的5个相匹配的颜色值。
 * @param hexColor - 输入的十六进制颜色值
 * @returns string[] - 返回5个颜色值，第1个最浅，第3个为输入颜色，第5个最深
 */
export function generateColorShades(hexColor: string): string[] {
  if (!hexColor || !chroma.valid(hexColor))
    return []
  // 将输入颜色调整为中间亮度 (L=50) 的颜色
  const middleColor = chroma(hexColor).set('lab.l', 50)

  // 基于中间色生成浅色和深色
  return [
    middleColor.brighten(2).hex(),
    middleColor.brighten(1).hex(),
    middleColor.hex(),
    middleColor.darken(1).hex(),
    middleColor.darken(2).hex(),
  ]
}

