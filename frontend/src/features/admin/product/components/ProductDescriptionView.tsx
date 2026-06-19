import { EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";

type Props = {
  editor: Editor;
};

export default function ProductDescriptionView({ editor }: Props) {
  return (
    <EditorContent
      editor={editor}
      className="
        tiptap min-h-[250px] p-4
        [&_.ProseMirror]:min-h-[250px]
        [&_.ProseMirror]:outline-none
        [&_.ProseMirror_h1]:text-4xl
        [&_.ProseMirror_h1]:font-bold
        [&_.ProseMirror_h1]:leading-tight
        [&_.ProseMirror_h2]:text-3xl
        [&_.ProseMirror_h2]:font-bold
        [&_.ProseMirror_h2]:leading-tight
        [&_.ProseMirror_h3]:text-2xl
        [&_.ProseMirror_h3]:font-semibold
        [&_.ProseMirror_h4]:text-xl
        [&_.ProseMirror_h4]:font-semibold
        [&_.ProseMirror_h5]:text-lg
        [&_.ProseMirror_h5]:font-semibold
        [&_.ProseMirror_h6]:text-base
        [&_.ProseMirror_h6]:font-semibold
        [&_.ProseMirror_img]:block
        [&_.ProseMirror_img]:max-w-full
        [&_.ProseMirror_img]:h-auto
        [&_.ProseMirror_img]:rounded-md
        [&_.ProseMirror_table]:w-full
        [&_.ProseMirror_table]:border-collapse
        [&_.ProseMirror_td]:border
        [&_.ProseMirror_th]:border
        [&_.ProseMirror_td]:p-2
        [&_.ProseMirror_th]:p-2
      "
    />
  );
}
