import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import 'dotenv/config'
// // shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  //   process.env['INPUT_WEB3_TOKEN'] = <plz_set>
  process.env.INPUT_WEB3_API = 'https://api-staging.web3.storage'
  process.env['INPUT_URL'] = 'https://web3.storage'

  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  const output = cp.execFileSync(np, [ip], options).toString()
  console.log(output)
})
