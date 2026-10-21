import { readFile, writeFile } from 'node:fs/promises'
import { render } from '../.ssr/entry-server.js'

const indexPath = new URL('../dist/index.html', import.meta.url)
const indexHtml = await readFile(indexPath, 'utf8')
const renderedApp = render()
const output = indexHtml.replace('<div id="root"></div>', `<div id="root">${renderedApp}</div>`)

if (output === indexHtml) {
  throw new Error('Unable to find the application root while prerendering.')
}

await writeFile(indexPath, output)
console.log('Prerendered the invitation into dist/index.html')
