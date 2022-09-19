import fsPromises from 'fs/promises'
import fs from 'fs'
import which from 'which'

export async function checkFileExists(file: string): Promise<boolean> {
  try {
    await fsPromises.access(file, fs.constants.F_OK)
    return true
  } catch (error) {
    return false
  }
}

export function getBin(commands: string[]): string {
  let bin = 'chrome'
  let i: number
  for (i = 0; i < commands.length; i++) {
    try {
      if (which.sync(commands[i])) {
        bin = commands[i]
        break
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  return bin
}

export type ReturnType = {
  status: string
  message: string
  contentID: string
  title: string
}

export type OutputType = {
  title: string
  cid: string
  w3link: string
  url: string
  timestamp: string
}
