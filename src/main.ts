import * as core from '@actions/core'
import {archiveUrl} from './archive'

async function run(): Promise<void> {
  try {
    const token = core.getInput('web3_token')
    const url = core.getInput('url')
    const endpoint = new URL(core.getInput('web3_api'))
    const {contentID, title} = await archiveUrl(token, url, endpoint)
    const ipfsUrl = `https://w3s.link/ipfs/${contentID}`
    core.info(ipfsUrl)
    core.setOutput('cid', contentID)
    core.setOutput('title', title)
    core.setOutput('url', ipfsUrl)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
