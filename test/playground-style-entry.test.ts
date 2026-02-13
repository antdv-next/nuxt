import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('playground style entry', () => {
  it('uses static antd.css for zero-runtime mode', () => {
    const entryCssPath = resolve(process.cwd(), 'playground/assets/entry.css')
    const entryCss = readFileSync(entryCssPath, 'utf8')

    expect(entryCss).toContain('@import "antdv-next/dist/reset.css";')
    expect(entryCss).toContain('@import "antdv-next/dist/antd.css";')
  })
})
