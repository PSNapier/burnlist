<div align="center">

# Burnlist

A small local-first priority list: drag tasks between your **top** focus slots and the **rest** backlog, color tags, tri-state checkboxes, and weighted progress all persisted to `burnlist.json` through a tiny Node server.

</div>

## Requirements

- [Node.js](https://nodejs.org/) (uses built-in `http` / `fs`; no npm dependencies)

## Run

From this folder:

```powershell
node server.js
```

Then open [http://localhost:3474](http://localhost:3474). On Windows you can use `start.bat` to launch the browser and the server together.

The server listens only on `127.0.0.1`. There is no authentication; keep it on your machine.

## Data

Tasks live in `burnlist.json` (gitignored by default). Shape:

```json
{
	"top": [{ "text": "string", "state": "unchecked", "highlight": "pink" }],
	"rest": [{ "text": "string", "state": "partial", "highlight": "green" }]
}
```

Checkbox `state` values are:

- `unchecked`
- `partial` (shown with `/`, counts as `0.5` in progress)
- `checked` (shown with `X`, counts as `1` in progress)

Progress is computed as `sum(item state weights) / total items`, so partial tasks contribute half credit.

Backward compatibility: older saved entries with `done: true/false` are still loaded and mapped to `checked`/`unchecked`.

The UI saves changes to the server via `POST /data`. Editing `BURNLIST.html` triggers a live reload for connected tabs via Server-Sent Events (`/sse`).

## Files

| File            | Role                                     |
| --------------- | ---------------------------------------- |
| `server.js`     | HTTP server, JSON read/write, SSE reload |
| `BURNLIST.html` | Single-page client UI                    |
| `start.bat`     | Open browser + start Node (Windows)      |
