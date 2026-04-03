const sanitizeHtml = require('sanitize-html');

/** Longueur du texte visible (hors balises), pour la validation minimale. */
function plainTextLength(html) {
  if (!html || typeof html !== 'string') return 0;
  const stripped = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return stripped.length;
}

/**
 * HTML éditeur (actualités / articles) : balises sûres + iframes vidéo connues + médias hébergés.
 */
function sanitizeEditorHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return sanitizeHtml(html, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'strike',
      'sub',
      'sup',
      'h1',
      'h2',
      'h3',
      'h4',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'blockquote',
      'pre',
      'code',
      'video',
      'audio',
      'source',
      'span',
      'div',
      'iframe',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      video: ['src', 'controls', 'width', 'height', 'preload'],
      audio: ['src', 'controls', 'preload'],
      source: ['src', 'type'],
      iframe: ['src', 'width', 'height', 'allowfullscreen', 'allow', 'title', 'frameborder', 'loading'],
      '*': ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'relative'],
      audio: ['http', 'https', 'relative'],
      video: ['http', 'https', 'relative'],
      source: ['http', 'https', 'relative'],
      iframe: ['http', 'https'],
    },
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || '';
        if (href && !/^(https?:|mailto:|tel:)/i.test(href) && !href.startsWith('/')) {
          return { tagName: 'span', attribs: {} };
        }
        if (attribs.target === '_blank') {
          attribs.rel = 'noopener noreferrer';
        }
        return { tagName, attribs };
      },
      iframe: (_tagName, attribs) => {
        const src = attribs.src || '';
        const ok =
          /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.be)\//i.test(src) ||
          /^https:\/\/(player\.)?vimeo\.com\//i.test(src) ||
          /^https:\/\/www\.dailymotion\.com\/embed\//i.test(src);
        if (!ok) {
          return { tagName: 'span', attribs: {}, text: '' };
        }
        return {
          tagName: 'iframe',
          attribs: {
            src: attribs.src,
            width: attribs.width || '560',
            height: attribs.height || '315',
            allowfullscreen: true,
            title: attribs.title || 'Vidéo',
            loading: 'lazy',
          },
        };
      },
    },
  });
}

module.exports = { sanitizeEditorHtml, plainTextLength };
