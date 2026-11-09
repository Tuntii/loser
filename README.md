# loser

loser is a desktop project tracker for your own projects: three panes (projects, tasks, the selected task), plain Markdown files you can edit by hand and keep in git, read-only GitHub sync, and an MCP server so Claude can read and update your tasks. It is built with [kilim](https://github.com/Tuntii/kilim), a GUI library, in the [iyi](https://github.com/iyilang/iyi) language.

## Install (Windows)

Download `loser.exe` from the [latest release](https://github.com/Tuntii/loser/releases/latest) and put it in a folder on your `PATH`. Double-click it, or run `loser` in a terminal, to open the window.

## Use it from Claude

```
claude mcp add loser -- loser mcp
```

`loser mcp` speaks MCP over stdio. It reads and writes the same files as the window, so the window does not need to be open; if it is, it picks up the changes within two seconds. Tools: `list_projects`, `list_tasks`, `get_task`, `create_task`, `update_task`, `sync`.

## Where your data lives

Everything is plain files in one folder: `%USERPROFILE%\loser` on Windows, `~/loser` elsewhere. Set `LOSER_HOME` to use another folder.

`projects.toml` lists the projects:

```toml
[[project]]
key = "kilim"          # short id, used in task ids and folder names
name = "kilim"
repo = "Tuntii/kilim"  # optional GitHub link
```

One file per task, `<folder>/<project key>/<task id>.md`, with YAML front matter and the notes as plain Markdown:

```markdown
---
id: kilim-12            # GitHub: <key>-<number>; local: <key>-<yyyymmddhhmmss><3 random letters>
title: Quick start on its own page
status: doing           # todo | doing | done
labels: [docs]
github: Tuntii/kilim#12 # absent for local tasks
github_kind: pr         # issue | pr
github_state: open      # as last seen on GitHub
updated: 2026-11-06T10:00:00Z
hidden: false           # a deleted GitHub task stays hidden instead of coming back
---
Notes, as plain Markdown text.
```

Writes are atomic, and the window reloads files that change outside it (a `git pull`, an editor, `loser mcp`). If you and another writer change the same task's notes at once, your text is kept and the other version is saved next to it as `<task id>.conflict-<time>.md`.

## GitHub sync

Link a project to a repo (New project, or `repo` in `projects.toml`) and loser pulls its open issues and pull requests into To do. It needs the [GitHub CLI](https://cli.github.com/) logged in with `gh auth login`; loser only runs `gh` and never stores a token.

Sync is read-only: GitHub owns the title and labels of its tasks, closing or merging moves a task to Done, and your notes and Doing status are never overwritten. It runs every 5 minutes, with the Sync button, with `loser sync`, and through the MCP `sync` tool.

## Keyboard

| Key | Does |
| --- | --- |
| Ctrl+N | New task |
| Ctrl+F | Search |
| Delete | Delete the selected task (asks first) |
| Tab | Move between the panes and buttons |

## Build from source

```
iyi build --release main.iyi -o loser.exe
```

Needs iyi 0.20.0. On Windows, run it from an MSVC developer prompt. On Linux and macOS loser uses kilim's SDL backend, so SDL3 and SDL3_ttf must be installed, as for kilim.

`iyi test` runs the unit tests. The GUI self-test drives the real window and writes a screenshot:

```
LOSER_SELFTEST=loser.bmp iyi run main.iyi
```

It works in a temporary folder, never in your real one.

## Contributing

Commits follow [Conventional Commits](https://www.conventionalcommits.org/). Releases are cut by running the `ci` workflow by hand on `main` (Actions, Run workflow): semantic-release picks the version from the commits and publishes `loser.exe`. The first release starts from the `v0.0.0` tag, so the first `feat` release is 0.1.0.

Licence: Apache-2.0.
