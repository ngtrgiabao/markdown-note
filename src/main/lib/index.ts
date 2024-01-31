import { appDirectoryName, fileEncoding, projectDirectory } from "@shared/constants"
import { NoteInfo } from "@shared/models"
import { GetNotes, ReadNote } from "@shared/types"
import { ensureDir, readFile, readdir, stat } from "fs-extra"

export const getRootDir = () => {
  return `${projectDirectory}\\${appDirectoryName}`
}

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  return Promise.all(notes.map(getNoteInfoFromFileName))
}

export const getNoteInfoFromFileName = async (fileName: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${fileName}`)

  return {
    title: fileName.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (filename) => {
  const rootDir = getRootDir()  

  return readFile(`${rootDir}/${filename}.md`, { encoding: fileEncoding })
}
