import { appDirectoryName, fileEncoding, projectDirectory } from "@shared/constants";
import { NoteInfo } from "@shared/models";
import { CreateNote, GetNotes, ReadNote, WriteNote } from "@shared/types";
import { removeBOM } from '@utils/index';
import { dialog } from "electron";
import { ensureDir, readFile, readdir, stat, writeFile } from "fs-extra";
import path from "path";

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
  const fileStats = await stat(`${getRootDir()}\\${fileName}`)

  return {
    title: fileName.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (filename) => {
  const rootDir = getRootDir()  
  const content = await readFile(`${rootDir}\\${filename}.md`, { encoding: fileEncoding })
  console.log(content)
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