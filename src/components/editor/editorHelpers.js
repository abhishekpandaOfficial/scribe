import { BLOCK_TYPES, makeBlock } from "../../data/mockData";

export const CALLOUT_META = {
  "callout-insight": { icon: "💡", border: "rgba(0,204,248,.25)", bg: "rgba(0,204,248,.06)" },
  "callout-warning": { icon: "⚠️", border: "rgba(255,170,68,.3)", bg: "rgba(255,170,68,.08)" },
  "callout-danger": { icon: "🚨", border: "rgba(255,107,107,.3)", bg: "rgba(255,107,107,.08)" },
  "callout-success": { icon: "✅", border: "rgba(0,229,160,.3)", bg: "rgba(0,229,160,.08)" },
  "callout-info": { icon: "ℹ️", border: "rgba(90,171,255,.3)", bg: "rgba(90,171,255,.08)" },
};

export function buildInitialBlocks(post) {
  if (!post) {
    return [
      makeBlock("h1"),
      makeBlock("lead"),
      makeBlock("paragraph"),
      makeBlock("code"),
      makeBlock("callout-insight"),
    ];
  }

  return [
    { ...makeBlock("h1"), content: post.title },
    {
      ...makeBlock("lead"),
      content:
        post.excerpt ||
        "Add a sharp intro that tells readers what they will get from this post.",
    },
    makeBlock("paragraph"),
    makeBlock("code"),
  ];
}

export function getGroupedBlockTypes(query) {
  const q = query.trim().toLowerCase();
  const filtered = BLOCK_TYPES.filter((item) => {
    if (!q) {
      return true;
    }

    return (
      item.label.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  });

  return filtered.reduce((acc, item) => {
    if (!acc[item.cat]) {
      acc[item.cat] = [];
    }
    acc[item.cat].push(item);
    return acc;
  }, {});
}
