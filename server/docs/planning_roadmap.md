# Planning Roadmap

Running list of features to design or build later. Entries are short: the problem, why it is deferred, and a link to a `docs/features/` specification when one exists.

When an item ships, remove it from this list.

## Diagnostic response cache

- **Problem**: `DiagnosticService` would otherwise call Anthropic again for the same working-session car, track, and handling-deficit set. Session history of distinct submissions should remain; duplicates should reuse the existing `DiagnosticLog`.
- **Deferred**: Not part of the logging layer. Logging persists every SDK submission; reuse is a later cost and product concern.
- **Spec**: [docs/features/diagnostic_response_cache.md](features/diagnostic_response_cache.md)
