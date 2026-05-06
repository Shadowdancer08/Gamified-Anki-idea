# Zetamed

A Zetamac-inspired "medic vs medic" quiz app for medical students.

## Run it

```bash
node server.js
```

Open `http://localhost:3000`, create a room, then share the room URL with another student.

## Deploy it

This app is ready for any Node web host. Use:

```bash
node server.js
```

For Render, connect a GitHub repo containing this folder. Render can read `render.yaml`, or you can create a Web Service manually with:

- Build command: leave empty
- Start command: `node server.js`
- Runtime: Node

The app reads `process.env.PORT`, so hosts can assign the public port automatically.

## What works

- Create a quiz room.
- Join by room link.
- Play a local two-student duel on one screen.
- Two-player live room state with Server-Sent Events.
- Medical multiple-choice questions.
- Scores, answer reveal, explanations, and next-question flow.

## Notes

Rooms are stored in memory, so restarting the server clears them. This is intentional for the first bare-bones prototype.
