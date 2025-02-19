import { Folder } from "./Folder";

const createFolderButton = document.getElementById("create-folder-button");
const rootContainer = document.getElementById("root-container");
const editorContainer = document.getElementById("editor");

function init() {
  if (
    createFolderButton === null ||
    rootContainer === null ||
    editorContainer === null
  )
    throw new Error("root elements are null");

  createFolderButton.addEventListener("click", () => {
    const createRoot = new Folder(rootContainer, 0, editorContainer);
    createRoot.getFolder();
  });
}

init();
