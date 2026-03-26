import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";

const REMARK_PLUGINS = [remarkGfm];

const MARKDOWN_COMPONENTS = {
  // Strip react-markdown's outer <pre> — CodeBlock provides its own wrapper.
  pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  code: ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const language = className?.replace(/^language-/, "");
    const code = String(children).replace(/\n$/, "");
    if (!className) {
      return <code>{code}</code>;
    }
    return <CodeBlock code={code} language={language} />;
  },
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  ),
} as const;

export function MessageMarkdown({ text }: { readonly text: string }) {
  return (
    <div className="message__content">
      <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={MARKDOWN_COMPONENTS}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
