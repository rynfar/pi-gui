import type { BundledLanguage, BundledTheme, HighlighterGeneric } from "shiki/bundle/web";

type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>;

let highlighter: Highlighter | null = null;
let loading: Promise<Highlighter> | null = null;

/**
 * Lazy-initialize a shared Shiki highlighter.
 * Uses the lightweight web bundle (common web-dev grammars)
 * and two themes – a dark one for light-mode code blocks and
 * a light one for dark-mode (inverted, since our light theme
 * uses dark code surfaces like the Crystal Grid reference).
 */
export async function getHighlighter(): Promise<Highlighter> {
  if (highlighter) return highlighter;
  if (loading) return loading;

  loading = import("shiki/bundle/web").then(async ({ createHighlighter }) => {
    const h = await createHighlighter({
      themes: ["night-owl", "night-owl-light"],
      langs: [
        "javascript",
        "typescript",
        "jsx",
        "tsx",
        "json",
        "html",
        "css",
        "python",
        "bash",
        "shell",
        "markdown",
        "yaml",
        "toml",
        "sql",
        "rust",
        "go",
        "swift",
        "c",
        "cpp",
        "java",
        "ruby",
        "diff",
      ],
    });
    highlighter = h;
    return h;
  });

  return loading;
}

/**
 * Synchronously return the highlighter if already loaded.
 */
export function getHighlighterSync(): Highlighter | null {
  return highlighter;
}
