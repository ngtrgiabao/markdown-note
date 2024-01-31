// BOM: Byte Order Mark
export const removeBOM = (content)=> {
  if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
  }

  return content
}