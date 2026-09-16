# AI Prompt Formatting

## Overview
- **Purpose**: The purpose of this document is to describe how metadata on a user's handling deficits, car and track selection are submitted to the Anthropic SDK
- **Intent**: Information passed to the SDK should be logically structured, efficiently presented to minimize noise and compressed to save tokens

### Structure
- **Format**: all system prompt and working session metadata will be submitted with structured XML tags to match guidance from Anthropic
- **Compression**: working session metadata for car, track and handling deficits must be submitted in a compressed format. System prompt rules should define a "dictionary" of metadata and corresponding values so the SDK knows how to interpret them. For example, a handling deficit with a location of "high_speed", a phase of "entry" and a symptom of "understeer" should transate to `loc:hi_spd;phase:entry;sym:us` within a handling_deficit tag. Compressed metadata mappings are defined in `app/dictionaries/*`
- **Caching**: Because system rules are generally static, they should always be cached by Claude. Additionally, car and track metadata should be cached ephemerally as there is some likelhood of multiple requests being made with the same car or track within the caching window

### Components

#### System Rules
- **Purpose**: System rules describe the purpose of the application, the role the Anthropic SDK will play as a "virtual race engineer", car engineering physics as they are modeled in Le Mans Ultimate, and the dictionary described above for how metadata is compressed for car, track and handling deficits. It is definied in `app/views/prompts/v1/system_rules.xml.erb`. You are not to edit this document in any way
- **Dynamic Content**: Compressed metadata mappings are rendered within the system rules via partials that generate the mappings dynamically using the values assigned in `app/dictionaries/*`. These dictionaries are also used in processing the prompt compression itself when generating car, track and handling_deficit metadata to send the SDK, so the dictionary acts as a single point of truth that guides both the compression and how the Anthropic SDK is taught how to translate it

#### Car Metadata
- **Purpose**: To describe the relevant characteristics of the chosen car as it pertains to car setup. It should follow the guidelines set in docs/features/ai_prompt_scope.md

#### Track Metadata
- **Purpose**: To describe the relevant characteristics of the chosen track as it pertains to car setup. It should follow the guidelines set in docs/features/ai_prompt_scope.md

#### Handling Deficit Metadata
- **Purpose**: To describe the relevant characteristics of a user's reported handling deficits, including: location on track (global or low, medium or high speed corners), phase of the corners (entry, mid-corner or exit) and observed behavior (understeer or oversteer)



