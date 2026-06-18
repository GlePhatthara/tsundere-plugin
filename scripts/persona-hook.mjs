#!/usr/bin/env node
// UserPromptSubmit hook for the Tsundere persona plugin.
//
// This hook is the single source of truth for the toggle. On every prompt it:
//   1. Detects a toggle command in the user's prompt text
//      (/tsundere, /tsundere on|off|status|toggle, and Thai variants).
//      If found, it flips the persistent state file and injects a short
//      confirmation — adopting the persona the SAME turn when turning on.
//   2. Otherwise, if state is "on", injects persona.md as additionalContext.
//   3. If state is "off" (or anything goes wrong), emits nothing and lets the
//      prompt proceed untouched.
//
// State lives in CLAUDE_PLUGIN_DATA (persists across plugin updates).
// Persona text lives in CLAUDE_PLUGIN_ROOT (ships with the plugin).
//
// Robustness rule: a hook must never break the user's prompt. Every failure
// path degrades to "do nothing" and exits 0.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT ?? '';
const PLUGIN_DATA = process.env.CLAUDE_PLUGIN_DATA ?? '';

const STATE_FILE = PLUGIN_DATA ? join(PLUGIN_DATA, 'state.txt') : '';
const PERSONA_FILE = PLUGIN_ROOT ? join(PLUGIN_ROOT, 'persona.md') : '';

/** Emit a UserPromptSubmit additionalContext payload and exit cleanly. */
function inject(context) {
  if (context && context.trim()) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext: context,
        },
      }),
    );
  }
  process.exit(0);
}

/** Read on/off state; anything unreadable or unknown means "off". */
function readState() {
  if (!STATE_FILE) return 'off';
  try {
    const v = readFileSync(STATE_FILE, 'utf8').trim().toLowerCase();
    return v === 'on' ? 'on' : 'off';
  } catch {
    return 'off';
  }
}

/** Persist on/off state. Best-effort; failure is non-fatal. */
function writeState(value) {
  if (!PLUGIN_DATA) return false;
  try {
    mkdirSync(PLUGIN_DATA, { recursive: true });
    writeFileSync(STATE_FILE, value, 'utf8');
    return true;
  } catch {
    return false;
  }
}

/** Load the persona text the plugin ships with. */
function readPersona() {
  if (!PERSONA_FILE) return '';
  try {
    return readFileSync(PERSONA_FILE, 'utf8');
  } catch {
    return '';
  }
}

/**
 * Parse a toggle command out of the prompt.
 * Returns { action } where action is 'on' | 'off' | 'status' | 'toggle',
 * or null if the prompt is not a toggle command.
 * Accepts EN and a few Thai argument words; matches the leading slash command only.
 */
function parseCommand(prompt) {
  if (typeof prompt !== 'string') return null;
  const m = prompt.trim().match(/^\/tsundere(?:\s+(\S+))?\s*$/i);
  if (!m) return null;
  const arg = (m[1] ?? '').toLowerCase();
  if (arg === '') return { action: 'toggle' };
  if (arg === 'on' || arg === 'start' || arg === 'เปิด') return { action: 'on' };
  if (arg === 'off' || arg === 'stop' || arg === 'ปิด') return { action: 'off' };
  if (arg === 'status' || arg === '?') return { action: 'status' };
  if (arg === 'toggle') return { action: 'toggle' };
  // Unknown argument -> treat as status so we never silently do the wrong thing.
  return { action: 'status' };
}

async function readStdin() {
  try {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return Buffer.concat(chunks).toString('utf8');
  } catch {
    return '';
  }
}

async function main() {
  let prompt = '';
  try {
    const raw = await readStdin();
    if (raw.trim()) prompt = JSON.parse(raw).prompt ?? '';
  } catch {
    prompt = '';
  }

  const cmd = parseCommand(prompt);

  if (cmd) {
    const current = readState();

    if (cmd.action === 'status') {
      inject(`The Tsundere persona is currently **${current.toUpperCase()}**.`);
    }

    let next;
    if (cmd.action === 'on') next = 'on';
    else if (cmd.action === 'off') next = 'off';
    else next = current === 'on' ? 'off' : 'on'; // toggle

    const ok = writeState(next);

    if (!ok) {
      inject(
        `Tried to turn the Tsundere persona ${next.toUpperCase()} but could not write the ` +
          `state file (CLAUDE_PLUGIN_DATA unavailable). Tell the user plainly that the toggle ` +
          `did not persist.`,
      );
    }

    if (next === 'on') {
      // Adopt the persona THIS turn: inject both an instruction to confirm in-character
      // and the full persona so the very reply to "/tsundere on" is already in voice.
      const persona = readPersona();
      const preamble =
        `The user just turned the Tsundere persona ON. Give a short, in-character ` +
        `confirmation (loud, flustered, deny-then-accept) in the user's language, and note it ` +
        `stays on across turns and sessions until "/tsundere off". Then answer normally, in persona.\n\n`;
      inject(persona ? preamble + persona : preamble);
    } else {
      // Turned off (or toggled off): drop the act.
      inject(
        `The user just turned the Tsundere persona OFF. Drop the persona now: one last small ` +
          `flustered beat is allowed, then confirm plainly that normal mode is back and the ` +
          `persona will no longer be injected.`,
      );
    }
  }

  // Not a command: inject persona only when on.
  if (readState() === 'on') {
    inject(readPersona());
  }

  process.exit(0);
}

main();
