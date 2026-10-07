# AI Output Schema

## Overview
- **Purpose**: Defines how we want to use available features of the Anthropic SDK to generate useful response metadata from its model for use in our applciation
- **Intent**: Provide enough context about our goals to allow you to decide which features of the SDK we should use to accomplish those goals

### Goals
- **Strict Schema**: We will never allow the Anthropic SDK to return free text in it prompt answer. It will only be allowed to return recommended setup changes on a set list of Le Mans Ultimate car setup options for GT3 cars, and only in the units of adjustment the user has available to change in the game. These are defined in docs/features/ai_prompt_return_scope.md.
- **Thought Process**: The SDK should return a lightweight summary from the model on how it came up with the setup changes it suggested. `DiagnosticService` persists that summarized thinking on `DiagnosticLog` along with the structured recommendations. Thought process is not a JSON schema field.
- **Recommendation Limits**: The model should only be asked to return five setup changes maximum. Anthropic structured outputs cannot enforce that cap: `maxItems` and `maxProperties` are unsupported and 400 if sent. The only array size the grammar enforces is `minItems` of `0` or `1`. Ask for the limit in the schema `description` instead.



