# Anthropic SDK Service Architecture

## Overview
- **Purpose**: Describes the desired separation of concerns for generating input for and handling output from the Anthropic SDK.
- **Intent**: Provides guardrails for development of services related to this task.

### Architectural Components Description

#### Anthropic SDK Client
- **Purpose**: Defines how the app interacts directly with a Anthropic::Client.new client as defined in https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/ruby
- **Configuration**: Defines the main arguments to the messages method on `Anthropic::Client`, including model, max tokens and effort.
- **Communication**: Passes pre-assembled instructions to the `system_rules` argument, and pre-assembled messages to the `messages` array.
- **Constraints**: This client should not contain any logic relating to defining the content of the `system_rules` argument or `messages` array.

#### System Rules Assembler
- **Purpose**: Generates the XML for the `system_rules` argument to an `Anthropic::Client`.

#### Diagnostic Service
- **Purpose**: Orchestrates the call to the Anthropic SDK by combining the Anthropic SDK Client, assembled system rules from the System Rules Assembler, and generating umessages for `car_data`, `track_data` and `handling_deficits` for a specific user `working_session`.

### Currently Out of Scope
- **Response Schema**: At this time we are not yet using the `output_config` parameter for the SDK to define the model's response schema.
- **Logging**: At this time we are not yet implementing a logging infrastructure to handle responses from the Anthropic SDK. For the time being, output these responses with a puts statement.





