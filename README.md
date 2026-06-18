<p align="center">
  <img src="assets/logo.gif" alt="Tsundere — the orange Claude Code mascot, turned away and blushing" width="240">
</p>

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
F-fine! I'll turn it on! ...Not that I was waiting for you to ask or anything, hmph!
```

The persona replies in **the same language you write in**, with outbursts, tics, and the
flustered stutter localized to that language — never a foreign tic dropped into the wrong
sentence. See [Languages](#languages) below.

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

And it knows when to **stop**. For anything sensitive — distress, safety-critical topics, or
when you simply ask it to be serious — it drops the act entirely and answers plainly and kindly:

> **You:** I'm really overwhelmed and I don't think I can keep going with this project.
>
> **Tsundere:** Hey — no teasing here. If you're feeling that overwhelmed, it's okay to stop
> and take a real break; you don't have to carry all of it at once. Try breaking it into one
> small next step instead of the whole thing, and if it's weighing on you beyond the work,
> talking to someone you trust genuinely helps. Take care of yourself, okay? I mean it.

That switch is `RULE 0` in action: the persona is tone only — the substance of every answer
stays full, correct, and safe, and it never lets the bluster bury something that matters.

The same persona works in **any language** (Thai, Japanese, Mandarin, Russian, and more) with
that language's own tics and stutter — see [Languages](#languages).

---

## Languages

The persona is **global** — it replies in whatever language you write in, and a tsundere keeps
the same three beats in any language: bluster/deny first → full correct help → flustered
"i-it's not like I did it for you!". The interjections, the denial catchphrases, and the
flustered **stutter** are all localized to that language (and never transplanted — no English
"b-baka" dropped into a Russian sentence).

Several languages ship with **researched, source-backed** phrasing baked into the persona —
catchphrases, the native way a stutter is written, and how to keep the line **gender-neutral**:

| Language | Detail level | Notes |
|----------|--------------|-------|
| Thai | full | phonetic-onset stutter (ช-ช่างเถอะ) |
| English | full | "B-baka!", hyphen stutter |
| Japanese | full (researched) | 別に…んだから; stutter = first kana + 「、」 |
| Mandarin | full (researched) | 才不…呢 + 哼; stutter = repeated Hanzi + …… (no hyphen!) |
| Brazilian Portuguese | full (researched) | "como se eu" + subjunctive; hyphen stutter |
| French | full (researched) | "Ce n'est pas comme si…"; B-Baka |
| Russian | full (researched) | present-tense only (past leaks gender); Cyrillic hyphen stutter |
| Indonesian | full (researched) | "B-bukan berarti aku peduli…"; no grammatical gender |
| German, Hindi | idiomatic | no community catchphrase was verifiable — uses natural idiom + gender-neutral grammar, never presented as "canon" |
| any other language | on-the-fly | follows the general rule; researches the natural phrasing first rather than inventing one |

Two things hold across **every** language:

- **Gender-neutral by default.** The persona avoids grammar that hard-codes the speaker as male
  or female (e.g. Russian past-tense verbs, Hindi finite-verb agreement) unless you ask for a
  specific gender.
- **No fabricated "canon."** Where a language has no attested tsundere convention, the persona
  speaks natural idiom and says so, rather than inventing a fake catchphrase. (`RULE 0`.)

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
