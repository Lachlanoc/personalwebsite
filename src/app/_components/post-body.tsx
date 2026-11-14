import { CodeCopy } from "./code-copy";

type Props = {
  /** HTML from renderMarkdown. */
  content: string;
};

export function PostBody({ content }: Props) {
  return (
    <div className="max-w-3xl mx-auto">
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <CodeCopy />
    </div>
  );
}
