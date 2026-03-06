import { useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

export function CodeBlockEl({ block, updateBlock, toast }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText(block.content || "").catch(() => {});
    setCopied(true);
    toast("Code copied!");
    setTimeout(() => setCopied(false), 1800);
  };

  const highlightCode = (code) => {
    if (!code) {
      return "";
    }

    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/(\/\/[^\n]*)/g, '<span style="color:#546e7a;font-style:italic">$1</span>')
      .replace(
        /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
        '<span style="color:#c3e88d">$1</span>'
      )
      .replace(
        /\b(const|let|var|function|async|await|return|import|export|from|class|interface|type|extends|implements|new|this|if|else|for|while|try|catch|public|private|protected|override|static|readonly|abstract|void|null|undefined|true|false)\b/g,
        '<span style="color:#c792ea">$1</span>'
      )
      .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#f78c6c">$1</span>')
      .replace(/\b([A-Z][a-zA-Z0-9]+)\b/g, '<span style="color:#00ccf8">$1</span>');
  };

  return (
    <div
      style={{
        background: "var(--bg3)",
        border: "1px solid var(--border2)",
        borderRadius: 11,
        overflow: "hidden",
        margin: "4px 0",
      }}
    >
      <div
        style={{
          background: "var(--bg4)",
          borderBottom: "1px solid var(--border2)",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff6b6b", "#ffaa44", "#00e5a0"].map((color) => (
            <div key={color} style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
          ))}
        </div>

        <select
          value={block.lang || "typescript"}
          onChange={(event) => updateBlock(block.id, { lang: event.target.value })}
          style={{
            background: "rgba(0,204,248,.1)",
            color: "var(--accent)",
            border: "none",
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            padding: "2px 6px",
            borderRadius: 4,
            width: "auto",
            boxShadow: "none",
          }}
        >
          {["typescript", "javascript", "csharp", "python", "sql", "bash", "go", "rust", "yaml", "json"].map(
            (language) => (
              <option key={language} value={language}>
                {language}
              </option>
            )
          )}
        </select>

        <input
          value={block.title || ""}
          onChange={(event) => updateBlock(block.id, { title: event.target.value })}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text3)",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            padding: 0,
            width: 120,
            boxShadow: "none",
          }}
          placeholder="filename…"
        />

        <button
          onClick={copyCode}
          style={{
            marginLeft: "auto",
            background: "var(--bg5)",
            border: "1px solid var(--border2)",
            borderRadius: 5,
            color: copied ? "var(--green)" : "var(--text2)",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            padding: "3px 8px",
          }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      <div style={{ position: "relative" }}>
        <pre
          style={{
            padding: "14px 16px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.76,
            color: "var(--text2)",
            overflow: "auto",
            minHeight: 80,
          }}
          dangerouslySetInnerHTML={{ __html: highlightCode(block.content || "") }}
        />
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={(event) => updateBlock(block.id, { content: event.target.innerText })}
          style={{
            position: "absolute",
            inset: 0,
            padding: "14px 16px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.76,
            color: "transparent",
            caretColor: "var(--text)",
            outline: "none",
            overflow: "auto",
            whiteSpace: "pre",
          }}
        >
          {block.content || ""}
        </div>
      </div>
    </div>
  );
}

export function MermaidBlockEl({ block, updateBlock }) {
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!editing && window.mermaid && ref.current) {
      ref.current.innerHTML = "";
      const id = `mmd-${block.id.toString().replace(/\./g, "")}`;
      ref.current.innerHTML = `<div id="${id}">${block.code}</div>`;
      try {
        window.mermaid.init(undefined, `#${id}`);
      } catch (error) {
        ref.current.innerHTML = `<span style="color:var(--red);font-size:12px;font-family:var(--font-mono)">Parse error: ${
          error.message || "invalid syntax"
        }</span>`;
      }
    }
  }, [block.code, editing, block.id]);

  useEffect(() => {
    if (!window.mermaid) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js";
      script.onload = () => {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#0d1117",
            primaryTextColor: "#d8e8f8",
            primaryBorderColor: "#00ccf8",
            lineColor: "#00ccf8",
            secondaryColor: "#172030",
            edgeLabelBackground: "#0c1018",
          },
        });
      };
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div
      style={{
        background: "var(--bg3)",
        border: "1px solid var(--border2)",
        borderRadius: 11,
        overflow: "hidden",
        margin: "4px 0",
      }}
    >
      <div
        style={{
          background: "var(--bg4)",
          borderBottom: "1px solid var(--border2)",
          padding: "7px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--purple)",
            fontWeight: 700,
            background: "rgba(176,138,255,.1)",
            padding: "2px 7px",
            borderRadius: 4,
          }}
        >
          ◇ MERMAID
        </span>
        <input
          value={block.title || "Diagram"}
          onChange={(event) => updateBlock(block.id, { title: event.target.value })}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text3)",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            padding: 0,
            width: 120,
            boxShadow: "none",
          }}
        />
        <button
          onClick={() => setEditing((value) => !value)}
          style={{
            marginLeft: "auto",
            background: "none",
            color: "var(--accent)",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            border: "1px solid rgba(0,204,248,.2)",
            borderRadius: 5,
            padding: "3px 8px",
          }}
        >
          {editing ? "✓ Render" : "✏ Edit"}
        </button>
      </div>

      {editing ? (
        <textarea
          value={block.code || ""}
          onChange={(event) => updateBlock(block.id, { code: event.target.value })}
          rows={8}
          style={{
            background: "var(--bg3)",
            border: "none",
            borderRadius: 0,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--text2)",
            resize: "vertical",
            padding: "12px 16px",
          }}
        />
      ) : (
        <div
          ref={ref}
          style={{
            padding: "20px",
            minHeight: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text2)",
            fontSize: 13,
          }}
        >
          {!window.mermaid && (
            <span style={{ color: "var(--text3)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              ⟳ Loading Mermaid…
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function ChartBlockEl({ block, updateBlock }) {
  const [chartType, setChartType] = useState(block.chartType || "bar");

  return (
    <div
      style={{
        background: "var(--bg3)",
        border: "1px solid var(--border2)",
        borderRadius: 11,
        overflow: "hidden",
        margin: "4px 0",
      }}
    >
      <div
        style={{
          background: "var(--bg4)",
          borderBottom: "1px solid var(--border2)",
          padding: "7px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--blue)",
            fontWeight: 700,
            background: "rgba(90,171,255,.1)",
            padding: "2px 7px",
            borderRadius: 4,
          }}
        >
          📊 CHART
        </span>
        <input
          value={block.title || ""}
          onChange={(event) => updateBlock(block.id, { title: event.target.value })}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text3)",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            padding: 0,
            width: 140,
            boxShadow: "none",
          }}
          placeholder="Chart title…"
        />

        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {["bar", "line", "area"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setChartType(type);
                updateBlock(block.id, { chartType: type });
              }}
              style={{
                padding: "3px 8px",
                borderRadius: 5,
                background: chartType === type ? "var(--bg5)" : "transparent",
                color: chartType === type ? "var(--text)" : "var(--text3)",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                border: chartType === type ? "1px solid var(--border3)" : "none",
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16, background: "var(--bg3)" }}>
        <ResponsiveContainer width="100%" height={180}>
          {chartType === "area" ? (
            <AreaChart data={block.data || []} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ccf8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00ccf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                tick={{ fill: "#3e5a7a", fontSize: 10, fontFamily: "var(--font-mono)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border2)",
                  borderRadius: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="value" stroke="#00ccf8" strokeWidth={2} fill="url(#cg)" />
            </AreaChart>
          ) : chartType === "line" ? (
            <LineChart data={block.data || []} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#3e5a7a", fontSize: 10, fontFamily: "var(--font-mono)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border2)",
                  borderRadius: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00ccf8"
                strokeWidth={2}
                dot={{ fill: "#00ccf8", r: 4 }}
              />
            </LineChart>
          ) : (
            <BarChart data={block.data || []} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#3e5a7a", fontSize: 10, fontFamily: "var(--font-mono)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border2)",
                  borderRadius: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" fill="#00ccf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TableBlockEl({ block, updateBlock }) {
  const { headers = [], rows = [] } = block;

  const addRow = () => updateBlock(block.id, { rows: [...rows, Array(headers.length).fill("")] });

  const addCol = () =>
    updateBlock(block.id, {
      headers: [...headers, "Column"],
      rows: rows.map((row) => [...row, ""]),
    });

  const updateCell = (rowIndex, colIndex, value) => {
    const nextRows = [...rows];
    nextRows[rowIndex] = [...nextRows[rowIndex]];
    nextRows[rowIndex][colIndex] = value;
    updateBlock(block.id, { rows: nextRows });
  };

  return (
    <div style={{ margin: "4px 0", border: "1px solid var(--border2)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {headers.map((header, colIndex) => (
                <th
                  key={colIndex}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    background: "var(--bg4)",
                    borderBottom: "1px solid var(--border2)",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    color: "var(--text2)",
                  }}
                >
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(event) => {
                      const nextHeaders = [...headers];
                      nextHeaders[colIndex] = event.target.innerText;
                      updateBlock(block.id, { headers: nextHeaders });
                    }}
                    style={{ outline: "none", minWidth: 60 }}
                  >
                    {header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ borderBottom: "1px solid var(--border)" }}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} style={{ padding: "8px 12px", fontSize: 13, color: "var(--text2)" }}>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(event) => updateCell(rowIndex, colIndex, event.target.innerText)}
                      style={{ outline: "none", minWidth: 60 }}
                    >
                      {cell}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "8px 12px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg3)",
        }}
      >
        <button
          onClick={addRow}
          style={{
            background: "none",
            color: "var(--text3)",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            border: "1px solid var(--border2)",
            borderRadius: 5,
            padding: "3px 8px",
          }}
        >
          + Row
        </button>
        <button
          onClick={addCol}
          style={{
            background: "none",
            color: "var(--text3)",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            border: "1px solid var(--border2)",
            borderRadius: 5,
            padding: "3px 8px",
          }}
        >
          + Column
        </button>
      </div>
    </div>
  );
}
