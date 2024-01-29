import { useNotesList } from "@renderer/hooks/useNotesList"
import { notesMock } from "@renderer/store/mocks"
import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { NotePreview } from "./NotePreview"

export type NotePreviewListProps = ComponentProps<'ul'> & {
  onSelect?: () => void
}

export const NotePreviewList = ({ onSelect, className, ...props }: NotePreviewListProps) => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({ onSelect })

  if (notesMock.length === 0) {
    return (
      <ul className={twMerge('text-center pt-4', className)}>
        <span>No notes yet</span>
      </ul>
    )
  }

  return (
    <ul className={className} {...props}>{notes.map((note, index) => (
      <NotePreview key={note.title + note.lastEditTime} {...note} isActive={selectedNoteIndex === index} onClick={handleNoteSelect(index)} {...note} />
    ))}</ul>
  )
}
