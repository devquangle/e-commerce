import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Eraser,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Table as TableIcon,
  Undo2,
} from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  editor: Editor;
  onPickImage: () => void;
};

const btnBase =
  "h-8 min-w-8 px-2 rounded-md flex items-center justify-center transition-colors text-sm";
const btnIdle = "text-gray-600 hover:bg-gray-100";
const btnActive = "!bg-violet-100 !text-violet-700 font-bold";

export default function ProductDescriptionToolbar({
  editor,
  onPickImage,
}: Props) {
  const [, setUpdateCount] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      // Mỗi khi trạng thái chữ thay đổi, tăng số này lên để ép Toolbar render lại
      setUpdateCount((prev) => prev + 1);
    };

    // Lắng nghe sự kiện thay đổi vùng chọn (selection) và cập nhật nội dung (transaction)
    editor.on("selectionUpdate", handleUpdate);
    editor.on("transaction", handleUpdate);

    return () => {
      editor.off("selectionUpdate", handleUpdate);
      editor.off("transaction", handleUpdate);
    };
  }, [editor]);
  const currentHeadingLevel =
    ([1, 2, 3, 4, 5, 6].find((level) =>
      editor.isActive("heading", { level }),
    ) as 1 | 2 | 3 | 4 | 5 | 6 | undefined) ?? "paragraph";

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Nhập đường dẫn URL:", previousUrl);

    if (url === null) return; // Bấm cancel
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 border-b">
      {/* Định dạng thẻ Heading */}
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
          chain
            .setHeading({ level: Number(value) as 1 | 2 | 3 | 4 | 5 | 6 })
            .run();
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

      {/* Undo / Redo */}
      <button
        type="button"
        title="Hoàn tác (Undo)"
        className={`${btnBase} ${btnIdle}`}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={16} />
      </button>

      <button
        type="button"
        title="Làm lại (Redo)"
        className={`${btnBase} ${btnIdle}`}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={16} />
      </button>

      {/* --- CÁC NÚT ĐỊNH DẠNG TEXT --- */}
      <button
        type="button"
        title="In đậm"
        className={`${btnBase} ${editor.isActive("bold") ? btnActive : btnIdle}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </button>

      <button
        type="button"
        title="In nghiêng"
        className={`${btnBase} ${editor.isActive("italic") ? btnActive : btnIdle}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </button>

      <button
        type="button"
        title="Gạch ngang"
        className={`${btnBase} ${editor.isActive("strike") ? btnActive : btnIdle}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </button>

      {/* --- CÁC NÚT DANH SÁCH & ĐƯỜNG KẺ --- */}
      <button
        type="button"
        title="Danh sách dấu chấm"
        className={`${btnBase} ${editor.isActive("bulletList") ? btnActive : btnIdle}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </button>

      <button
        type="button"
        title="Danh sách số"
        className={`${btnBase} ${editor.isActive("orderedList") ? btnActive : btnIdle}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </button>

      <button
        type="button"
        title="Đường kẻ ngang"
        className={`${btnBase} ${btnIdle}`}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={16} />
      </button>

      {/* --- CÁC NÚT CĂN LỀ --- */}
      <button
        type="button"
        title="Căn lề trái"
        className={`${btnBase} ${
          editor.isActive({ textAlign: "left" }) ? btnActive : btnIdle
        }`}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={16} />
      </button>

      <button
        type="button"
        title="Căn giữa"
        className={`${btnBase} ${
          editor.isActive({ textAlign: "center" }) ? btnActive : btnIdle
        }`}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={16} />
      </button>

      <button
        type="button"
        title="Căn lề phải"
        className={`${btnBase} ${
          editor.isActive({ textAlign: "right" }) ? btnActive : btnIdle
        }`}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={16} />
      </button>

      <button
        type="button"
        title="Căn đều hai bên"
        className={`${btnBase} ${
          editor.isActive({ textAlign: "justify" }) ? btnActive : btnIdle
        }`}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify size={16} />
      </button>

      {/* --- CÁC NÚT XỬ LÝ BẢNG --- */}
      <button
        type="button"
        title="Chèn bảng"
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
        title="Thêm cột vào sau"
        className={`${btnBase} ${btnIdle}`}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        +Col
      </button>

      <button
        type="button"
        title="Thêm hàng vào sau"
        className={`${btnBase} ${btnIdle}`}
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        +Row
      </button>

      <button
        type="button"
        title="Xóa bảng"
        className={`${btnBase} ${btnIdle}`}
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        DelTbl
      </button>

      {/* --- NÚT UP ẢNH & TÍNH NĂNG ĐẶC BIỆT --- */}
      <button
        type="button"
        title="Chèn hình ảnh"
        className={`${btnBase} ${btnIdle}`}
        onClick={onPickImage}
      >
        <ImageIcon size={16} />
      </button>

      <button
        type="button"
        title="Chèn liên kết (Link)"
        className={`${btnBase} ${editor.isActive("link") ? btnActive : btnIdle}`}
        onClick={setLink}
      >
        <Link size={16} />
      </button>

      <button
        type="button"
        title="Trích dẫn đoạn văn (Blockquote)"
        className={`${btnBase} ${editor.isActive("blockquote") ? btnActive : btnIdle}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </button>

      <button
        type="button"
        title="Chèn khối mã lệnh (Code block)"
        className={`${btnBase} ${editor.isActive("codeBlock") ? btnActive : btnIdle}`}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code size={16} />
      </button>

      <button
        type="button"
        title="Tô nền chữ (Highlight)"
        className={`${btnBase} ${editor.isActive("highlight") ? btnActive : btnIdle}`}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter size={16} />
      </button>

      <button
        type="button"
        title="Xóa toàn bộ định dạng"
        className={`${btnBase} ${btnIdle}`}
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
      >
        <Eraser size={16} />
      </button>
    </div>
  );
}
