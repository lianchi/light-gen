export function imageDataToDataUrl(data: ImageData) {
  const canvas = document.createElement('canvas')
  canvas.width = data.width
  canvas.height = data.height
  const ctx = canvas.getContext('2d')!
  ctx.putImageData(data, 0, 0)
  return canvas.toDataURL()
}

