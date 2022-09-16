import fs from 'fs'

import fileUrl from 'file-url'
// eslint-disable-next-line import/no-commonjs, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const api = require('single-file-cli/single-file-cli-api')

async function run(options: {
  acceptHeaders?: {
    font: string
    image: string
    stylesheet: string
    script: string
    document: string
  }
  backEnd?: string
  basePath?: string
  blockMixedContent?: boolean
  browserServer?: string
  browserHeadless?: boolean
  browserExecutablePath?: string
  browserWidth?: number
  browserHeight?: number
  browserLoadMaxTime?: number
  browserWaitDelay?: number
  browserWaitUntil?: string
  browserWaitUntilFallback?: boolean
  browserDebug?: boolean
  browserArgs?: string
  browserStartMinimized?: boolean
  browserCookiesFile: any
  compressCSS?: undefined
  compressHTML?: undefined
  dumpContent?: boolean
  filenameTemplate?: string
  filenameConflictAction?: string
  filenameReplacementCharacter?: string
  filenameMaxLength?: number
  filenameMaxLengthUnit?: string
  groupDuplicateImages?: boolean
  maxSizeDuplicateImages?: number
  includeInfobar?: boolean
  insertMetaCsp?: boolean
  loadDeferredImages?: boolean
  loadDeferredImagesDispatchScrollEvent?: boolean
  loadDeferredImagesMaxIdleTime?: number
  loadDeferredImagesKeepZoomLevel?: boolean
  maxParallelWorkers?: number
  maxResourceSizeEnabled?: boolean
  maxResourceSize?: number
  moveStylesInHead?: boolean
  outputDirectory?: string
  removeHiddenElements?: boolean
  removeUnusedStyles?: boolean
  removeUnusedFonts?: boolean
  removeFrames?: boolean
  blockScripts?: boolean
  blockAudios?: boolean
  blockVideos?: boolean
  removeAlternativeFonts?: boolean
  removeAlternativeMedias?: boolean
  removeAlternativeImages?: boolean
  saveOriginalUrls?: boolean
  saveRawPage?: boolean
  webDriverExecutablePath?: string
  userScriptEnabled?: boolean
  includeBOM?: undefined
  crawlLinks?: boolean
  crawlInnerLinksOnly?: boolean
  crawlRemoveUrlFragment?: boolean
  crawlMaxDepth?: number
  crawlExternalLinksMaxDepth?: number
  crawlReplaceUrls?: boolean
  backgroundSave?: boolean
  crawlReplaceURLs?: boolean
  crawlRemoveURLFragment?: boolean
  insertMetaCSP?: boolean
  httpHeaders?: {}
  browserCookies: any
  browserScripts?: never[]
  browserStylesheets?: never[]
  crawlRewriteRules?: never[]
  emulateMediaFeatures?: never[]
  retrieveLinks?: boolean
  url: any
  output?: string
  urlsFile: any
}): Promise<void> {
  let urls: unknown[]
  if (options.url && !api.VALID_URL_TEST.test(options.url)) {
    options.url = fileUrl(options.url)
  }
  if (options.urlsFile) {
    urls = fs.readFileSync(options.urlsFile).toString().split('\n')
  } else {
    urls = [options.url]
  }
  if (options.browserCookiesFile) {
    const cookiesContent = fs
      .readFileSync(options.browserCookiesFile)
      .toString()
    try {
      options.browserCookies = JSON.parse(cookiesContent)
    } catch (error) {
      options.browserCookies = parseCookies(cookiesContent)
    }
  }
  const singlefile = await api.initialize(options)
  await singlefile.capture(urls)
  await singlefile.finish()
}

function parseCookies(textValue: string): object {
  const httpOnlyRegExp = /^#HttpOnly_(.*)/
  return textValue
    .split(/\r\n|\n/)
    .filter(
      (line: string) =>
        line.trim() && (!line.startsWith('#') || httpOnlyRegExp.test(line))
    )
    .map((line: string) => {
      const httpOnly = httpOnlyRegExp.test(line)
      if (httpOnly) {
        line = line.replace(httpOnlyRegExp, '$1')
      }
      const values = line.split(/\t/)
      if (values.length === 7) {
        return {
          domain: values[0],
          path: values[2],
          secure: values[3] === 'TRUE',
          expires: (values[4] && Number(values[4])) || undefined,
          name: values[5],
          value: values[6],
          httpOnly
        }
      }
      return undefined
    })
    .filter((cookieData: unknown) => cookieData)
}

export async function runBrowser({
  basePath,
  browserArgs,
  url,
  output,
  localhost
}: {
  basePath: string
  browserArgs: string
  url: string
  output: string
  localhost: boolean
}): Promise<void> {
  const args = {
    acceptHeaders: {
      font: 'application/font-woff2;q=1.0,application/font-woff;q=0.9,*/*;q=0.8',
      image: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      stylesheet: 'text/css,*/*;q=0.1',
      script: '*/*',
      document:
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    },
    backEnd: 'puppeteer',
    basePath,
    blockMixedContent: false,
    browserServer: '',
    browserHeadless: true,
    browserExecutablePath: '',
    browserWidth: 1280,
    browserHeight: 720,
    browserLoadMaxTime: 60000,
    browserWaitDelay: 0,
    browserWaitUntil: 'networkidle0',
    browserWaitUntilFallback: true,
    browserDebug: false,
    browserArgs,
    browserStartMinimized: false,
    browserCookiesFile: '',
    compressCSS: undefined,
    compressHTML: undefined,
    dumpContent: false,
    filenameTemplate: '{page-title} ({date-iso} {time-locale}).html',
    filenameConflictAction: 'uniquify',
    filenameReplacementCharacter: '_',
    filenameMaxLength: 192,
    filenameMaxLengthUnit: 'bytes',
    groupDuplicateImages: true,
    maxSizeDuplicateImages: 524288,
    includeInfobar: false,
    insertMetaCsp: true,
    loadDeferredImages: true,
    loadDeferredImagesDispatchScrollEvent: false,
    loadDeferredImagesMaxIdleTime: 1500,
    loadDeferredImagesKeepZoomLevel: false,
    maxParallelWorkers: 8,
    maxResourceSizeEnabled: false,
    maxResourceSize: 10,
    moveStylesInHead: false,
    outputDirectory: '',
    removeHiddenElements: true,
    removeUnusedStyles: true,
    removeUnusedFonts: true,
    removeFrames: false,
    blockScripts: true,
    blockAudios: true,
    blockVideos: true,
    removeAlternativeFonts: true,
    removeAlternativeMedias: true,
    removeAlternativeImages: true,
    saveOriginalUrls: false,
    saveRawPage: false,
    webDriverExecutablePath: '',
    userScriptEnabled: true,
    includeBOM: undefined,
    crawlLinks: false,
    crawlInnerLinksOnly: true,
    crawlRemoveUrlFragment: true,
    crawlMaxDepth: 1,
    crawlExternalLinksMaxDepth: 1,
    crawlReplaceUrls: false,
    backgroundSave: true,
    crawlReplaceURLs: false,
    crawlRemoveURLFragment: true,
    insertMetaCSP: true,
    httpHeaders: {},
    browserCookies: [],
    browserScripts: [],
    browserStylesheets: [],
    crawlRewriteRules: [],
    emulateMediaFeatures: [],
    retrieveLinks: true,
    localhost,
    url,
    output,
    urlsFile: ''
  }
  await run(args)
}
