import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin, TextSelection } from "prosemirror-state";

const Filename = Node.create({
  name: "filename",

  group: "block",
  content: "text*",
  atom: false,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      placeholder: {
        default: "New page",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-filename]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-filename": "",
        "data-placeholder": HTMLAttributes.placeholder,
        class: "filename-header",
      }),
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleKeyDown(view, event) {
            const { state, dispatch } = view;
            const { selection, doc, schema } = state;
            const { $from } = selection;

            const firstNode = doc.firstChild;
            if (!firstNode || firstNode.type.name !== "filename") {
              return false;
            }

            const filenameStart = 0;
            const filenameEnd = firstNode.nodeSize;

            if (
              (event.key === "a" || event.key === "A") &&
              (event.ctrlKey || event.metaKey)
            ) {
              if ($from.pos >= filenameStart && $from.pos <= filenameEnd) {
                event.preventDefault();

                const from = filenameStart + 1; // after node start
                const to = filenameEnd - 1; // before node end

                const tr = state.tr.setSelection(
                  TextSelection.create(doc, from, to)
                );
                dispatch(tr);
                return true;
              }
              return false;
            }

            if (
              (event.key === "ArrowLeft" || event.key === "ArrowUp") &&
              $from.pos <= filenameStart
            ) {
              event.preventDefault();
              return true;
            }

            if (
              (event.key === "Backspace" || event.key === "Delete") &&
              $from.pos === filenameStart
            ) {
              event.preventDefault();
              return true;
            }

            if (
              (event.key === "Backspace" || event.key === "Delete") &&
              $from.pos === filenameEnd
            ) {
              event.preventDefault();
              return true;
            }

            if (
              event.key === "Backspace" &&
              $from.pos > filenameStart &&
              $from.pos <= filenameEnd
            ) {
              if (firstNode.content.size === 0) {
                event.preventDefault();
                return true; // prevent any deletion or node creation
              }
            }

            if (
              (event.key === "Backspace" || event.key === "Delete") &&
              $from.pos > filenameStart &&
              $from.pos <= filenameEnd
            ) {
              return false;
            }

            return false;
          },
        },
        appendTransaction(transactions, oldState, newState) {
          const firstNode = newState.doc.firstChild;
          if (!firstNode || firstNode.type.name !== "filename") {
            const filenameNode = newState.schema.nodes.filename.create();
            return newState.tr.insert(0, filenameNode);
          }
          return null;
        },
      }),
    ];
  },
});

export default Filename;
