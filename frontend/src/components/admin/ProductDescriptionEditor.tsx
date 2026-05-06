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

import { useCallback, useEffect, useRef } from "react";
import ProductDescriptionToolbar from "./ProductDescriptionToolbar";
import ProductDescriptionView from "./ProductDescriptionView";
import ResizableImageNodeView from "./ResizableImageNodeView";

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

  const handleImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor) return;
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          editor
            .chain()
            .focus()
            .setImage({ src: reader.result })
            .updateAttributes("image", {
              class: "block mx-auto",
              style: "width: 100%; max-width: 100%; height: auto;",
            })
            .run();
        }
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm">
      <ProductDescriptionToolbar
        editor={editor}
        onPickImage={() => fileRef.current?.click()}
      />
      <input ref={fileRef} type="file" hidden onChange={handleImage} />
      <ProductDescriptionView editor={editor} />
    </div>
  );
}
