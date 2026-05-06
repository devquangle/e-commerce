import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Redo2,
  Strikethrough,
  Table as TableIcon,
  Undo2,
} from "lucide-react";

type Props = {
  editor: Editor;
  onPickImage: () => void;
};

const btnBase =
  "h-8 min-w-8 px-2 rounded-md flex items-center justify-center transition-colors text-sm";
const btnIdle = "text-gray-600 hover:bg-gray-100";
const btnActive = "bg-violet-100 text-violet-700";

export default function ProductDescriptionToolbar({ editor, onPickImage }: Props) {
  const currentHeadingLevel =
    ([1, 2, 3, 4, 5, 6].find((level) =>
      editor.isActive("heading", { level })
    ) as 1 | 2 | 3 | 4 | 5 | 6 | undefined) ?? "paragraph";

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 border-b">
      <select
        className="h-8 rounded-md border border-gray-200 px-2 text-sm text-gray-700"
        value={currentHeadingLevel}
        onChange={(e) => {
          const value = e.target.value;
          const chain = editor.chain().focus();
          if (value === "paragraph") {
            chain.setParagraph().run();
            return;
          }
          chain.setHeading({ level: Number(value) as 1 | 2 | 3 | 4 | 5 | 6 }).run();
        }}
      >
        <option value="paragraph">Paragraph</option>
        <option value={1}>H1</option>
        <option value={2}>H2</option>
        <option value={3}>H3</option>
        <option value={4}>H4</option>
        <option value={5}>H5</option>
        <option value={6}>H6</option>
      </select>

      <button
        type="button"
        className={`${btnBase} ${btnIdle}`}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={16} />
      </button>

      <button
        type="button"
        className={`${btnBase} ${btnIdle}`}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={16} />
      </button>

      <button
        type="button"
        className={`${btnBase} ${editor.isActive("bold") ? btnActive : btnIdle}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </button>

      <button
        type="button"
        className={`${btnBase} ${editor.isActive("italic") ? btnActive : btnIdle}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </button>

      <button
        type="button"
        className={`${btnBase} ${editor.isActive("strike") ? btnActive : btnIdle}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </button>

      <button
        type="button"
        className={`${btnBase} ${
          editor.isActive({ textAlign: "left" }) ? btnActive : btnIdle
        }`}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={16} />
      </button>

      <button
        type="button"
        className={`${btnBase} ${
          editor.isActive({ textAlign: "center" }) ? btnActive : btnIdle
        }`}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={16} />
      </button>

      <button
        type="button"
        className={`${btnBase} ${
          editor.isActive({ textAlign: "right" }) ? btnActive : btnIdle
        }`}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={16} />
      </button>

      <button
        type="button"
        className={`${btnBase} ${
          editor.isActive({ textAlign: "justify" }) ? btnActive : btnIdle
        }`}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify size={16} />
      </button>

      <button
        type="button"
        className={`${btnBase} ${btnIdle}`}
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        <TableIcon size={16} />
      </button>

      <button
        type="button"
        className={`${btnBase} ${btnIdle}`}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        +Col
      </button>

      <button
        type="button"
        className={`${btnBase} ${btnIdle}`}
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        +Row
      </button>

      <button
        type="button"
        className={`${btnBase} ${btnIdle}`}
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        DelTbl
      </button>

      <button type="button" className={`${btnBase} ${btnIdle}`} onClick={onPickImage}>
        <ImageIcon size={16} />
      </button>
    </div>
  );
}
