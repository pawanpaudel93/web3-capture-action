import fsPromises from 'node:fs/promises'
import {resolve} from 'path'
import {directory} from 'tempy'
import {getFilesFromPath, Web3Storage} from 'web3.storage'
import {Filelike} from 'web3.storage/src/lib/interface'
import {execFile} from 'promisify-child-process'

import {ReturnType, getBin} from './utils'

const SINGLEFILE_EXECUTABLE = './node_modules/single-file-cli/single-file'
const BROWSER_ARGS =
  '["--no-sandbox", "--window-size=1920,1080", "--start-maximized"]'

export const archiveUrl = async (
  token: string,
  url: string,
  endpoint: URL
): Promise<ReturnType> => {
  const tempDirectory = directory()

  const command = [
    `--browser-executable-path=${getBin([
      'google-chrome',
      'google-chrome-stable',
      'chrome'
    ])}`,
    `--browser-args='${BROWSER_ARGS}'`,
    url,
    `--output=${resolve(tempDirectory, 'index.html')}`,
    `--base-path=${tempDirectory}`,
    `--localhost=${!process.env.AWS_LAMBDA_FUNCTION_VERSION}`
  ]
  const {stderr} = await execFile(SINGLEFILE_EXECUTABLE, command)
  if (stderr) {
    return {
      status: 'error',
      message: stderr.toString(),
      contentID: '',
      title: ''
    }
  }
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
