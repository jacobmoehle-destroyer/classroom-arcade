# Stardew Valley browser-port self-hosting assessment

This document records what must be checked before moving the community browser-port experiment to a host approved for a classroom demonstration.

## Current situation

- The Classroom Arcade page embeds the author's demo at `https://degloved.net/games/public/gms/stardew-valley/index.html`.
- The iPad's Securly block page reports `degloved.net` as **Blocked by Category**. This is a network policy decision, not proof of an iPad compatibility bug.
- The original project is [degloved-net/stardew-wasm](https://github.com/degloved-net/stardew-wasm). Its README asks sites to give credit and says the author may re-port it and make it open source in the future.
- The repository includes an MIT license for the repository software. Verify that permission explicitly covers every asset and game-data archive before mirroring or publishing them.

## Files and size considerations

The upstream project contains:
- `index.html` and `game.js`
- a `_framework/` directory with .NET runtime and WebAssembly assets
- `Content.tar00` through `Content.tar03` and `Content.tar.count` for the game content
- `ContentAudio.tar00` through `ContentAudio.tar24` and `ContentAudio.tar.count` for optional audio content

The upstream repository reports a size of roughly 864,000 KB. The game page advertises about 64 MB for the no-music option and about 540 MB with music. These are large static assets, so confirm host quotas, bandwidth, deployment time, MIME types, and caching before choosing a host.

GitHub Pages currently documents a recommended 1 GB source-repository limit and a 1 GB published-site limit. See [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). A project this large is close enough to the quota that the final deployed output must be measured, not guessed.

## Approved deployment checklist

1. Get written confirmation that the full browser port and all bundled assets may be redistributed from the proposed host.
2. Have the network/filter administrator approve the destination host and purpose for the classroom test. Do not assume a new host is automatically permitted by the school filter.
3. Choose a host whose documented size and bandwidth limits can support the measured output.
4. Keep the original author's attribution and license notices.
5. Publish all runtime files and data archives at stable relative paths; this port's loader fetches chunked archives and imports its .NET runtime.
6. Test from a clean browser profile on the target iPad, including first-load downloads, reload/cache behavior, touch controls, audio choice, and failure messages.
7. Review access logs and classroom privacy expectations before sharing the deployment with students.

## Important

This is an assessment/checklist, not a deployed mirror. The current Classroom Arcade integration remains an embed of the original host. A self-hosted deployment should only be switched on after both content redistribution and the classroom network destination are approved.
