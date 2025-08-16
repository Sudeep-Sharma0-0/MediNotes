import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

/**
 * Table node
 */
export const CustomTable = Node.create({
  name: "customTable",
  group: "block",
  content: "customTableRow+",
  parseHTML() {
    return [{ tag: "table" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "table",
      mergeAttributes(HTMLAttributes, { class: "custom-table" }),
      0,
    ];
  },
});

/**
 * Table row node
 */
export const CustomTableRow = Node.create({
  name: "customTableRow",
  group: "block",
  content: "customTableCell+",
  parseHTML() {
    return [{ tag: "tr" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["tr", mergeAttributes(HTMLAttributes), 0];
  },
});

/**
 * Table cell node
 */
export const CustomTableCell = Node.create({
  name: "customTableCell",
  group: "tableCell",
  content: "block+", // must have at least one block
  parseHTML() {
    return [{ tag: "td" }, { tag: "th" }];
  },
  renderHTML({ HTMLAttributes }) {
    const tag = HTMLAttributes.header ? "th" : "td";
    return [tag, mergeAttributes(HTMLAttributes), 0];
  },
  addOptions() {
    return { allowGapCursor: true };
  },
  addProseMirrorPlugins() {
    return [
      // This ensures that empty cells automatically have a paragraph
      new Plugin({
        key: new PluginKey("markdownTablePaste"),
        props: {
        appendTransaction: (transactions, oldState, newState) => {
          const tr = newState.tr;
          let modified = false;

          newState.doc.descendants((node, pos) => {
            if (node.type.name === "customTableCell" && node.childCount === 0) {
              tr.insert(pos, newState.schema.nodes.paragraph.create());
              modified = true;
            }
          });
          return modified ? tr : null;
        },
        },
      }),
    ];
  },
});
