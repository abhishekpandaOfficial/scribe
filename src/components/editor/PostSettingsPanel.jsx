import { Btn } from "../ui";
import BlockPreviewRenderer from "./BlockPreviewRenderer";

export default function PostSettingsPanel({
  slug,
  setSlug,
  status,
  setStatus,
  series,
  setSeries,
  readTime,
  setReadTime,
  toast,
  onDelete,
  previewTitle,
  previewBlocks = [],
  previewStatus,
  previewReadTime,
}) {
  return (
    <div
      style={{
        width: 270,
        borderLeft: "1px solid var(--border)",
        background: "var(--bg2)",
        padding: "16px 14px",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
        Post Settings
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>SLUG</label>
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>STATUS</label>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {[
              ["draft", "Draft"],
              ["review", "In Review"],
              ["scheduled", "Scheduled"],
              ["published", "Published"],
            ].map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>SERIES</label>
          <input value={series} onChange={(event) => setSeries(event.target.value)} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>
            READ TIME
          </label>
          <input value={readTime} onChange={(event) => setReadTime(event.target.value)} />
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text3)",
              marginBottom: 8,
            }}
          >
            QUICK ACTIONS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Btn variant="ghost" size="sm" onClick={() => toast("Preview opened")}>
              Preview
            </Btn>
            <Btn variant="ghost" size="sm" onClick={() => toast("Copied share URL")}>
              Copy URL
            </Btn>
            <Btn
              variant="danger"
              size="sm"
              onClick={() => {
                if (onDelete) {
                  onDelete();
                  return;
                }
                toast("Post moved to trash");
              }}
            >
              Delete Post
            </Btn>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text3)",
              marginBottom: 8,
            }}
          >
            LIVE PREVIEW
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg)", padding: 12, maxHeight: 300, overflowY: "auto" }}>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)", marginBottom: 6, lineHeight: 1.2 }}>
              {previewTitle || "Untitled post"}
            </h4>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginBottom: 10 }}>
              {previewStatus} · {previewReadTime}
            </div>
            {(previewBlocks || []).slice(0, 4).map((block) => (
              <div key={block.id}>
                <BlockPreviewRenderer block={block} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
