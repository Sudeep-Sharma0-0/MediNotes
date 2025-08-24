import "./App.css";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { CustomContextMenu } from "./components/sidebar/CustomContextMenu";
import { Sidebar } from "./components/sidebar/Sidebar";
import { ChevronsLeftIcon } from "./components/sidebar/icons/ChevronsLeftIcon";
import { useCallback, useState } from "react";
import { ChevronRightIcon } from "./components/sidebar/icons/ChevronsRightIcon";

const initialFileContents = {
  "SimpleEditor.jsx": "<p><code>export const SimpleEditor = () => &lt;div&gt;Simple Editor Component&lt;/div&gt;;</code></p>",
  "Sidebar.jsx": "<p><code>export const Sidebar = () => &lt;div&gt;Sidebar Component&lt;/div&gt;;</code></p>",
  "FileExplorer.jsx": "<p><code>export const FileExplorer = () => &lt;div&gt;File Explorer Component&lt;/div&gt;;</code></p>",
  "App.css": "<p><code>body { margin: 0; }</code></p>",
  "App.jsx": "<p><code>import React from 'react';</code></p>",
  "index.js": "<p><code>console.log('App started');</code></p>",
  "index.html": "<p><code>&lt;!DOCTYPE html&gt;&lt;html&gt;&lt;body&gt;&lt;/body&gt;&lt;/html&gt;</code></p>",
  "vite.svg": "<p><code>&lt;svg&gt;...&lt;/svg&gt;</code></p>",
  "package.json": '<p><code>{ "name": "react-app" }</code></p>',
  "README.md": "<h1>React File Explorer</h1><p>This is a demo of a file explorer with a Tiptap editor.</p>",
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeFile, setActiveFile] = useState("README.md");
  const [fileContents, setFileContents] = useState(initialFileContents);
  const [contextMenu, setContextMenu] = useState(null);

  const handleContentChange = (newContent) => {
    if (activeFile) {
      setFileContents(prev => ({ ...prev, [activeFile]: newContent }));
    }
  };

  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return (
    <div className="contentArea">
      <div className="sidebar-wrapper">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onFileSelect={setActiveFile}
          onContextMenu={handleContextMenu}
          activeFile={activeFile}
        />

        <button
          className={`sidebar-button ${isSidebarOpen ? "closebtn" : "openbtn"}}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <ChevronsLeftIcon /> : <ChevronRightIcon />}
        </button>
      </div>

      <main>
        <SimpleEditor
          fileName={activeFile}
          content={fileContents[activeFile] || ""}
          onContentChange={handleContentChange}
        />
      </main>

      {contextMenu && <CustomContextMenu x={contextMenu.x} y={contextMenu.y} onClose={closeContextMenu} />}
    </div>
  );
}

export default App;
