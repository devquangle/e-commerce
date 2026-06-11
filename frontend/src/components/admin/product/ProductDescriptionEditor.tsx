import { useEditor } from "@tiptap/react";
import { ReactNodeViewRenderer } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Image from "@tiptap/extension-image";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Paragraph from "@tiptap/extension-paragraph";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Text from "@tiptap/extension-text";

import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductDescriptionToolbar from "./ProductDescriptionToolbar";
import ProductDescriptionView from "./ProductDescriptionView";
import ResizableImageNodeView from "./ResizableImageNodeView";

import imageService from "@/services/imageService";
import { showErrorToast } from "@/utils/toastUtil";
import { Loader2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: "mx-auto",
        parseHTML: (el) => el.getAttribute("class"),
        renderHTML: (attrs) => (attrs.class ? { class: attrs.class } : {}),
      },
      style: {
        default: "width: 100%; max-width: 100%; height: auto;",
        parseHTML: (el) => el.getAttribute("style"),
        renderHTML: (attrs) => (attrs.style ? { style: attrs.style } : {}),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNodeView);
  },
});

export default function ProductDescriptionEditor({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false },
        document: false,
        paragraph: false,
        text: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),

      Document,
      CustomImage,

      BulletList,
      OrderedList,
      ListItem,
      Paragraph,

      TextStyle,
      Color,
      Highlight,
      Text,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Placeholder.configure({
        placeholder: "Nhap mo ta san pham...",
      }),

      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "",
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  // Upload ảnh lên server → lấy URL thật → chèn vào editor
  const handleImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor) return;
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";

      // Hiển thị preview blob tạm thời trong khi đợi upload
      const blobUrl = URL.createObjectURL(file);
      editor
        .chain()
        .focus()
        .setImage({ src: blobUrl })
        .updateAttributes("image", {
          class: "block mx-auto opacity-50",
          style: "width: 60%; max-width: 100%; height: auto;",
        })
        .run();

      setIsUploadingImage(true);
      try {
        // Upload lên server → nhận URL thật
        const result = await imageService.uploadFile(file);
        const uploadedUrl = result.url;

        // Thay thế tất cả blob URL trong HTML bằng URL thật từ server
        const currentHtml = editor.getHTML();
        const updatedHtml = currentHtml.replace(blobUrl, uploadedUrl);
        editor.commands.setContent(updatedHtml, { emitUpdate: false });
        onChange(updatedHtml);

        URL.revokeObjectURL(blobUrl);
      } catch {
        // Nếu upload thất bại: xóa ảnh blob tạm ra khỏi editor
        const currentHtml = editor.getHTML();
        const cleaned = currentHtml.replace(
          new RegExp(`<img[^>]*src="${blobUrl}"[^>]*/?>`, "g"),
          "",
        );
        editor.commands.setContent(cleaned, { emitUpdate: false });
        onChange(cleaned);
        URL.revokeObjectURL(blobUrl);
        showErrorToast("Upload ảnh thất bại. Vui lòng thử lại.");
      } finally {
        setIsUploadingImage(false);
      }
    },
    [editor, onChange],
  );

  if (!editor) return null;

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm relative">
      <ProductDescriptionToolbar
        editor={editor}
        onPickImage={() => fileRef.current?.click()}
      />
      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/*"
        onChange={handleImage}
        disabled={isUploadingImage}
      />

      {/* Overlay loading khi đang upload */}
      {isUploadingImage && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-xl pointer-events-none">
          <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-md rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium">
            <Loader2 size={16} className="animate-spin text-indigo-500" />
            Đang tải ảnh lên...
          </div>
        </div>
      )}

      <ProductDescriptionView editor={editor} />
    </div>
  );
}
