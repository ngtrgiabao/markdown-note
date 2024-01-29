import { createEmptyNoteAtom } from "@renderer/store"
import { useSetAtom } from "jotai"
import { LuFileSignature } from "react-icons/lu"
import { ActionButton, ActionButtonProps } from "./ActionButton"

export const NewNoteButton = ({ ...props }: ActionButtonProps) => {
  const createEmpyNote = useSetAtom(createEmptyNoteAtom);

  const handleCreation = () => {
    createEmpyNote()
  }

  return <ActionButton onClick={handleCreation} {...props}>
    <LuFileSignature className="w-4 h-4" />
  </ActionButton>
}
