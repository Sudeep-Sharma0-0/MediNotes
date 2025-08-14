import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { DOMParser as ProseMirrorDOMParser, Slice } from "prosemirror-model";
import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

function isMarkdown(text: string, html: string | null): boolean {
  if (!text) return false;

  // If HTML exists and differs from text, probably not pure markdown
  if (html && html.trim() !== text.trim()) return false;

  // Robust Markdown table detection
  const tablePattern =
    /^\s*\|?(\s*[^|\n]+?\s*\|)+\s*\n\s*\|?(\s*[:-]+[-| :]*)\|?\s*\n/m;
  if (tablePattern.test(text)) return false; // ignore tables

  // General Markdown patterns
  const markdownPattern = new RegExp(
    [
      /(^|\n)#{1,6}\s/.source, // headings (#, ##, etc.)
      /(^|\n)[*-]\s/.source, // unordered lists (- or *)
      /(^|\n)\d+\.\s/.source, // ordered lists
      /\*\*.*\*\*/.source, // bold
      /\*.*\*/.source, // italic
      /`[^`]+`/.source, // inline code
      /```[\s\S]*```/.source, // code block
      />\s/.source, // blockquote
      /-{3,}/.source, // horizontal rule
    ].join("|")
  );

  return markdownPattern.test(text);
}

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
            const html = clipboardData.getData("text/html");

            if (isMarkdown(text, html)) {
              event.preventDefault();

              Promise.resolve().then(async () => {
                const convertedHTML = await marked(text);

                const dom = document.createElement("div");
                dom.innerHTML = convertedHTML;

                const parser = ProseMirrorDOMParser.fromSchema(
                  view.state.schema
                );
                const parsed = parser.parse(dom, { preserveWhitespace: true });

                const { tr, selection } = view.state;
                const { $from } = selection;
                const parent = $from.parent;

                if (
                  parent.type.name === "paragraph" &&
                  parent.content.size === 0
                ) {
                  const slice = new Slice(parsed.content, 0, 0);
                  tr.replaceRange($from.before(), $from.after(), slice);
                } else {
                  tr.replaceSelectionWith(parsed, false);
                }

                view.dispatch(tr.scrollIntoView());
              });

              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});
