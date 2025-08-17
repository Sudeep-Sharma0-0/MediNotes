import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { handlePaste } from "./PasteHandler";

export const MarkdownPaste = Extension.create({
  name: "markdownPaste",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("markdownPaste"),
        props: {
          handlePaste(view, event) {
            const clipboardData = event.clipboardData;
            if (!clipboardData) return false;

            const text = clipboardData.getData("text/plain");
            if (!text) return false;

            // Let PasteHandler decide what to do
            return handlePaste(view, text);
          },
        },
      }),
    ];
  },
});
