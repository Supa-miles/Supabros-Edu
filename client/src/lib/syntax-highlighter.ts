// Syntax highlighting utilities using Prism.js concepts
// This is a simplified version for demonstration

export interface HighlightOptions {
  language: string;
  showLineNumbers?: boolean;
}

export function highlightCode(code: string, options: HighlightOptions): string {
  const { language } = options;
  
  // Simple syntax highlighting patterns
  const patterns: Record<string, Array<{ regex: RegExp; className: string }>> = {
    javascript: [
      { regex: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|typeof|instanceof)\b/g, className: 'syntax-keyword' },
      { regex: /(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, className: 'syntax-string' },
      { regex: /\/\/.*$/gm, className: 'syntax-comment' },
      { regex: /\/\*[\s\S]*?\*\//g, className: 'syntax-comment' },
      { regex: /\b\d+(\.\d+)?\b/g, className: 'syntax-number' }
    ],
    html: [
      { regex: /(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)/g, className: 'syntax-tag' },
      { regex: /(\w+)(=)/g, className: 'syntax-attribute' },
      { regex: /(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, className: 'syntax-string' },
      { regex: /&lt;!--[\s\S]*?--&gt;/g, className: 'syntax-comment' }
    ],
    css: [
      { regex: /([a-zA-Z-]+)(\s*:)/g, className: 'syntax-property' },
      { regex: /(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, className: 'syntax-string' },
      { regex: /\/\*[\s\S]*?\*\//g, className: 'syntax-comment' },
      { regex: /#[a-fA-F0-9]{3,6}\b/g, className: 'syntax-color' }
    ],
    python: [
      { regex: /\b(def|class|if|else|elif|for|while|try|except|finally|with|as|import|from|return|yield|lambda|and|or|not|in|is|None|True|False)\b/g, className: 'syntax-keyword' },
      { regex: /(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, className: 'syntax-string' },
      { regex: /#.*$/gm, className: 'syntax-comment' },
      { regex: /\b\d+(\.\d+)?\b/g, className: 'syntax-number' }
    ],
    sql: [
      { regex: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|INDEX|ALTER|DROP|JOIN|INNER|LEFT|RIGHT|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|DISTINCT|AS|AND|OR|NOT|NULL|PRIMARY|KEY|FOREIGN|REFERENCES)\b/gi, className: 'syntax-keyword' },
      { regex: /(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, className: 'syntax-string' },
      { regex: /--.*$/gm, className: 'syntax-comment' },
      { regex: /\/\*[\s\S]*?\*\//g, className: 'syntax-comment' }
    ]
  };

  let highlightedCode = escapeHtml(code);
  const languagePatterns = patterns[language] || [];

  languagePatterns.forEach(({ regex, className }) => {
    highlightedCode = highlightedCode.replace(regex, (match, ...groups) => {
      return `<span class="${className}">${match}</span>`;
    });
  });

  return highlightedCode;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function addSyntaxHighlighting() {
  // Add CSS classes for syntax highlighting
  const style = document.createElement('style');
  style.textContent = `
    .syntax-keyword { color: #569cd6; font-weight: bold; }
    .syntax-string { color: #ce9178; }
    .syntax-comment { color: #6a9955; font-style: italic; }
    .syntax-tag { color: #9cdcfe; }
    .syntax-attribute { color: #92c5f7; }
    .syntax-property { color: #9cdcfe; }
    .syntax-color { color: #d4d4d4; }
    .syntax-number { color: #b5cea8; }
  `;
  document.head.appendChild(style);
}
