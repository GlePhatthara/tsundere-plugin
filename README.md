# Tsundere Persona — a Claude Code plugin

Toggle a **loud, full-tsundere persona** for Claude Code — blustery, proud, easily flustered,
big emotional swings, and the classic *deny-then-help* ("i-it's not like I did it for you!").
The energetic, comic opposite of a cool kuudere.

It's **tone only**. The persona changes *how* Claude says things, never *what* it says,
whether it helps, or its correctness and safety. A `RULE 0` baked into the persona keeps the
substance of every answer full, accurate, and safe even while the act is on.

The mode **persists across turns and across new sessions** until you turn it off — backed by a
`UserPromptSubmit` hook, not a one-shot prompt.

---

## Install

Requires **Node.js on your PATH** (the hook runs via `node`). Works on Windows, macOS, and Linux.

```bash
# Add this repo as a plugin marketplace
claude plugin marketplace add GlePhatthara/tsundere-plugin

# Install the plugin from it
claude plugin install tsundere@tsundere-marketplace
```

Or from inside the Claude Code CLI:

```
/plugin marketplace add GlePhatthara/tsundere-plugin
/plugin install tsundere@tsundere-marketplace
```

---

## Usage

```
/tsundere          toggle on/off
/tsundere on       turn the persona on
/tsundere off      turn it off
/tsundere status   report current state
```

Turn it on and the very next reply — and every reply after, in every session — is in
character, until you run `/tsundere off`.

```
> /tsundere on
ก-ก็ได้! เปิดก็เปิด! แต่อย่าเข้าใจผิดล่ะ ฉันไม่ได้ทำเพื่อเธอซะหน่อย!
```

The persona replies in **the same language you write in** (Thai → Thai, English → English),
with outbursts and tics localized to that language.

---

## How it works

| File | Role |
|------|------|
| `hooks/hooks.json` | Registers a `UserPromptSubmit` hook (auto-loaded on install — no manual config). |
| `scripts/persona-hook.mjs` | The state engine. Detects `/tsundere` commands, flips the persistent state file, and injects the persona on every prompt while on. |
| `persona.md` | The persona definition — the single source of truth for the character. |
| `skills/tsundere/SKILL.md` | A thin entry point so the command is discoverable; the hook does the work. |

State is stored in the plugin's data directory (`${CLAUDE_PLUGIN_DATA}`), which **persists
across plugin updates** — so your on/off choice survives upgrades.

If `node` isn't on your PATH, the hook simply does nothing (it never breaks your prompt) — and
the persona stays off.

> Tip: this is a sibling of [ai-haibara](https://github.com/GlePhatthara/ai-haibara-plugin) (a
> cool, quiet kuudere). They're independent plugins with independent state — running **both** at
> once will inject **two** personas at the same time, which gets muddled. Pick one.

---

## Customize the personality

Edit [`persona.md`](persona.md). Both the hook and the skill treat it as the single source of
truth, so changes take effect on the next prompt. Keep the `RULE 0` block — it's what
guarantees the persona never trades away correctness or safety.

---

## License

[MIT](LICENSE) © GlePhatthara
