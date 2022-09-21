import fsPromises from 'node:fs/promises'
import {directory} from 'tempy'
import {getFilesFromPath, Web3Storage} from 'web3.storage'
import {Filelike} from 'web3.storage/src/lib/interface'
import {execFile} from 'promisify-child-process'

import Moralis from 'moralis'
import glob from 'glob'
import path from 'path'
import fs from 'fs'

import {ReturnType, getBin} from './utils'

const SINGLEFILE_EXECUTABLE = './node_modules/single-file-cli/single-file'
const BROWSER_ARGS =
  '["--no-sandbox", "--window-size=1920,1080", "--start-maximized"]'

export const archiveUrl = async (
  token: string,
  url: string,
  endpoint: URL,
  service: string
): Promise<ReturnType> => {
  let cid = ''
  const tempDirectory = directory()

  const command = [
    `--browser-executable-path=${getBin([
      'google-chrome',
      'google-chrome-stable',
      'chrome'
    ])}`,
    `--browser-args='${BROWSER_ARGS}'`,
    url,
    `--output=${path.resolve(tempDirectory, 'index.html')}`,
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
  if (service === 'web3.storage') {
    const client = new Web3Storage({
      token,
      endpoint
    })
    const files = await getFilesFromPath(tempDirectory)
    // console.log(files);
    cid = await client.put(files as Iterable<Filelike>, {
      wrapWithDirectory: false,
      maxRetries: 3
    })
  } else {
    const files = glob.sync(path.join(tempDirectory, `/**/*.*`), {
      nodir: true
    })
    const abi = files.map(filePath => ({
      path: filePath.replace(path.join(tempDirectory, '/').toString(), ''),
      content: fs.readFileSync(filePath, {encoding: 'base64'})
    }))
    await Moralis.start({
      apiKey: token
    })

    const response = await Moralis.EvmApi.ipfs.uploadFolder({
      abi
    })
    cid = response?.result[0].path.match('/ipfs/(.*?)/')?.[1] as string
  }
  const data = (
    await fsPromises.readFile(path.resolve(tempDirectory, 'metadata.json'))
  ).toString()
  const {title} = JSON.parse(data)
  await fsPromises.rm(tempDirectory, {recursive: true, force: true})
  return {
    status: 'success',
    message: `Uploaded to ${service}!`,
    contentID: cid,
    title
  }
}
