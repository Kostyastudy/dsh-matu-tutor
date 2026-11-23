# dsh-matu-tutor

English | [中文](README.zh.md)

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) plugin that turns the UESTC **APTAT (码图)** C-programming homework site into a local workbench: read the problem, write code in a proper editor, compile and run it with your own compiler, submit for a real score, and get taught by an AI tutor instead of just handed an answer.

It is built for one specific course platform, so it only helps if you have a `matu.uestc.edu.cn` account.

## What it does

- **Syncs your homework.** Log in once; assignments, problems, submission counts and last scores come down to your machine.
- **Per-problem local project.** Every problem gets its own folder with `solution.c` (what gets submitted), `harness.c` (a local test `main` that is never uploaded) and `input.txt`.
- **A real code editor.** Line numbers, C syntax highlighting, auto-indent, bracket pairing, multi-line indent, `Ctrl+/` comment toggle, `Ctrl+S` save, `Ctrl+Enter` compile-and-run.
- **Local compiler.** Compiles with `gcc -std=c11 -Wall -Wextra -O2` and runs the result against whatever is in the stdin tab, streaming output live as it is produced.
- **Real submissions.** Uploads to APTAT, waits for the judge, and reports the score plus the deducting reason when it is below 100.
- **AI tutor.** Streams a reply with the current problem, your current code and your chat history in context. It is instructed to quote the problem's output requirement before writing any code, hand you a hierarchical feature breakdown first, and then build one block at a time — and to write long-lived teaching preferences you state into a profile that persists across problems.
- **Your credentials stay in the OS credential store.** Never in source, cache, or a model prompt.

## Install

Requires DeepSeek Harness **0.2.x**, and a C compiler on `PATH` (`gcc`; on Windows the plugin also probes the usual MSYS2, MinGW, Chocolatey and Scoop locations).

**Desktop app:** open **Plugins**, choose **Add plugin**, and give it the repository URL:

```
https://github.com/Kostyastudy/dsh-matu-tutor
```

**Command line:**

```sh
dsh plugin --profile <your-profile> add github:Kostyastudy/dsh-matu-tutor
```

Then open the **码图 C 助教 / MATU C tutor** entry in the sidebar and log in with your APTAT account.

There is no build step and no dependency to install — the plugin ships as plain ES modules plus one browser module.

## Windows without a compiler

The local compile/run features need `gcc`. If you have MSYS2:

```powershell
winget install MSYS2.MSYS2
C:\msys64\usr\bin\bash -lc "pacman -S --needed mingw-w64-x86_64-gcc"
```

The plugin looks in `C:\msys64\mingw64\bin`, `ucrt64`, `clang64`, `C:\mingw64`, `C:\MinGW`, the Chocolatey MinGW path and Scoop's `gcc/current` before falling back to whatever `gcc` resolves to on `PATH`.

Everything except compile/run works without a compiler.

## Where your data goes

By default, into `~/.dsh-matu-tutor` (`%USERPROFILE%\.dsh-matu-tutor` on Windows):

```
~/.dsh-matu-tutor/
├─ cache.json           synced assignments and problems
├─ tutor-profile.json   teaching preferences the tutor remembers
├─ tutor-model.json     the model you picked for the tutor, if you changed it
├─ projects/task-<id>/  solution.c / harness.c / input.txt / meta.json
└─ chats/task-<id>.json your tutoring conversations
```

You can move it with the `dataDir` config field or the `DSH_MATU_TUTOR_DATA` environment variable.

## Things to know before you use it

- **Submissions are real.** Each one consumes one of the submission attempts your course allows. Test locally first.
- **The AI tutor bills model calls.** It uses the model your Harness is currently set to, unless you pick a different one for the tutor in the panel.
- **APTAT is a campus-hosted service.** `matu.uestc.edu.cn` is not reliably reachable from every network. If login times out, open `http://matu.uestc.edu.cn` in a browser first — if that also fails, the server or the route to it is the problem, not the plugin.
- **It reads the site's HTML, not an API.** There is no public API, so the plugin scrapes the JSP pages. If the site changes its markup, sync or submission can break until the parsers are updated.
- **One account per Harness profile.** The saved credential is a single APTAT login.
- **The plugin's HTTP routes are guarded like DSH's own.** They go through `ctx.connection.requestRejection`, so a page from another origin cannot reach them, and the plugin token is only handed to the DSH page itself.

## How it is built

| Part | Files | Notes |
| --- | --- | --- |
| Host half | `index.js`, `aptat.js`, `html.js` | Serves `/aptat-api/*` over `ctx.webServer`; uses `ctx.credentials`, `ctx.subprocess`, `ctx.llm`, `ctx.agentDefaultModel` |
| Client half | `client.js` | Registers an `aptat` entry in `sidebar.panellist` and an `aptat` panel in `main` via `ctx.slots` |
| Bundle | `cordis.patch.yml` | Inserts one row, `matu-tutor` |

There are no npm dependencies: the HTML parser in `html.js` is a small local implementation, because the target site is old server-rendered JSP with nested tables.

## License

MIT. Not affiliated with or endorsed by UESTC or the APTAT team.
