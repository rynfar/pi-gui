import { useEffect, useState, useMemo, useCallback } from "react";
import { getHighlighter, getHighlighterSync } from "./code-highlight";

/**
 * Syntax-highlighted code block using Shiki.
 *
 * On first render (before Shiki loads) it shows plain text in a
 * styled <pre>. Once the highlighter is ready it re-renders with
 * full token colors.
 */
export function CodeBlock({
  code,
  language,
}: {
  readonly code: string;
  readonly language: string | undefined;
}) {
  // Bump this to trigger re-render once highlighter is ready
  const [ready, setReady] = useState(() => getHighlighterSync() !== null);

  useEffect(() => {
    if (ready) return;
    let cancelled = false;
    getHighlighter().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [ready]);

  const html = useMemo(() => {
    const h = getHighlighterSync();
    if (!h || !language) return null;
    try {
      // Check if the language is loaded
      const loadedLangs = h.getLoadedLanguages();
      const lang = loadedLangs.includes(language) ? language : "text";
      return h.codeToHtml(code, {
        lang,
        themes: {
          light: "vitesse-dark", // dark bg for light mode (Crystal Grid style)
          dark: "vitesse-light", // light-on-dark for app dark mode
        },
        defaultColor: false,
      });
    } catch {
      return null;
    }
  }, [code, language, ready]);

  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  // Render with syntax highlighting
  if (html) {
    return (
      <div className="code-block">
        <div className="code-block__header">
          <span className="code-block__lang">{language}</span>
          <button className="code-block__copy" onClick={onCopy} type="button">
            {copied ? "✓" : "Copy"}
          </button>
        </div>
        {/* biome-ignore lint: shiki output is trusted */}
        <div className="code-block__body" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }

  // Fallback: plain text while loading
  return (
    <div className="code-block">
      {language && (
        <div className="code-block__header">
          <span className="code-block__lang">{language}</span>
          <button className="code-block__copy" onClick={onCopy} type="button">
            {copied ? "✓" : "Copy"}
          </button>
        </div>
      )}
      <pre className="code-block__plain">
        <code>{code}</code>
      </pre>
    </div>
  );
}
