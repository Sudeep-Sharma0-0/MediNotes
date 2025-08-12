import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import PasteMarkdown from './tiptap-extensions/PasteMarkdown';
import FileNameHeader from './tiptap-extensions/FileNameHeader';
import PreventDefaultKeys from './tiptap-extensions/PreventDefaultKeys';
import EmptyClassPlugin from './tiptap-extensions/EmptyClassPlugin';
import PasteTable from './tiptap-extensions/PasteTable';
import CustomTableExtensions from './tiptap-extensions/custom-table/index.js';
import { TableKeymap } from './tiptap-extensions/custom-table/table-extensions/TableKeybinds';
import { FormattingKeybinds } from './tiptap-extensions/FormattingKeybinds';

export default function CustomEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      FileNameHeader,
      PreventDefaultKeys,
      EmptyClassPlugin,
      PasteTable,
      TableKeymap,
      FormattingKeybinds,
      ...CustomTableExtensions,
      PasteMarkdown,
    ],
    content: {
      type: 'doc',
      content: [{ type: 'filename' }],
    },
  });

  return <EditorContent editor={editor} />;
}
