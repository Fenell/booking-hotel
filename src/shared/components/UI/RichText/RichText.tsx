import Quill, { Delta, RangeStatic, Sources } from "quill";
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";

export interface EditorProps {
  readOnly?: boolean;
  defaultValue?: Delta;
  onTextChange?: (delta: Delta, oldDelta: Delta, source: Sources) => void;
  onSelectionChange?: (
    range: RangeStatic | null,
    oldRange: RangeStatic | null,
    source: Sources,
  ) => void;
}

// Editor is an uncontrolled React component
const Editor = forwardRef<Quill | null, EditorProps>(
  (
    { readOnly = false, defaultValue, onTextChange, onSelectionChange },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const defaultValueRef = useRef<Delta | undefined>(defaultValue);
    const onTextChangeRef = useRef<EditorProps["onTextChange"]>(onTextChange);
    const onSelectionChangeRef =
      useRef<EditorProps["onSelectionChange"]>(onSelectionChange);

    // luôn cập nhật callback mới nhất
    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    // bật / tắt readonly
    useEffect(() => {
      if (ref && typeof ref !== "function") {
        ref.current?.enable(!readOnly);
      }
    }, [readOnly, ref]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div"),
      );

      const quill = new Quill(editorContainer, {
        theme: "snow",
      });

      if (ref && typeof ref !== "function") {
        ref.current = quill;
      }

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        if (ref && typeof ref !== "function") {
          ref.current = null;
        }
        container.innerHTML = "";
      };
    }, [ref]);

    return <div ref={containerRef} />;
  },
);

Editor.displayName = "Editor";

export default Editor;
