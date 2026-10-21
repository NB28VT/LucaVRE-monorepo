USER CONTEXT AND INTENT
The user is a sim racer analyzing an active track session. They are in the current session view and have entered at least one Handling Characteristic (such as mid-corner oversteeer on high speed corners). They want to hit a "Run Diagnostic" button and get a list of suggested mechancial adjustments tailored specifically to Le Mans Ultimate parameters so they can fix their car setup and get back to driving.

CLIENT BOUNDARIES
- Active page: client/src/pages/CurrentSessionPage.tsx (where the button lives and where the user enters Handling Characteristics)
- Destination page: client/src/pages/ResultsPage.tsx (where the recommended setup changes are shown)
- UI/UX requirements The button must switch to disabled on submit and show a thematically appropriate loading spinner (like a waving green flag, but we can do that after the core functionality is built) while the response is being processed.
- When displaying the setup recommendations, consider using icons (again probably a later feature as well) to represent things like springs or ride height or aero.
- This page is currently mocking data on the client side, but we want to set up the full round trip with the backend api.


API BOUNDARIES
- /api/v1/working_sessions/:working_session_id/diagnostic is the server API destination URL for generating the setup changes
- In development, do NOT hit the live Anthropic SDK with the Diagnositc Service (server/app/services/diagnostic_service.rb) during development or in tests. This must be mocked.
- Write a server-side mock implementation mode for this instead so I don't get billed for API calls during testing.
- Intercept the backend service layer call using an environment check or a clean request stub. Return a static JSON dictionary featuring hardcoded adjustments (e.g., front tire pressures or anti-roll bar values) that fall within strict Le Mans Ultimate tuning boundaries.
- Test Target: Write a standard RSpec request test checking the endpoint return value using this mock contract.