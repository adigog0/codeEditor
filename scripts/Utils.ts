import addFolderIcon from "../images/add-folder.svg";
import addFileIcon from "../images/add-file.svg";
import deleteIcon from "../images/delete.svg";
import fileSvg from "../images/file.svg";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { javascript, typescriptLanguage } from "@codemirror/lang-javascript";
import { acceptedExtensions } from "../constants/constants";

export class Utils {
    private dbName: string;
    private dbVersion: number;
    private db: IDBDatabase | null;

    private createStore(db: IDBDatabase) {
        const store = db.createObjectStore("files", { keyPath: "id" });
        store.createIndex("content", "content", { unique: false });
    }

    createInput() {
        const input = document.createElement("input");
        input.classList.add("input");
        return input;
    }

    createButton(buttonIcon: HTMLImageElement, buttonName: string) {
        const button = document.createElement("button");
        button.classList.add("action-btn");
        button.setAttribute("name", buttonName);
        button.appendChild(buttonIcon);
        return button;
    }

    createFolder(inputValue: string, nesting: number) {
        const folder = document.createElement("details");
        folder.classList.add("folder");
        folder.open;

        const toggle = document.createElement("summary");
        toggle.classList.add("toggle");
        toggle.textContent = inputValue;

        folder.style.setProperty("--indent", `${nesting * 0.2}rem`);

        const folderActions = this.createFolderActions();

        toggle.appendChild(folderActions);
        folder.appendChild(toggle);

        return folder;
    }

    createFolderActions() {
        const actionContainer = document.createElement("div");
        actionContainer.classList.add("action-containers");

        const addFolder = document.createElement("img");
        addFolder.classList.add("icon");
        const addFolderbutton = this.createButton(
            addFolder,
            "add-folder-button"
        );

        const addFile = document.createElement("img");
        addFile.classList.add("icon");
        const addFilebutton = this.createButton(addFile, "add-file-button");

        const deleteFolder = document.createElement("img");
        deleteFolder.classList.add("icon");
        const deletebutton = this.createButton(deleteFolder, "delete-folder");

        actionContainer.appendChild(addFilebutton);
        addFile.src = addFileIcon;

        actionContainer.appendChild(addFolderbutton);
        addFolder.src = addFolderIcon;

        actionContainer.appendChild(deletebutton);
        deleteFolder.src = deleteIcon;

        return actionContainer;
    }

    createFile(inputValue: string) {
        const uid = self.crypto.randomUUID();
        const file = document.createElement("div");
        file.classList.add("file-container");
        file.id = `${uid}`;

        const fileIcon = document.createElement("img");
        fileIcon.classList.add("file-icon");

        const fileText = document.createElement("span");
        fileText.textContent = inputValue;
        fileText.classList.add("file-text");

        const fileDeleteIcon = document.createElement("img");
        fileDeleteIcon.classList.add("file-deleteIcon");

        file.appendChild(fileIcon);
        fileIcon.src = fileSvg;

        file.appendChild(fileText);

        file.appendChild(fileDeleteIcon);
        fileDeleteIcon.src = deleteIcon;

        return file;
    }

    createEditor(parent: HTMLElement) {
        if (parent.childNodes.length > 0) {
            parent.innerHTML = ``;
        }
        const editorView = new EditorView({
            state: EditorState.create({
                doc: "",
                extensions: [
                    basicSetup,
                    javascript({
                        jsx: true,
                        typescript: true,
                    }),
                    typescriptLanguage,
                ],
            }),
            parent: parent,
        });

        return editorView;
    }

    showActiveFile(fileName:string){
        const container = document.getElementById("active-file-name");
        const fileSpan = document.createElement("span");
        fileSpan.textContent = fileName;
        fileSpan.classList.add("active-file");

        if(container){
            container.appendChild(fileSpan);
        }
    }

    async openDB(dbName: string, dbVersion: number): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            this.dbName = dbName;
            this.dbVersion = dbVersion;
            const request = window.indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                reject(`Failed to open database: ${event.target}`);
            };

            request.onsuccess = (event) => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                this.db = request.result;
                if (!this.db.objectStoreNames.contains("files")) {
                    this.createStore(this.db);
                }
            };
        });
    }

    async insertData(fileId: string, fileContent: string): Promise<void> {
        const db = await this.openDB("codeEditor", 1);
        const transaction = db.transaction(["files"], "readwrite");
        const objectStore = transaction.objectStore("files");
        objectStore.put({ id: fileId, content: fileContent });
        transaction.onerror = (event) => {
            console.error(`Failed to insert data to database: ${event.target}`);
        };
        transaction.oncomplete = () => {
            db.close();
        };
    }

    async getData(fileId: string): Promise<string> {
        const db = await this.openDB("codeEditor", 1);
        const transaction = db.transaction(["files"], "readonly");
        const objectStore = transaction.objectStore("files");
        const request = objectStore.get(fileId);

        return new Promise((resolve, reject) => {
            request.onerror = (event) => {
                reject(`Failed to get data from database: ${event.target}`);
            };

            request.onsuccess = (event) => {
                if (request.result) {
                    resolve(request.result.content);
                } else {
                    reject(`No data found for fileId: ${fileId}`);
                }
                db.close();
            };
        });
    }
}
