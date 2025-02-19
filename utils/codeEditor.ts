import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";

export function codeEditor(parent: HTMLElement) {
  const editorView = new EditorView({
    state: EditorState.create({
      doc: "",
      extensions: [
        basicSetup,
        javascript({
          jsx: true,
          typescript: true,
        }),
      ],
    }),
    parent: parent,
  });

  return editorView;
}
