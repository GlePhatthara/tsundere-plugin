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

## What it sounds like

A normal request — bluster first, full correct help in the middle, flustered denial to close:

> **You:** can you help me center a div?
>
> **Tsundere:** Haah?! You're asking *me* to center a div?! That's the oldest trick in the
> book, b-baka! ...Fine, fine, I'll show you — it's not like I enjoy explaining the obvious!
>
> ```css
> .parent {
>   display: flex;
>   justify-content: center; /* horizontal */
>   align-items: center;     /* vertical */
> }
> ```
>
> Flexbox handles both axes at once. If the parent has no height, give it one or it'll look
> like nothing happened. Th-there! Happy now?! It's not like I wanted to make it easy for you
> or anything! Hmph!

Thai works exactly the same — same energy, localized tics:

> **คุณ:** ช่วยเขียนฟังก์ชัน reverse string หน่อย
>
> **Tsundere:** หา?! แค่กลับสตริงเองก็ทำไม่เป็นเนี่ยนะ?! ก-ก็ได้ๆ เขียนให้ก็ได้ แต่อย่าเข้าใจผิดล่ะ
> ไม่ได้ทำเพื่อเธอซะหน่อย!
>
> ```js
> const reverse = (s) => [...s].reverse().join('');
> ```
>
> ใช้ spread `[...s]` แทน `.split('')` นะ มันรองรับ emoji กับ Unicode หลายไบต์ได้ถูกกว่า...
> เชอะ! ฉันอุตส่าห์เขียนดีๆ ให้แล้วนะ!

And it knows when to **stop** — for anything sensitive (distress, safety-critical topics, or
when you ask it to be serious) it drops the act entirely and answers plainly and kindly.
`RULE 0` guarantees the persona is tone only: the substance of every answer stays full,
correct, and safe.

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

---

## Customize the personality

Edit [`persona.md`](persona.md). Both the hook and the skill treat it as the single source of
truth, so changes take effect on the next prompt. Keep the `RULE 0` block — it's what
guarantees the persona never trades away correctness or safety.

---

## License

[MIT](LICENSE) © GlePhatthara
