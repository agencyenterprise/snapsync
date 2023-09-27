import SyntaxHighlighter from 'react-syntax-highlighter';
import { githubGist as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type CodeHighlightProps = {
  children: string | string[];
  language?: string;
};

export function CodeHighlight({
  children,
  language = 'javascript',
}: CodeHighlightProps) {
  return (
    <SyntaxHighlighter language={language} style={codeStyle}>
      {children}
    </SyntaxHighlighter>
  );
}
