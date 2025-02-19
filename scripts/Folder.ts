import { validation } from "../utils/validation";
import { Utils } from "./Utils";
import { File } from "./File";

export class Folder extends Utils {
  private rootContainer: HTMLElement;
  private nesting: number;
  private content: HTMLElement;

  constructor(
    rootContainer: HTMLElement,
    nesting: number,
    content: HTMLElement
  ) {
    super();
    this.rootContainer = rootContainer;
    this.content = content;
    this.nesting = nesting;
  }

  private validFolder(input: HTMLInputElement) {
    const getfolder = this.createFolder(input.value, this.nesting);
    this.folderActionHandler(getfolder);
    this.rootContainer.removeChild(input);
    this.rootContainer.appendChild(getfolder);
  }

  private invalidFolder(input: HTMLInputElement) {
    if (input === null) return;
    this.rootContainer.removeChild(input);
  }

  addFileHandler(parent: HTMLDetailsElement) {
    parent.open = true;
    const file = new File(parent, this.nesting + 1, this.content);
    file.getFile();
  }

  addFolderHandler(parent: HTMLDetailsElement) {
    parent.open = true;
    const subFolder = new Folder(parent, this.nesting + 1, this.content);
    subFolder.getFolder();
  }

  deleteFolderHandler(folder: HTMLDetailsElement) {
    folder.open = true;
    this.rootContainer.removeChild(folder);
  }

  folderActionHandler(folder: HTMLDetailsElement) {
    const summary = folder.children[0];
    const folderActions = summary.children[0].children;

    const addFileButton = folderActions[0];
    const addFolderButton = folderActions[1];
    const deleteFolderButton = folderActions[2];

    addFileButton.addEventListener("click", () => this.addFileHandler(folder));

    addFolderButton.addEventListener("click", () =>
      this.addFolderHandler(folder)
    );
    deleteFolderButton.addEventListener("click", () =>
      this.deleteFolderHandler(folder)
    );
  }

  generateInput() {
    const input = this.createInput();
    this.rootContainer.appendChild(input);
    input.focus();

    input.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        input.blur();
      }
    });

    input.addEventListener("blur", (e) => {
      const valid = validation(input);
      if (valid) {
        this.validFolder(input);
      } else {
        this.invalidFolder(input);
      }
    });
  }

  getFolder() {
    this.generateInput();
    this.openDB("codeEditor",1)
  }
}
