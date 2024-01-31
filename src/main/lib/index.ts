import { appDirectoryName, fileEncoding, projectDirectory, welcomeNoteFileName } from "@shared/constants";
import { NoteInfo } from "@shared/models";
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from "@shared/types";
import { removeBOM } from '@utils/index';
import { dialog } from "electron";
import { ensureDir, readFile, readdir, remove, stat, writeFile } from "fs-extra";
import { isEmpty } from "lodash";
import path from "path";
import welcomeFile from "../../../resources/welcomeNote.md?asset";

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

  if(isEmpty(notes)) {
    console.info('No notes found, creating a welcome note')

    const content = await readFile(welcomeFile, {
      encoding: fileEncoding
    })

    await writeFile(`${rootDir}\\${welcomeNoteFileName}`, content, { encoding: fileEncoding })

    notes.push(welcomeNoteFileName)
  }

  return Promise.all(notes.map(getNoteInfoFromFileName))
}

export const getNoteInfoFromFileName = async (fileName: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}\\${fileName}`)

  return {
    title: fileName.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (filename) => {
  const rootDir = getRootDir()  
  const content = await readFile(`${rootDir}\\${filename}.md`, { encoding: fileEncoding })
  return removeBOM(content);
}

export const writeNote: WriteNote = async (fileName, content) => {
  const rootDir = getRootDir();

  console.info(`Writing note ${fileName}`);
  return writeFile(`${rootDir}\\${fileName}.md`, content, { encoding: fileEncoding })
}

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir();

  await ensureDir(rootDir);

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'New Note',
    defaultPath: `${rootDir}\\Untitled.md`,
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{
      name: 'Markdown',
      extensions: ['md']
    }]
  })

  if(canceled || !filePath) {
    console.info('Note creation cancaled')
    return false
  }

  const { name: fileName, dir: parentDir } = path.parse(filePath)

  if(parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creation failed',
      message: `All notes must be saved under ${rootDir},. Avoid using other directories.`,
    })

    return false
  }

  console.info(`Creating note: ${filePath}`)
  await writeFile(filePath, '')

  return fileName
}

export const deleteNote: DeleteNote = async (fileName) => {
  const rootDir = getRootDir();

  const {response} = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete note',
    message: `Are you sure you want to delete ${fileName}?`,
    buttons: ['Delete', 'Cancel'], // 0 is delete, 1 is cancel
    defaultId: 1,
    cancelId: 1
  })

  if(response === 1) {
    console.info(`Deleting note: ${fileName}`)
    return false;
  }

  console.info(`Deleting note: ${fileName}`)
  await remove(`${rootDir}\\${fileName}.md`)
  return true;
}