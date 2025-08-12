import { Extension } from "@tiptap/core";
import { keymap } from "prosemirror-keymap";
import { TextSelection } from "prosemirror-state";
import { toggleMark } from "prosemirror-commands";

const formattingShortcuts = {
  "Mod-b": "strong",
  "Mod-i": "em",
  "Mod-u": "underline",
  "Mod-`": "code",
  "Mod-Shift-x": "strike",
};

export const TableKeymap = Extension.create({
  name: "tableKeymap",

  addProseMirrorPlugins() {
    return [
      keymap({
        ...Object.fromEntries(
          Object.entries(formattingShortcuts).map(([key, markName]) => [
            key,
            (state, dispatch, view) => {
              if (!view) return false;
              const cellEl = getCurrentCellEl();
              if (!cellEl) return false;

              const cellStart = view.posAtDOM(cellEl, 0);
              const cellEnd = view.posAtDOM(cellEl, cellEl.childNodes.length);
              const { from, to } = state.selection;

              if (from <= cellStart && to >= cellEnd) {
                const newSelection = TextSelection.create(state.doc, cellStart + 1);
                const tr = state.tr.setSelection(newSelection);
                if (dispatch) dispatch(tr);
                state = tr.doc && state.apply(tr);
              }

              const markType = state.schema.marks[markName];
              if (!markType) return false;

              return toggleMark(markType)(state, dispatch, view);
            },
          ])
        ),

        "Mod-a": (state, dispatch, view) => {
          if (!view) return false;
          const cellEl = getCurrentCellEl();
          if (!cellEl) return false;

          const from = view.posAtDOM(cellEl, 0);
          const to = view.posAtDOM(cellEl, cellEl.childNodes.length);

          if (state.selection.from === from && state.selection.to === to) return false;

          if (dispatch) dispatch(state.tr.setSelection(TextSelection.create(state.doc, from, to)));

          return true;
        },

        "Mod-c": (state, dispatch, view) => {
          if (!view) return false;
          if (!getCurrentCellEl()) return false;
          return false;
        },

        "Mod-v": (state, dispatch, view) => {
          if (!view) return false;
          const cellEl = getCurrentCellEl();
          if (!cellEl) return false;

          setTimeout(() => {
            if (!view.hasFocus()) return;
            const end = view.posAtDOM(cellEl, cellEl.childNodes.length);
            const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, end));
            view.dispatch(tr);
          }, 0);

          return false;
        },

        Backspace: (state, dispatch, view) => handleDeleteKey(state, dispatch, view),
        Delete: (state, dispatch, view) => handleDeleteKey(state, dispatch, view),
      }),
    ];
  },
});

function getCurrentCellEl() {
  const domSel = window.getSelection();
  return domSel?.anchorNode?.parentElement?.closest(".custom-table-cell") || null;
}

function handleDeleteKey(state, dispatch, view) {
  if (!view) return false;

  const cellEl = getCurrentCellEl();
  if (!cellEl) return false;

  const sel = state.selection;
  const cellStart = view.posAtDOM(cellEl, 0);
  const cellEnd = view.posAtDOM(cellEl, cellEl.childNodes.length);
  const allSelected = sel.from === cellStart && sel.to === cellEnd;
  const cellEmpty = cellEl.textContent.trim() === "";

  if (allSelected) {
    return true;
  }

  if (cellEmpty && !allSelected) return true;

  return false;
}
