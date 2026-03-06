import { useMemo, useRef, useState } from "react";
import { BLOCK_TYPES } from "../../data/mockData";

const MAX_RESULTS = 8;

function getSlashContext(value, caret) {
  const beforeCaret = value.slice(0, caret);
  const match = beforeCaret.match(/(^|\s)\/([a-z0-9-]*)$/i);
  if (!match) {
    return null;
  }

  const slashIndex = beforeCaret.lastIndexOf("/");
  if (slashIndex < 0) {
    return null;
  }

  return {
    query: (match[2] || "").toLowerCase(),
    start: slashIndex,
    end: caret,
  };
}

function rankBlock(item, query) {
  if (!query) {
    return 3;
  }

  const label = item.label.toLowerCase();
  const type = item.type.toLowerCase();
  if (label.startsWith(query) || type.startsWith(query)) {
    return 0;
  }
  if (label.includes(query) || type.includes(query)) {
    return 1;
  }
  return 2;
}

export default function SlashCommandTextarea({
  value,
  onChangeValue,
  onInsertBlock,
  rows = 3,
  placeholder,
  style = {},
}) {
  const textareaRef = useRef(null);
  const [command, setCommand] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = useMemo(() => {
    if (!command) {
      return [];
    }

    const next = BLOCK_TYPES
      .filter((item) => {
        const q = command.query;
        if (!q) {
          return true;
        }

        const haystack = `${item.type} ${item.label} ${item.desc} ${item.cat}`.toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => rankBlock(a, command.query) - rankBlock(b, command.query))
      .slice(0, MAX_RESULTS);

    return next;
  }, [command]);

  const updateSlashState = (nextValue, caret) => {
    const ctx = getSlashContext(nextValue, caret);
    setCommand(ctx);
    setActiveIndex(0);
  };

  const handleChange = (event) => {
    const nextValue = event.target.value;
    const caret = event.target.selectionStart ?? nextValue.length;
    onChangeValue(nextValue);
    updateSlashState(nextValue, caret);
  };

  const applyCommand = (blockType) => {
    if (!command) {
      return;
    }

    const nextValue = `${value.slice(0, command.start)}${value.slice(command.end)}`;
    onChangeValue(nextValue);

    const replaceCurrent = nextValue.trim().length === 0;
    onInsertBlock?.(blockType, { replaceCurrent });

    setCommand(null);
    setActiveIndex(0);

    if (!replaceCurrent) {
      const nextCaret = Math.min(command.start, nextValue.length);
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (!el) {
          return;
        }
        el.focus();
        el.setSelectionRange(nextCaret, nextCaret);
      });
    }
  };

  const handleKeyDown = (event) => {
    if (!command || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((idx) => (idx + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((idx) => (idx - 1 + suggestions.length) % suggestions.length);
      return;
    }

    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      const selected = suggestions[activeIndex] || suggestions[0];
      if (selected) {
        applyCommand(selected.type);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setCommand(null);
      setActiveIndex(0);
    }
  };

  const syncContextFromSelection = (event) => {
    const currentValue = event.currentTarget.value;
    const caret = event.currentTarget.selectionStart ?? currentValue.length;
    updateSlashState(currentValue, caret);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={syncContextFromSelection}
        onKeyUp={syncContextFromSelection}
        rows={rows}
        style={style}
        placeholder={placeholder}
      />

      {command && (
        <div
          style={{
            border: "1px solid var(--border2)",
            borderRadius: 10,
            background: "var(--bg2)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "6px 10px",
              borderBottom: "1px solid var(--border)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text3)",
              letterSpacing: ".4px",
            }}
          >
            Slash Commands
          </div>

          {suggestions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {suggestions.map((item, idx) => {
                const active = idx === activeIndex;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      applyCommand(item.type);
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      textAlign: "left",
                      background: active ? "var(--bg4)" : "transparent",
                      border: "none",
                      borderTop: idx === 0 ? "none" : "1px solid var(--border)",
                      color: active ? "var(--text)" : "var(--text2)",
                      padding: "8px 10px",
                    }}
                  >
                    <span style={{ width: 18, textAlign: "center" }}>{item.icon}</span>
                    <span style={{ fontSize: 12, fontFamily: "var(--font-body)" }}>{item.label}</span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 10,
                        color: "var(--text3)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      /{item.type}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: "10px",
                color: "var(--text3)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
              }}
            >
              No matching blocks.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
