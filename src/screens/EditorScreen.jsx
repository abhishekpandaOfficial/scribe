import { useMemo, useState } from "react";
import { BLOCK_TYPES, makeBlock } from "../data/mockData";
import { Btn } from "../components/ui";
import BlockContentRenderer from "../components/editor/BlockContentRenderer";
import BlockFrame from "../components/editor/BlockFrame";
import BlockLibraryPanel from "../components/editor/BlockLibraryPanel";
import BlockPreviewRenderer from "../components/editor/BlockPreviewRenderer";
import EditorTopBar from "../components/editor/EditorTopBar";
import PostSettingsPanel from "../components/editor/PostSettingsPanel";
import { buildInitialBlocks, getGroupedBlockTypes } from "../components/editor/editorHelpers";
import { postsApi } from "../lib/apiClient";

function pickExcerpt(blocks) {
  const candidate = blocks.find((block) => ["lead", "paragraph", "quote"].includes(block.type));
  if (!candidate) {
    return "";
  }
  return (candidate.content || "").slice(0, 240);
}

function inferTags(post, blocks) {
  if (Array.isArray(post?.tags) && post.tags.length) {
    return post.tags;
  }

  const text = blocks
    .map((block) => block.content || "")
    .join(" ")
    .toLowerCase();

  const pool = ["csharp", ".net", "performance", "architecture", "api", "cloud", "kubernetes"];
  const tags = pool.filter((tag) => text.includes(tag));
  return tags.slice(0, 5);
}

export default function EditorScreen({
  post,
  setScreen,
  toast,
  token,
  onPostSaved,
  onPostDeleted,
}) {
  const [postId, setPostId] = useState(post?.id || null);
  const [title, setTitle] = useState(post?.title || "Untitled post");
  const [slug, setSlug] = useState(post?.slug || "untitled-post");
  const [status, setStatus] = useState(post?.status || "draft");
  const [series, setSeries] = useState(post?.series || "C# Mastery");
  const [readTime, setReadTime] = useState(post?.readTime || "7 min");
  const [blocks, setBlocks] = useState(() => buildInitialBlocks(post));
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const groupedBlocks = useMemo(() => getGroupedBlockTypes(query), [query]);
  const hasHeadingBlock = useMemo(
    () => blocks.some((block) => block.type === "h1" && (block.content || "").trim().length > 0),
    [blocks]
  );

  const updateBlock = (id, patch) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, ...patch } : block)));
  };

  const removeBlock = (id) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  const moveBlock = (id, direction) => {
    setBlocks((prev) => {
      const index = prev.findIndex((block) => block.id === id);
      if (index === -1) {
        return prev;
      }

      const target = index + direction;
      if (target < 0 || target >= prev.length) {
        return prev;
      }

      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addBlock = (type) => {
    setBlocks((prev) => [...prev, makeBlock(type)]);
    toast("Block added");
  };

  const insertBlockAfter = (currentId, type, replaceCurrent = false) => {
    setBlocks((prev) => {
      const index = prev.findIndex((item) => item.id === currentId);
      if (index < 0) {
        return prev;
      }

      const next = [...prev];
      if (replaceCurrent) {
        next[index] = makeBlock(type);
        return next;
      }

      next.splice(index + 1, 0, makeBlock(type));
      return next;
    });

    const label = BLOCK_TYPES.find((item) => item.type === type)?.label || type;
    toast(`${label} block added`, "info");
  };

  const persistPost = async (nextStatus = status) => {
    if (!token) {
      toast("You must be logged in to save", "error");
      return null;
    }

    const payload = {
      title: title.trim() || "Untitled post",
      slug,
      status: nextStatus,
      series,
      readTime,
      excerpt: pickExcerpt(blocks),
      content: blocks,
      tags: inferTags(post, blocks),
      chapter: post?.chapter || 1,
      difficulty: post?.difficulty || "intermediate",
    };

    try {
      setSaving(true);
      const response = postId
        ? await postsApi.update(token, postId, payload)
        : await postsApi.create(token, payload);

      const saved = response.data;
      if (!postId) {
        setPostId(saved.id);
      }
      setStatus(saved.status);
      if (saved.slug) {
        setSlug(saved.slug);
      }

      onPostSaved?.(saved);
      return saved;
    } catch (error) {
      toast(error.message || "Failed to save post", "error");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    const saved = await persistPost(status === "published" ? "draft" : status);
    if (saved) {
      toast("Draft saved");
    }
  };

  const publish = async () => {
    const saved = await persistPost("published");
    if (saved) {
      toast("Post published");
      setScreen("dashboard");
    }
  };

  const removePost = async () => {
    if (!token || !postId) {
      toast("Save the post first before deleting", "warning");
      return;
    }

    try {
      await postsApi.remove(token, postId);
      toast("Post deleted", "info");
      onPostDeleted?.(postId);
    } catch (error) {
      toast(error.message || "Failed to delete post", "error");
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {!previewMode && (
        <BlockLibraryPanel query={query} setQuery={setQuery} groupedBlocks={groupedBlocks} addBlock={addBlock} />
      )}

      <div style={{ flex: 1, overflowY: "auto" }}>
        <EditorTopBar
          title={title}
          setTitle={setTitle}
          status={status}
          save={save}
          onPublish={publish}
          setScreen={setScreen}
          loading={saving}
          previewMode={previewMode}
          onTogglePreview={() => setPreviewMode((current) => !current)}
        />

        {previewMode ? (
          <div
            style={{
              maxWidth: 980,
              margin: "0 auto",
              padding: "24px 24px 60px",
            }}
          >
            <article
              style={{
                border: "1px solid var(--border)",
                borderRadius: 16,
                background: "var(--bg2)",
                padding: "32px 34px",
              }}
            >
              {!hasHeadingBlock && (
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(34px,5vw,48px)",
                    lineHeight: 1.08,
                    color: "var(--text)",
                    marginBottom: 14,
                  }}
                >
                  {title}
                </h1>
              )}
              <div
                style={{
                  color: "var(--text3)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  marginBottom: 22,
                }}
              >
                /{slug} · {status} · {readTime}
              </div>

              {blocks.map((block) => (
                <BlockPreviewRenderer key={block.id} block={block} />
              ))}
            </article>
          </div>
        ) : (
          <div
            style={{
              maxWidth: 860,
              margin: "0 auto",
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {blocks.map((block) => (
              <BlockFrame
                key={block.id}
                block={block}
                onRemove={() => removeBlock(block.id)}
                onMoveUp={() => moveBlock(block.id, -1)}
                onMoveDown={() => moveBlock(block.id, 1)}
              >
                <BlockContentRenderer
                  block={block}
                  updateBlock={updateBlock}
                  toast={toast}
                  insertBlockAfter={insertBlockAfter}
                />
              </BlockFrame>
            ))}

            <Btn variant="subtle" onClick={() => addBlock("paragraph")} style={{ justifyContent: "center" }}>
              + Add paragraph
            </Btn>
          </div>
        )}
      </div>

      {!previewMode && (
        <PostSettingsPanel
          slug={slug}
          setSlug={setSlug}
          status={status}
          setStatus={setStatus}
          series={series}
          setSeries={setSeries}
          readTime={readTime}
          setReadTime={setReadTime}
          toast={toast}
          onDelete={removePost}
        />
      )}
    </div>
  );
}
