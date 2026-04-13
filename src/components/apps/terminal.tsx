"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SITE, STACK_CATEGORIES, PROJECTS } from "@/lib/data";

type Line = { text: string; type: "input" | "output" | "error" };

const WELCOME = [
  `SNCHZ OS 1.0: ${SITE.title}`,
  `Last login: ${new Date().toLocaleString()}`,
  "",
  'Type "help" for available commands.',
  "",
];

const COMMANDS: Record<string, (args: string[]) => string[]> = {
  help: () => [
    "Available commands:",
    "  help          Show this message",
    "  about         About me",
    "  skills        Show tech stack",
    "  projects      List projects",
    "  ls            List files",
    "  cat <file>    Read a file",
    "  whoami        Who am I?",
    "  clear         Clear terminal",
    "  neofetch      System info",
    "",
  ],
  about: () => [
    `${SITE.title}, ${SITE.role}`,
    "",
    SITE.description,
    "",
    `Email:    ${SITE.email}`,
    `GitHub:   ${SITE.github}`,
    `LinkedIn: ${SITE.linkedin}`,
    "",
  ],
  skills: () => {
    const lines: string[] = [];
    STACK_CATEGORIES.forEach((cat) => {
      lines.push(`\x1b[1m${cat.label}\x1b[0m`);
      lines.push(`  ${cat.items.join(", ")}`);
      lines.push("");
    });
    return lines;
  },
  projects: () => {
    const lines: string[] = [];
    PROJECTS.forEach((p) => {
      const status = p.status === "acquired" ? "✓ acquired" : "● active";
      lines.push(`  ${p.name.padEnd(20)} ${status.padEnd(14)} ${p.year}`);
    });
    lines.push("");
    return lines;
  },
  ls: () => ["about.txt  resume.pdf  projects/  tools/  .config/", ""],
  cat: (args) => {
    const file = args[0];
    if (!file) return ["usage: cat <filename>", ""];
    if (file === "about.txt") return COMMANDS.about([]);
    if (file === "resume.pdf") return ["[Binary file: open in Preview]", ""];
    return [`cat: ${file}: No such file or directory`, ""];
  },
  whoami: () => [`${SITE.title.toLowerCase().replace(/\s/g, "")}`, ""],
  neofetch: () => [
    "              .:'       OS:      SNCHZ OS 1.0",
    "          __ :'__       Host:    snchz.co",
    "       .'`  `-'  `'.   Kernel:  Next.js 16",
    "      :          :     Shell:   TypeScript",
    "      :          :     CPU:     Full-Stack",
    "       `.  `-'  .'     Memory:  5 Exits",
    "         `'.:.'`       GPU:     AI-Native",
    "",
  ],
  echo: (args) => [args.join(" "), ""],
  date: () => [new Date().toString(), ""],
  pwd: () => ["/Users/bill", ""],
};

export function TerminalApp() {
  const [lines, setLines] = useState<Line[]>(
    WELCOME.map((text) => ({ text, type: "output" as const }))
  );
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      setLines((prev) => [...prev, { text: `$ ${trimmed}`, type: "input" }]);
      setInput("");
      return;
    }

    const [cmd, ...args] = trimmed.split(/\s+/);
    const newLines: Line[] = [{ text: `$ ${trimmed}`, type: "input" }];

    if (cmd === "clear") {
      setLines([]);
      setInput("");
      setHistory((prev) => [...prev, trimmed]);
      setHistoryIdx(-1);
      return;
    }

    const handler = COMMANDS[cmd!];
    if (handler) {
      newLines.push(...handler(args).map((text) => ({ text, type: "output" as const })));
    } else {
      newLines.push({ text: `zsh: command not found: ${cmd}`, type: "error" });
      newLines.push({ text: "", type: "output" });
    }

    setLines((prev) => [...prev, ...newLines]);
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);
    setInput("");
  }, [input]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIdx = historyIdx < 0 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(newIdx);
      setInput(history[newIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx < 0) return;
      const newIdx = historyIdx + 1;
      if (newIdx >= history.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(newIdx);
        setInput(history[newIdx] ?? "");
      }
    }
  }

  return (
    <div
      className="h-full overflow-auto bg-[#0d0d0d] p-4 font-mono text-[13px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className={
            line.type === "error"
              ? "text-red-400"
              : line.type === "input"
                ? "text-green-400"
                : "text-white/70"
          }
          style={{ whiteSpace: "pre-wrap" }}
        >
          {line.text}
        </div>
      ))}
      <div className="flex items-center text-green-400">
        <span className="shrink-0">$ </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-green-400 outline-none caret-green-400"
          autoFocus
          spellCheck={false}
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
