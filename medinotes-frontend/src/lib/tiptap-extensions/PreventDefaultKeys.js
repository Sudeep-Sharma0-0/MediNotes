import { Extension } from "@tiptap/core";
import { Plugin, TextSelection } from "prosemirror-state";

const PreventDefaultKeys = Extension.create({
  name: "preventDefaultKeys",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleKeyDown(view, event) {
            const { state, dispatch } = view;
            const { selection, doc } = state;
            const { from, to } = selection;

            if (event.key === "Tab" || event.key === "Escape") {
              event.preventDefault();
              return true;
            }

            if (
              (event.key === "a" || event.key === "A") &&
              (event.ctrlKey || event.metaKey)
            ) {
              const firstNode = doc.firstChild;

              const filenameStart = 0;
              const filenameEnd = firstNode.nodeSize;

              if (from >= filenameStart + 1 && to <= filenameEnd - 1) {
                return false;
              }

              event.preventDefault();

              const afterFilenamePos = filenameEnd+1;
              const docEnd = doc.content.size;

              if (afterFilenamePos >= docEnd) {
                return false;
              }

              const tr = state.tr.setSelection(
                TextSelection.create(doc, afterFilenamePos, docEnd - 1)
              );
              dispatch(tr);
              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});

export default PreventDefaultKeys;
