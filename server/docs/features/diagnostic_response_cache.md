# Diagnostic Response Cache

## Overview
- **Purpose**: Avoid calling the Anthropic SDK twice for the same working-session car, track, and handling-deficit combination.
- **Intent**: A working session keeps a history of distinct `DiagnosticService` submissions. Duplicate submissions reuse the existing `DiagnosticLog` instead of creating another SDK call and log row.
- **Status**: Specification only. Not implemented. Do not add cache code, a fingerprint column, a unique index, a skip-SDK branch, or RSpec until this work is scheduled.

### Cache key
- **Scope**: Per working session.
- **Inputs**: `car_id`, `track_id`, and the handling-deficit **attribute set** (`location`, `phase`, `symptom`), order-independent.
- **Fingerprint**: Hash those attribute tuples, not HABTM handling-deficit IDs. In-place edits to a deficit row must miss cache even when the record id is unchanged.

### Hit
When `DiagnosticService` is called and an existing `DiagnosticLog` on that working session already has the same `car_id`, `track_id`, and handling-deficit attribute set:
- Do not call `AnthropicSdkService#generate_response`.
- Do not create another `DiagnosticLog`.
- Return the previous recommendations (and thought process) from that log.

### Miss
Call the SDK and persist a new `DiagnosticLog` when any of the following change relative to existing logs on the session:
- `car_id`
- `track_id`
- The deficit set: add, remove, or change `location`, `phase`, or `symptom`

### Approaches when implementing
Choose at implementation time. Do not build these now.

1. **Per-session lookup on `DiagnosticLog` (first implementation).** Canonicalize a `request_fingerprint` from `car_id`, `track_id`, and sorted deficit tuples. Find a log on this session with that fingerprint. Hit: return the prior payload. Miss: call the SDK and persist. Add a unique index on `[working_session_id, request_fingerprint]`.
2. **Global fingerprint reuse (later cost optimization).** The same car, track, and deficit set across sessions could reuse recommendations. Only worth it if duplicate combinations across sessions are common. Keep per-session history if that still matters.
3. **Postgres as source of truth.** Lookup must be expressible as a `DiagnosticLog` query. Do not use Redis or `Rails.cache` as the audit trail. An optional TTL cache in front is fine.

### Out of scope until this work is scheduled
- `request_fingerprint` column and unique index
- Skip-SDK branch in `DiagnosticService`
- Datadog or other log shipping
- Any RSpec (including pending, skipped, or `xit` examples)
