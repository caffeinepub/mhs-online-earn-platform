# Specification

## Summary
**Goal:** Fix the /admin-panel route to resolve the black screen issue in production and ensure admin login functionality works correctly.

**Planned changes:**
- Fix the /admin-panel route configuration to load properly on the production domain
- Verify admin login form is visible and functional at /admin-panel
- Ensure successful authentication with credentials 'admin' and 'habibur123' redirects to the admin dashboard
- Confirm the route works without requiring Internet Identity authentication

**User-visible outcome:** The admin can successfully access /admin-panel at https://mhs-online-earn-platform.caffeine.xyz, see the login form, authenticate with the provided credentials, and access the admin dashboard with user and task management interfaces.
