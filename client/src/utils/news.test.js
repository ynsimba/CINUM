import { describe, expect, it } from 'vitest'
import { extractFirstImageSrcFromHtml, getNewsCoverSrc } from './news'

describe('news utils', () => {
  it('extracts first image src from html', () => {
    const src = extractFirstImageSrcFromHtml('<p>x</p><img src="/img/a.jpg" /><img src="/img/b.jpg" />')
    expect(src).toBe('/img/a.jpg')
  })

  it('prefers explicit cover image', () => {
    const value = getNewsCoverSrc({ coverImageUrl: '/cover.png', content: '<img src="/inline.png" />' })
    expect(value).toBe('/cover.png')
  })
})
