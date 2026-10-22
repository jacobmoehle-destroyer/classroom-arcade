# iPad touch-support implementation plan

This is an engineering plan for improving the upstream browser port on touchscreens. It is not a working patch; the game input path still needs to be traced and tested in the WebAssembly runtime.

## What the current source confirms

Reviewed upstream files:
- index.html renders the game into a full-window canvas.
- game.js downloads and caches game archives, starts the .NET/WebAssembly runtime, calls WasmBootstrap.Init(w, h), and handles canvas resizing.
- The visible JavaScript handles a few keyboard defaults, but does not define a touch joystick, touch action buttons, or a gamepad-to-game-input bridge.
- The upstream README asks people to give credit and says a more complete open-source re-port may happen in the future.

References:
- [Upstream repository](https://github.com/degloved-net/stardew-wasm)
- [Upstream game.js](https://github.com/degloved-net/stardew-wasm/blob/main/game.js)
- [Upstream index.html](https://github.com/degloved-net/stardew-wasm/blob/main/index.html)

## Recommended implementation path

### 1. Trace the real input layer first

Find the SDL/Emscripten input glue and the game's existing action mapping in the runtime. Determine whether movement and actions arrive through SDL keyboard events, controller events, or another mechanism. Do not add visual controls until there is a confirmed route from a touch event to the same input events the game already consumes.

### 2. Add a touch controller at the runtime boundary

Once the input path is confirmed, implement a small, optional touch overlay in the same origin as the game runtime:
- A virtual left stick or directional pad for movement.
- Separate action/use, tool, menu/back, and confirm buttons only where the game's real bindings support them.
- Pointer Events (pointerdown, pointermove, pointerup, pointercancel) with pointer capture so a finger can slide without losing contact.
- Independent pointer IDs for simultaneous movement and action presses.
- A visible toggle to hide controls and preserve the full canvas.
- Safe-area-aware placement and responsive sizing in both orientations.

Avoid trying to inject touch events from the existing Classroom Arcade iframe wrapper: browser same-origin protections prevent that wrapper from controlling a cross-origin game's internal input.

### 3. Prevent stuck input

Every pointer end/cancel, window blur, page visibility change, and controller disable must release any virtual keys/buttons still held. Do not synthesize a repeating stream of key presses when a held input is supported; prefer explicit press/release events.

### 4. Keep accessibility and existing desktop controls

- Preserve physical keyboard and controller input.
- Use large targets, adequate spacing, visible focus, and labels for assistive technology.
- Do not intercept normal page gestures outside the game canvas.
- Make the touch overlay optional, not mandatory.

## Test checklist

Test on a real iPad in Safari, with the site and game approved for that network:
- [ ] First-load archive download, with and without audio.
- [ ] Movement in all four directions.
- [ ] Movement plus an action at the same time.
- [ ] Diagonal movement and dragging the stick to its edge.
- [ ] Rapid taps, pointer cancellation, switching apps, and returning to the tab.
- [ ] Menu open/close and all key game actions.
- [ ] Portrait and landscape, browser chrome resizing, and safe-area insets.
- [ ] Reload and cached launch.
- [ ] Confirm desktop keyboard/controller behavior is unchanged.

## Deployment and approval notes

This plan does not copy game data or create an alternate host. The upstream project should be patched and tested by its maintainer or in an authorized development fork, and any deployment destination should be approved by the network administrator. The repository's software license should not be assumed to grant redistribution rights for the separate game's data/assets.
