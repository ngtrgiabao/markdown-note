import { appDirectoryName, fileEncoding } from "@shared/constants"
import { ensureDir, readdir } from "fs-extra"
import { homedir } from "os"

export const getRootDir = () => {
  return `${homedir()}/${appDirectoryName}`
}

export const getNotes = async () => {
  const rootDir = getRootDir();

  await ensureDir(rootDir);

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })
}