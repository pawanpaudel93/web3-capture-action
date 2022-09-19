import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import 'dotenv/config'
// // shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  //   process.env['INPUT_WEB3_TOKEN'] = <plz_set>
  process.env.INPUT_WEB3_API = 'https://api-staging.web3.storage'
  process.env.INPUT_URL_FILE_PATH = path
    .join(__dirname, '..', 'urls.txt')
    .toString()

  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  const output = cp.execFileSync(np, [ip], options).toString()
  console.log(output)
  // expect(output).toContain(
  //   'Web3 Storage - Simple file storage with IPFS & Filecoin'
  // )
})
