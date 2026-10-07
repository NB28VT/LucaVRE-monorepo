# Application Blueprint: Racing Simulation Game Car Setup Tuner

## Problem Statement
- **Overview**: This application, "Luca Virtual Race Engineer" (Luca VRE for short) is a GT3 car setup assistant for players of the PC racing simulation game Le Mans Ultimate. This repository is the API backend built in Ruby on Rails.

- **The problem**: setting up a GT3 race car in the game is mechanically complex. Players can often feel what the car is doing wrong (e.g. oversteering on low-speed corner exit) but do not know what *mechanical settings to change* (e.g. ride height, spring rate, anti-roll bars) to fix it.
- **The solution**: the user inputs the car they are driving and the track they are driving on, and a list of car handling deficits. The app interfaces with the Anthropic Claude LLM, which acts as a virtual race engineer and recommends in-game setup changes the user can make based on the car, track and handling deficits it was provided.

## User Stories
As a user driving the Ferrari 296 LMGT3 on the Spa-Francorchamps circuit
I need to ask Claude what setup changes to make to my car
So that I can prevent the car from oversteering on exit in low-speed corners

As a user driving the Ford Mustang LMGT3 on the Monza circuit
I need to ask Claude what setup changes to make to my car
So that I can prevent the car from understeering mid-corner in high-speed corners

## Technology Stack
- **API Framework**: the API is built in Ruby on Rails
- **LLM Integration**: the app interfaces with Anthropic Claude via the Anthropic Ruby SDK, using the `anthropic` gem
- **Automated Testing Framework**: RSpec Rails
- **Automated Testing Data Generation**: FactoryBot
- **Database Engine**: PostgreSQL
- **Front End Framework**: the front end is stored in a separate repo from this one and is built in React.js with TypeScript and TanStack Query for calls to this API.

## Product Constraints
- **Car and Track Selection**: A user can only select tracks availabile in Le Mans Ultimate, and can only select from the GT3 cars in the game.
- **Setup Changes**: The Anthropic LLM can only recommend setup changes that are available in Le Mans Ultimate.

## Domain Vocabulary and Data Models
- **Car** (ActiveFile::Base data source): the metadata for the selected car, (e.g. Porsche 911 LMGT3 R (992)), stored in JSON metadata in db/data/cars.json.
- **Track** (ActiveFile::Base data source): the metadata for the selected track, (e.g. Monza), stored in JSON metadata in db/data/tracks.json.
- **Working Session** (ActiveRecord model): a single combination of a track and car a user is working on.
- **Handling Deficit** (ActiveRecord model): the location on track (high-speed, medium-speed or low-speed corners), the phase of the corner (entry, mid-corner, exit) and the car behavior (understeer or oversteer) they are trying to address when making setup changes to the car. A Working Session can have one or more handling deficits
- **Diagnostic Log** (ActiveRecord model): one Anthropic SDK submission from `DiagnosticService`. Stores the structured setup recommendations and summarized thought process, associated to the working session and the car, track, and handling deficits submitted with that call. A Working Session can have a history of diagnostic logs.

## API Endpoints
- **API Versioning**: All API endpoints are versioned under api/X, where X is the version. (v1 is the initial version)
- **API Formatting**: All API endpoints send and receive data in JSON.
- **API Constraints**: POST routes must only accept a car, track and list of handling deficits. A user cannot create any additional data.

## Backend Architecture
- **Serializers**: metadata for cars, tracks and handling deficits is serialized to XML in `app/serializers/prompt_serializers/*`
- **Dictionaries**: Luca VRE uses prompt compression to minimize token usage for non-static data. The key-value mappings that drive compression and the translation instructions for the Anthropic SDK are defined in `app/dictionaries`
- **Prompts**: XML prompt structures are defined in `app/views/*`, as any data views would be in a Ruby on Rails application.

