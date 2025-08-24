import { useState } from "react";
import { FileIcon } from "./icons/FileIcon";
import { ChevronRightIcon } from "./icons/ChevronsRightIcon";
import { FolderIcon } from "./icons/FolderIcon";

export const FileTree = ({ node, level = 0, onFileSelect, activeFile }) => {
  const [isOpen, setIsOpen] = useState(level < 2); // Keep first two levels open

  if (node.type === "file") {
    const isActive = activeFile === node.name;
    return (
      <div
        className={`fileTab flex items-center py-1.5 px-2 rounded-md cursor-pointer text-sm ${isActive ? "activeFile" : ""}`}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={() => onFileSelect(node.name)}
      >
        <FileIcon />
        <span className="ml-2 truncate">{node.name}</span>
      </div>
    );
  }

  if (node.type === "folder") {
    return (
      <div>
        <div
          className="folderTab flex items-center py-1.5 px-2 rounded-md cursor-pointer text-sm"
          onClick={() => setIsOpen(!isOpen)}
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        >
          <div className="w-4 mr-1 flex items-center justify-center">
            <ChevronRightIcon isOpen={isOpen} />
          </div>
          <FolderIcon />
          <span className="font-medium truncate">{node.name}</span>
        </div>
        {isOpen && (
          <div>
            {node.children.map((childNode, index) => (
              <FileTree key={index} node={childNode} level={level + 1} onFileSelect={onFileSelect} activeFile={activeFile} />
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
};
