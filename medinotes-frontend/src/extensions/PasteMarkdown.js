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

/** Return Markdown back to the caller*/
export function returnMarkdown(parser, text) {
  const cleanedText = text.replace(/\\\|/g, "|");
  const lineSplitted = cleanedText.split("<br>");

  let unorderedList, orderedList;
  if (lineSplitted.length < 1) {
    unorderedList = false;
    orderedList = false;
  } else {
    unorderedList = lineSplitted[0].startsWith("-") ||
      lineSplitted[0].startsWith("*") ||
      lineSplitted[0].startsWith("+");
    orderedList = /^\d/.test(lineSplitted[0]);
  }

  let partialHtml = "";
  if (unorderedList || orderedList) {
    let openingContTag = orderedList ? "<ol>" : "<ul>";
    let closingContTag = orderedList ? "</ol>" : "</ul>";
    let openingTag = "<li>";
    let closingTag = "</li>";

    partialHtml += openingContTag;

    lineSplitted.forEach(element => {
      element = element.trim();

      let cleanedElement;
      if (unorderedList) {
        cleanedElement = element.replace(/^(\-|\*|\+)\s+/, "");
      } else if (orderedList) {
        cleanedElement = element.replace(/^\d+\.\s+/, "");
      } else {
        cleanedElement = element.trim();
      }
      partialHtml += `${openingTag}${cleanedElement}${closingTag}`
    });
    partialHtml += closingContTag;
  }

  const html = partialHtml == "" || partialHtml.length < 1 ? marked(cleanedText) : partialHtml;
  const container = document.createElement("div");
  container.innerHTML = html;

  return parser.parse(container, { preserveWhitespace: true }).content;
}
