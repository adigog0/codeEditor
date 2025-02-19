import { EditorView } from "codemirror";
import { validation } from "../utils/validation";
import { Utils } from "./Utils";
import { throttle } from "../utils/throttle";
import { acceptedExtensions } from "../constants/constants";

export class File extends Utils {
    private parent: HTMLElement;
    private content: HTMLElement;

    constructor(parent: HTMLElement, nesting: number, content: HTMLElement) {
        super();
        this.parent = parent;
        this.content = content;
    }

    fileActionHandler(file: HTMLElement) {
        const fileDeleteButton = file.children[2];
        fileDeleteButton.addEventListener("click", () => {
            this.parent.removeChild(file);
        });
    }

    private validFile(input: HTMLInputElement) {
        const extensionAllowed = acceptedExtensions.includes(input.value.split('.').pop() as string);
        if(extensionAllowed){
            const file = this.createFile(input.value);
            this.generateEditor(file,input);
            this.fileActionHandler(file);
            this.parent.removeChild(input);
            this.parent.appendChild(file);
        }
        else{
            this.parent.removeChild(input);
            alert("Please specify the valid extension for file (.txt , .js, .ts, .jsx, .tsx)");
        }        
     
    }

    private invalidFile(input: HTMLInputElement) {
        if (input == null) return;
        this.parent.removeChild(input);
    }

    editorInputHandler(editorView: EditorView, fileId: string) {
 
        const updateValueAfterThrottle = throttle((input: string) => {
            this.insertData(fileId, input);
        }, 2000);

        editorView.dom.addEventListener("input", () => {
            let input = editorView.state.doc.toString();
            updateValueAfterThrottle(input);
        });
    }

    generateEditor(file: HTMLElement,input:HTMLInputElement) {
        this.insertData(file.id, "");
        file.addEventListener("click", async (e) => {
            this.showActiveFile(input.value);
            const editorView = this.createEditor(this.content);
            const filedata = await this.getData(file.id); // fetch file content
            editorView.focus();
            editorView.dispatch({
                changes: { from: 0,to: editorView.state.doc.length, insert: filedata},
            });


            this.editorInputHandler(editorView, file.id);
        });
    }

    generateInput() {
        const input = this.createInput();

        this.parent.appendChild(input);
        input.focus();

        input.addEventListener("blur", () => {
            const valid = validation(input);
            if (valid) {
                this.validFile(input);
            } else {
                this.invalidFile(input);
            }
        });

        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                input.blur();
            }
        });
    }

    getFile() {
        this.generateInput();
    }
}
