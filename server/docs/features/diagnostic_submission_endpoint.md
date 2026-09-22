# Diagnostic Submission Endpoint

## Overview
- **Purpose**: Describes the endpoint that acts as a gateway between a user submitting a request for setup recommendations for a given WorkingSession, and the DiagnosticService we built to query the Antropic SDK for those recommendations.
- **Intent**: Lays the groundwork and guardrails for implementing this endpoint.

### Specification
- **Single Endpoint**: There should be a single POST endpoint that takes a working session ID, looks up the working session and passes the required information to the Diagnostic Service. It should return the setup recomendations only (do not return the thought process we are persisting in the DiagnosticLog).
- **Versioning**: The endpoint should respect the existing versioning convention we've established (i.e. the first version should be routed in the v1 namespace). Write a rule to always implement new endpoints this way.
- **User Authentication**: We have yet to create a user authentication layer or user model, for now ignore this. Any working session should be valid.


### Guardrails
- **Testing**: Again, ensure no tests involve actual SDK calls, mock this as you have before and ensure your rules reflect this.
- **Timeouts**: the endpoint should handle a reasonable timeout from the Claude SDK server in a graceful way the front end can handle.
- **Duplicate Requests**: the endpoint should never execute a call to the DiagnositcService for the exact same arguments that have already been made, it should return the existing response from the SDK for those set of parameters. Propose a plan for caching these, perhaps using built in Ruby on Rails middleware. You can use https://guides.rubyonrails.org/caching_with_rails.html for reference.