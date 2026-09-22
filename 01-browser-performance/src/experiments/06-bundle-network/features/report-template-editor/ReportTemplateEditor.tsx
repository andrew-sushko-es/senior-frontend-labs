import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

const initialTemplate = `
  <h2>Weekly operations summary</h2>
  <p>Share the current service level, delivery exceptions, and decisions that need regional follow-up.</p>
  <h3>Highlights</h3>
  <ul><li>On-time completion remains above target.</li><li>Review open carrier exceptions before Thursday.</li></ul>
`;

export function ReportTemplateEditor({ onClose }: { onClose: () => void }) {
  const [isSaved, setIsSaved] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialTemplate,
    editorProps: {
      attributes: {
        class: "report-template-content",
      },
    },
  });

  return (
    <section
      className="reporting-tool-panel"
      aria-labelledby="template-heading"
    >
      <div className="reporting-tool-heading">
        <div>
          <p className="section-label">Report template</p>
          <h2 id="template-heading">Edit the weekly report template</h2>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          type="button"
          aria-label="Close report template editor"
        >
          ×
        </button>
      </div>
      <div className="template-toolbar" aria-label="Editor formatting controls">
        <button
          aria-pressed={editor?.isActive("bold")}
          className="secondary-button"
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          type="button"
        >
          Bold
        </button>
        <button
          aria-pressed={editor?.isActive("bulletList")}
          className="secondary-button"
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          type="button"
        >
          Bullets
        </button>
        <button
          className="primary-button"
          disabled={!editor}
          onClick={() => setIsSaved(true)}
          type="button"
        >
          Save template
        </button>
        {isSaved ? (
          <span className="save-confirmation">Template saved</span>
        ) : null}
      </div>
      <EditorContent editor={editor} />
    </section>
  );
}
