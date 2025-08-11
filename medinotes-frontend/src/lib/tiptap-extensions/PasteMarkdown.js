import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { DOMParser } from "@tiptap/pm/model";
import MarkdownIt from "markdown-it";

// Initialize a MarkdownIt parser instance
const markdownParser = new MarkdownIt(
  "gfm"
);

const pasteMarkdown = Extension.create({
  name: "pasteMarkdown",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view, event) => {
            // Get the plain text from the clipboard
            const clipboardData = event.clipboardData;
            if (!clipboardData) return false;
            const markdownText = clipboardData.getData("text/plain");

            // If there's no plain text, let the default paste handler take over
            if (!markdownText) return false;

            // Convert the Markdown string to an HTML string
            const html = markdownParser.render(markdownText);

             const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Use ProseMirror's DOMParser to convert the HTML into a ProseMirror fragment
            const nodes = DOMParser.fromSchema(view.state.schema).parse(tempDiv);
            
            // Insert the new nodes at the current selection
            const transaction = view.state.tr.replaceSelectionWith(nodes);
            view.dispatch(transaction);

            // Prevent the default paste behavior
            return true;
          },
        },
      }),
    ];
  },
});

export default pasteMarkdown;