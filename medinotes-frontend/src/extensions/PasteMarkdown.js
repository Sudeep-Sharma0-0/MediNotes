import { DOMParser as ProseMirrorDOMParser, Slice } from "prosemirror-model";
import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

/** Render Markdown into the editor */
export function pasteMarkdown(view, text) {
  const container = document.createElement("div");
  container.innerHTML = marked(text);

  const parser = ProseMirrorDOMParser.fromSchema(view.state.schema);
  const parsed = parser.parse(container, { preserveWhitespace: true });

  const { tr, selection } = view.state;
  const { $from } = selection;
  const parent = $from.parent;

  if (parent.type.name === "paragraph" && parent.content.size === 0) {
    tr.replaceRange($from.before(), $from.after(), new Slice(parsed.content, 0, 0));
  } else {
    tr.replaceSelectionWith(parsed, false);
  }

  view.dispatch(tr.scrollIntoView());
}
