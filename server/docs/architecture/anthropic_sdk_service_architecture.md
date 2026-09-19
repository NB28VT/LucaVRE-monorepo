# Anthropic SDK Service Architecture

## Overview
- **Purpose**: Describes the desired separation of concerns for generating input for and handling output from the Anthropic SDK.
- **Intent**: Provides guardrails for development of services related to this task.

### Architectural Components Description

#### Anthropic SDK Client
- **Purpose**: Defines how the app interacts directly with a Anthropic::Client.new client as defined in https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/ruby
- **Configuration**: Defines the main arguments to the messages method on `Anthropic::Client`, including model, max tokens, effort, and summarized thinking (`thinking: { type: :adaptive, display: :summarized }`).
- **Communication**: Passes pre-assembled instructions to the `system_rules` argument, pre-assembled messages to the `messages` array, and a caller-supplied JSON schema through `output_config.format`.
- **Constraints**: This client should not contain any logic relating to defining the content of the `system_rules` argument, `messages` array, or response schema.

#### System Rules Assembler
- **Purpose**: Generates the XML for the `system_rules` argument to an `Anthropic::Client`.

#### Diagnostic Service
- **Purpose**: Orchestrates the call to the Anthropic SDK by combining the Anthropic SDK Client, assembled system rules from the System Rules Assembler, and generating messages for `car_data`, `track_data` and `handling_deficits` for a specific user `working_session`.
- **Response Schema**: Owns the structured-output JSON schema (`output_config.format`). Each property is one Le Mans Ultimate GT3 garage setting, enumerated in the units and increments the player can set in-game. Properties are optional so omitted settings are unchanged. A five-recommendation cap cannot be grammar-enforced (`maxItems` / `maxProperties` are unsupported); it is requested in the schema description. Thought process is not part of this schema; it is returned as summarized thinking content blocks from the SDK client.

### Currently Out of Scope
- **Logging**: At this time we are not yet implementing a logging infrastructure to handle responses from the Anthropic SDK. Until a logging layer exists, return the SDK response to the caller. Do not print it.
