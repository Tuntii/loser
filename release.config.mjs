// semantic-release: run by the release job in .github/workflows/ci.yml on main.
// Commits follow Conventional Commits. Releases are cut by hand (Run workflow on
// CI, branch main): feat and breaking changes make the minor release (pre-1.0),
// fix and perf alone a patch; other types make none.

// `#` starts an issue reference only before a digit. A RegExp, because the parser
// escapes string prefixes.
const parserOpts = { issuePrefixes: [/#(?=\d)/] };

export default {
  branches: ["main"],
  tagFormat: "v${version}",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        parserOpts,
        // Matching rules win over the preset's defaults (feat: minor); breaking is held to minor before 1.0.
        releaseRules: [
          { breaking: true, release: "minor" },
        ],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        parserOpts,
        presetConfig: {
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "perf", section: "Performance" },
            { type: "docs", hidden: true },
            { type: "ci", hidden: true },
            { type: "chore", hidden: true },
            { type: "refactor", hidden: true },
            { type: "test", hidden: true },
          ],
        },
      },
    ],
    [
      "@semantic-release/github",
      { assets: [{ path: "loser.exe", label: "loser.exe (Windows)" }] },
    ],
  ],
};
