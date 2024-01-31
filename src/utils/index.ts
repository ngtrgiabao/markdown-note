import { NoteContent } from "@shared/models";

// BOM: Byte Order Mark
export const removeBOM = (content: NoteContent)=> {
  if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
  }

  return content
}