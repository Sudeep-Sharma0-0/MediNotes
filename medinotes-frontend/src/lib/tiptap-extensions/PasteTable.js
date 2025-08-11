import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Extension } from '@tiptap/core'
import { marked } from "marked";

const PasteTable = Extension.create({
  name: "pasteTable",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view, event) => {
            const clipboardData = event.clipboardData;
            if (!clipboardData) return false;

            const markdownText = clipboardData.getData("text/plain");
            if (!markdownText) return false;

            event.preventDefault();

            const html = marked.parse(markdownText);

            this.editor.commands.insertContent(html);

            return true;
          },
        },
      }),
    ];
  },
});

export default PasteTable;
