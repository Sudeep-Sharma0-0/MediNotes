import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Plugin } from "prosemirror-state";

const EmptyClassExtension = Extension.create({
  name: "emptyClass",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        state: {
          init(_, { doc }) {
            return DecorationSet.create(doc, getEmptyNodeDecorations(doc));
          },
          apply(tr, oldDecorations, oldState, newState) {
            if (!tr.docChanged) return oldDecorations;
            return DecorationSet.create(newState.doc, getEmptyNodeDecorations(newState.doc));
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

function getEmptyNodeDecorations(doc) {
  const decorations = [];
  doc.descendants((node, pos) => {
    if (node.isTextblock && node.content.size === 0) {
      decorations.push(
        Decoration.node(pos, pos + node.nodeSize, { class: "empty" })
      );
    }
  });
  return decorations;
}

export default EmptyClassExtension;