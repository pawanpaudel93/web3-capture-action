import fsPromises from 'node:fs/promises'
import {resolve} from 'path'

import {directory} from 'tempy'
import {getFilesFromPath, Web3Storage} from 'web3.storage'
import {Filelike} from 'web3.storage/src/lib/interface'

import {runBrowser} from './single-file'

type ReturnType = {
  status: string
  message: string
  contentID: string
  title: string
}

export const archiveUrl = async (
  token: string,
  url: string,
  endpoint: URL
): Promise<ReturnType> => {
  const tempDirectory = directory()

  await runBrowser({
    browserArgs:
      '["--no-sandbox", "--window-size=1920,1080", "--start-maximized"]',
    url,
    basePath: tempDirectory,
    output: resolve(tempDirectory, 'index.html'),
    localhost: false
  })
  const client = new Web3Storage({
    token,
    endpoint
  })
  const files = await getFilesFromPath(tempDirectory)
  // console.log(files);
  const cid = await client.put(files as Iterable<Filelike>, {
    wrapWithDirectory: false,
    maxRetries: 3
  })
  const data = (
    await fsPromises.readFile(resolve(tempDirectory, 'metadata.json'))
  ).toString()
  const {title} = JSON.parse(data)
  await fsPromises.rm(tempDirectory, {recursive: true, force: true})
  return {
    status: 'success',
    message: 'Uploaded to Web3.Storage!',
    contentID: cid,
    title
  }
}
