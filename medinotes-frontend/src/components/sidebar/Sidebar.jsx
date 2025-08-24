import { FileTree } from "./FileTree";
import "./styles/sidebar.scss";

const fileTreeData = {
  name: "root",
  type: "folder",
  children: [
    {
      name: "src",
      type: "folder",
      children: [
        {
          name: "components",
          type: "folder",
          children: [
            { name: "SimpleEditor.jsx", type: "file" },
            { name: "Sidebar.jsx", type: "file" },
            { name: "FileExplorer.jsx", type: "file" },
          ],
        },
        { name: "App.css", type: "file" },
        { name: "App.jsx", type: "file" },
        { name: "index.js", type: "file" },
      ],
    },
    {
      name: "public",
      type: "folder",
      children: [
        { name: "index.html", type: "file" },
        { name: "vite.svg", type: "file" },
      ],
    },
    { name: "package.json", type: "file" },
    { name: "README.md", type: "file" },
  ],
};

export const Sidebar = ({ isOpen, onToggle, onFileSelect, onContextMenu, activeFile }) => {
  return (
    <div
      className={`sideBar flex flex-col transition-all duration-300 ease-in-out ${isOpen ? "open" : ""
        } overflow-hidden`}
    >
      <div className="sideBarHeader flex items-center justify-between h-14 flex-shrink-0">
        <h2 className="font-bold text-lg">Explorer</h2>
      </div>
      <div
        className="sideBarContent flex-grow p-2 overflow-y-auto overflow-x-hidden"
        onContextMenu={onContextMenu}
      >
        <FileTree node={fileTreeData} onFileSelect={onFileSelect} activeFile={activeFile} />
      </div>
    </div>
  );
};
