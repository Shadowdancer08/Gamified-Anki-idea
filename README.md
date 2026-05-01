# ZetaMed

Bare-bones, fast multiplayer medical quiz app for med students.

## Stack Recommendation
- **Frontend:** Vite + React + TypeScript (fast dev loop, low complexity).
- **State + game rules:** plain TypeScript modules (no heavy state libs yet).
- **Realtime (Phase 3+):** **Supabase Realtime** (simple hosted Postgres + subscriptions, good for room/game sync without self-hosting sockets).

## Architecture Plan (Serious + Staged)

### Core modules (shared by local + online)
- `src/core/types.ts`: canonical domain types (Question, Player, GameSettings, RoomState, etc).
- `src/core/gameEngine.ts`: pure game logic (turns, scoring, winner checks, question selection, rematch resets).
- `src/data/questions.ts`: local hard-coded bank for now; later replace with DB/JSON loader.

### UI modules
- `src/App.tsx`: route-level screen state (`home`, `setup`, `quiz`, later `room-host`, `room-join`).
- Future component folders for scoreboard, question card, room lobby, QR panel.

### Online modules (Phase 3+)
- `src/online/roomClient.ts`: create/join room APIs.
- `src/online/realtimeSync.ts`: subscribe/publish room state updates.
- `src/online/mappers.ts`: serialize/deserialize room/game state from backend.

## Build Phases
1. **Phase 1 (now):** local playable core.
2. **Phase 2:** richer local setup (filters, target score, randomization, no repeats, keyboard shortcuts, final rankings).
3. **Phase 3:** room architecture + backend integration.
4. **Phase 4:** synced multi-device gameplay.
5. **Phase 5:** QR join links.
6. **Phase 6:** scalable question-bank model.
