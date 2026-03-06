import { Badge, Btn } from "../ui";

export default function EditorTopBar({
  title,
  setTitle,
  status,
  save,
  onPublish,
  setScreen,
  loading,
  previewMode,
  onTogglePreview,
}) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        background: "var(--nav-bg)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border)",
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Btn variant="ghost" size="sm" onClick={() => setScreen("dashboard")}>
        ← Back
      </Btn>
      <input value={title} onChange={(event) => setTitle(event.target.value)} style={{ flex: 1, fontSize: 14 }} />
      <Badge variant={status}>{status}</Badge>
      <Btn variant="ghost" size="sm" onClick={onTogglePreview}>
        {previewMode ? "Edit" : "Preview"}
      </Btn>
      <Btn variant="outline" size="sm" onClick={save} loading={loading}>
        Save Draft
      </Btn>
      <Btn variant="primary" size="sm" onClick={onPublish} loading={loading}>
        Publish →
      </Btn>
    </div>
  );
}
