import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView, keymap } from "@codemirror/view";
import { acceptCompletion, startCompletion } from "@codemirror/autocomplete";
import { Prec } from "@codemirror/state";

const editorTheme = EditorView.theme({
  "&": {
    fontSize: "0.95rem",
    borderRadius: "8px",
    border: "1px solid #252836",
  },
  "&.cm-focused": {
    outline: "none",
    border: "1px solid #63b3ed",
  },
  ".cm-content": {
    padding: "12px",
    fontFamily: "'Courier New', monospace",
    minHeight: "96px",
  },
  ".cm-line": { lineHeight: "1.6" },
  ".cm-gutters": { display: "none" },
});

export default function SqlEditor({ value, onChange, placeholder }) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={[
        sql(),
        editorTheme,
        Prec.highest(keymap.of([{
          key: "Tab",
          run: (view) => acceptCompletion(view) || startCompletion(view),
        }])),
      ]}
      theme={vscodeDark}
      placeholder={placeholder || "SELECT ..."}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: true,
        autocompletion: true,
      }}
    />
  );
}
