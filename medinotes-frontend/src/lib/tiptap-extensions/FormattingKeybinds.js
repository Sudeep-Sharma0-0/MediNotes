import { Extension } from '@tiptap/core';
import { TextSelection, Plugin } from 'prosemirror-state';

export const FormattingKeybinds = Extension.create({
  name: 'formattingKeybinds',

  addOptions() {
    return {
      tabSize: 2,
      backspaceTimeout: 400,
    }
  },

  addProseMirrorPlugins() {
    let lastBackspaceTime = 0;
    let lastBackspacePos = null;

    return [
      new Plugin({
        props: {
          handleKeyDown: (view, event) => {
            const { state, dispatch } = view;
            const { selection, doc } = state;
            const { $from } = selection;

            const insideFilename =
              $from.parent.type.name === 'filename';

            if (event.key === 'Tab' && !event.defaultPrevented) {
              if (dispatch) {
                dispatch(state.tr.insertText(' '.repeat(this.options.tabSize)));
              }
              event.preventDefault();
              return true;
            }

            if (event.key === 'Backspace' && !event.defaultPrevented) {
              if (!selection.empty) return false;

              if (insideFilename) {
                return false;
              }

              const now = Date.now();
              const $pos = selection.$from;
              const parent = $pos.parent;
              const isEmptyNode = parent.isTextblock && parent.content.size === 0;

              if (!isEmptyNode) {
                lastBackspaceTime = 0;
                lastBackspacePos = null;
                return false;
              }

              if (
                lastBackspaceTime &&
                now - lastBackspaceTime < this.options.backspaceTimeout &&
                lastBackspacePos === $pos.pos
              ) {
                const start = $pos.before($pos.depth);
                const end = $pos.after($pos.depth);
                const paragraph = state.schema.nodes.paragraph.create();
                const tr = state.tr.replaceRangeWith(start, end, paragraph);
                tr.setSelection(TextSelection.create(tr.doc, start + 1));
                dispatch(tr);

                lastBackspaceTime = 0;
                lastBackspacePos = null;

                event.preventDefault();
                return true;
              }

              lastBackspaceTime = now;
              lastBackspacePos = $pos.pos;
            }

            return false;
          },
        },
      }),
    ];
  },
});
