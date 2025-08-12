import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { DOMParser as ProseMirrorDOMParser } from "@tiptap/pm/model";
import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

const pasteMarkdown = Extension.create({
  name: "pasteMarkdown",

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

            (async () => {
              const html = await marked(markdownText);

              const parser = ProseMirrorDOMParser.fromSchema(view.state.schema);
              const dom = document.createElement("div");
              dom.innerHTML = html;

              const slice = parser.parseSlice(dom);

              const transaction = view.state.tr.replaceSelection(slice);
              view.dispatch(transaction);
            })();

            return true;
          },
        },
      }),
    ];
  },
});

export default pasteMarkdown;
