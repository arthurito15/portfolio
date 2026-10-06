# Background audio

The cinematic entry gate on the home page plays a looping ambient track.

## To enable it

Drop a **royalty-free, loop-friendly** track here named exactly:

```
assets/audio/ambient.mp3
```

That's it — no code changes needed. The `<audio>` element in `index.html`
already points at this path, and `script.js` starts it (looping, volume 0.35)
when a visitor clicks **"Begin experience"** on the entry gate.

## Notes

- **Format:** `.mp3` is referenced. To use another format, update the
  `<source>` in `index.html` (e.g. add an `.ogg` fallback).
- **Licensing:** use a track you have the rights to (CC0 / royalty-free).
  Good sources: Pixabay Music, Free Music Archive (CC0), Uppbeat.
- **Length / size:** a 1–3 min seamless loop, ideally < ~3 MB, keeps load light.
- **Graceful by design:** if this file is missing, nothing breaks — the gate
  still works as a cinematic intro and the audio toggle simply produces no sound.
- The choice (sound on/off) is remembered in `localStorage`; the gate shows once
  per browser session (`sessionStorage`) and is skipped under
  `prefers-reduced-motion`.
