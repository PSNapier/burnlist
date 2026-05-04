<div align="center">

# Burnlist

A small local-first priority list: drag tasks between your **top** focus slots and the **rest** backlog, color tags, and progress—all persisted to `burnlist.json` through a tiny Node server.

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
  "top": [{ "text": "string", "done": false, "highlight": "pink" }],
  "rest": [{ "text": "string", "done": false, "highlight": "green" }]
}
```

The UI saves changes to the server via `POST /data`. Editing `BURNLIST.html` triggers a live reload for connected tabs via Server-Sent Events (`/sse`).

## Files

| File | Role |
|------|------|
| `server.js` | HTTP server, JSON read/write, SSE reload |
| `BURNLIST.html` | Single-page client UI |
| `start.bat` | Open browser + start Node (Windows) |
