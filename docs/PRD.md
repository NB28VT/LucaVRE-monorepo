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
