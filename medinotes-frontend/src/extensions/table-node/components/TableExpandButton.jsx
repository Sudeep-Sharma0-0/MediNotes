import { useCurrentEditor } from "@tiptap/react";
import "react";

export const TableExpandButton = (props) => {
  let tableType = props.type;
  const { editor } = useCurrentEditor();

  switch (tableType) {
    case "right":
      return (
        <button className={`exp-btn-${tableType}`}
          onClick={() => editor.chain().focus().addFinalColumn().run()}
        >
          Add Final Column
        </button>
      );
    case "left":
      return (
        <button className={`exp-btn-${tableType}`}
          onClick={() => editor.chain().focus().addFirstColumn().run()}
        >
          Add First Column
        </button>
      );
    case "bottom":
      return (
        <button className={`exp-btn-${tableType}`}
          onClick={() => editor.chain().focus().addFinalRow().run()}
        >
          Add Final Row
        </button>
      );
  }
}
