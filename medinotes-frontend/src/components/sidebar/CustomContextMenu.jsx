import { useEffect } from "react";

export const CustomContextMenu = ({ x, y, onClose }) => {
  // This effect handles closing the menu when clicking outside of it.
  useEffect(() => {
    const handleClickOutside = () => onClose();
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="absolute z-50 w-48 bg-white rounded-md shadow-lg border border-gray-200"
      style={{ top: y, left: x }}
      // Prevent clicks inside the menu from closing it
      onClick={(e) => e.stopPropagation()}
    >
      <ul className="py-1 text-sm text-gray-700">
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">New File</li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">New Folder</li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Copy</li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Paste</li>
        <hr className="my-1 border-gray-200" />
        <li className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer">Delete</li>
      </ul>
    </div>
  );
};
