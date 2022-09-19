import * as core from '@actions/core'
import {archiveUrl} from './archive'
import fsPromises from 'fs/promises'
import {checkFileExists, OutputType} from './utils'

async function run(): Promise<void> {
  try {
    const token = core.getInput('web3_token')
    const url_path = core.getInput('url_file_path')
    const output_path = core.getInput('output_file_path') || 'saved.json'
    const output: OutputType[] = []
    const urls = (await fsPromises.readFile(url_path))
      .toString()
      .trim()
      .split('\n')
    const endpoint = new URL(core.getInput('web3_api'))
    for (let url of urls) {
      url = url.trim()
      const {contentID, title} = await archiveUrl(token, url, endpoint)
      output.push({
        title,
        url,
        cid: contentID,
        w3link: `https://w3s.link/ipfs/${contentID}`,
        timestamp: new Date().toString()
      })
    }
    const outputToSave = JSON.stringify(output, null, 2)
    if (!(await checkFileExists(output_path))) {
      await fsPromises.writeFile(output_path, outputToSave)
    } else {
      const fileContent = await fsPromises.readFile(output_path)
      let savedUrls: OutputType[] = JSON.parse(fileContent.toString() || '[]')
      savedUrls = [...savedUrls, ...output]
      await fsPromises.writeFile(
        output_path,
        JSON.stringify(savedUrls, null, 2)
      )
    }

    core.info(outputToSave)
    core.setOutput('output', outputToSave)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
