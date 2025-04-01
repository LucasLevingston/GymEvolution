export function base64ToFile(base64String: string, filename: string): File {
  const match = base64String.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) {
    throw new Error('Invalid base64 string format')
  }

  const contentType = match[1]
  const base64Data = match[2]

  // Convert base64 to binary
  const binaryString = atob(base64Data)
  const bytes = new Uint8Array(binaryString.length)

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  // Create Blob and File
  const blob = new Blob([bytes], { type: contentType })
  return new File([blob], filename, { type: contentType })
}
