import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useRef } from "react";

type ImageAttrs = {
  src: string;
  alt?: string;
  title?: string;
  class?: string;
  style?: string;
};

type ResizeCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

function parseWidthPercent(style?: string): number {
  if (!style) return 100;
  const match = style.match(/width:\s*(\d+(?:\.\d+)?)%/i);
  if (!match) return 100;
  return Number(match[1]);
}

function cornerClass(corner: ResizeCorner): string {
  if (corner === "top-left") return "-top-2 -left-2 cursor-nwse-resize";
  if (corner === "top-right") return "-top-2 -right-2 cursor-nesw-resize";
  if (corner === "bottom-left") return "-bottom-2 -left-2 cursor-nesw-resize";
  return "-bottom-2 -right-2 cursor-nwse-resize";
}

export default function ResizableImageNodeView({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const attrs = node.attrs as ImageAttrs;

  const setAlign = (align: "left" | "center" | "right") => {
    const nextClass =
      align === "left"
        ? "block mr-auto"
        : align === "center"
          ? "block mx-auto"
          : "block ml-auto";

    updateAttributes({ class: nextClass });
  };

  const handleResizeStart = (
    corner: ResizeCorner,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const editorRoot = wrapper.closest(".ProseMirror") as HTMLElement | null;
    const maxWidth = editorRoot?.clientWidth ?? wrapper.clientWidth;

    const startX = event.clientX;
    const startPercent = parseWidthPercent(attrs.style);
    const startWidth = (startPercent / 100) * maxWidth;
    const direction =
      corner === "top-left" || corner === "bottom-left" ? -1 : 1;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) * direction;
      const nextWidthPx = Math.max(80, Math.min(maxWidth, startWidth + deltaX));
      const nextPercent = (nextWidthPx / maxWidth) * 100;

      updateAttributes({
        style: `width: ${nextPercent.toFixed(1)}%; max-width: 100%; height: auto;`,
      });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const imageAlignClass = attrs.class ?? "block mx-auto";
  const imageWidth = parseWidthPercent(attrs.style);

  return (
    <NodeViewWrapper as="div" className="w-full" ref={wrapperRef}>
      <div className={`${imageAlignClass} relative w-fit`}>
      {selected ? (
        <div className="absolute -top-9 right-0 z-10 flex items-center gap-1 rounded-md border bg-white p-1 shadow-sm">
          <button
            type="button"
            className={`h-6 px-2 text-xs rounded ${
              imageAlignClass.includes("mr-auto") ? "bg-violet-100 text-violet-700" : "text-gray-600 hover:bg-gray-100"
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              setAlign("left");
            }}
          >
            L
          </button>
          <button
            type="button"
            className={`h-6 px-2 text-xs rounded ${
              imageAlignClass.includes("mx-auto") ? "bg-violet-100 text-violet-700" : "text-gray-600 hover:bg-gray-100"
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              setAlign("center");
            }}
          >
            C
          </button>
          <button
            type="button"
            className={`h-6 px-2 text-xs rounded ${
              imageAlignClass.includes("ml-auto") ? "bg-violet-100 text-violet-700" : "text-gray-600 hover:bg-gray-100"
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              setAlign("right");
            }}
          >
            R
          </button>
        </div>
      ) : null}

      <img
        src={attrs.src}
        alt={attrs.alt ?? ""}
        title={attrs.title ?? ""}
        className={`${imageAlignClass} rounded-md max-w-full ${selected ? "ring-2 ring-violet-400" : ""}`}
        style={{
          width: `${imageWidth}%`,
          maxWidth: "100%",
          height: "auto",
        }}
      />

      {selected
        ? (["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
            (corner) => (
              <button
                key={corner}
                type="button"
                className={`absolute h-4 w-4 rounded-sm border border-violet-500 bg-white ${cornerClass(
                  corner
                )}`}
                onMouseDown={(event) => handleResizeStart(corner, event)}
              />
            )
          )
        : null}
      </div>
    </NodeViewWrapper>
  );
}
