Onboard Organization UI Spec (Updated Draft)

Component
- Build in `onboard-org-ui`.
- Add `orgTypeCode` as a component input.
- `orgTypeCode` is required for request context but hidden from the UI.

Goal
- Create a guided onboarding flow for organizations using a multi-panel accordion.
- User provides a source URL and optional notes.
- App calls setup service, pre-populates organization data, allows review/edits, then creates organization (and optional invite).

Accordion behavior
- Only one accordion panel is open at a time.
- On page load, panel 1 is open.
- On successful actions, close current panel and open the next panel.
- Match student dashboard accordion behavior: single-open progressive flow.

Panels

Panel 1: Source Input
- Fields:
  - URL (required, must be a valid URL)
  - Notes (optional, free text / can be empty)
- Action:
  - Call setup method (component-level name can be `onboardOrganizationSetup()`)
- Expected service wiring:
  - `OnboardOrganizationUIHelper = hcclService.onboardOrgSetup(...)`
- Success behavior:
  - Collapse panel 1, expand panel 2
- Error behavior:
  - Keep panel 1 open and display validation/server errors

Panel 2: Organization Basics
- Prefilled from onboarding response.
- Editable fields:
  - Organization name
  - Address fields
- Hidden (not user-editable):
  - Geolocation
  - `orgTypeCode`

Panel 3: Images + Mission Statement
- Show returned mission statement and images.
- Allow user review/edits/corrections for this combined content section.

Panel 4: Optional Invite Email
- Collect an optional user email.
- If provided, use it to create an invite as part of final submit flow.
- Include primary "Go" action here to execute final create flow.
- Final submit service call:
  - `OnboardOrganizationResponse = hcclService.onboardOrg(...)`
  - This call creates both:
    - `hcclOrganization`
    - `hcclUserInvite`

Data and service notes
- Setup call:
  - Service method: `hcclService.onboardOrgSetup(body: OnboardOrganizationPOJO): Observable<OnboardOrganizationUIHelper>`
- Final create call:
  - Service method: `hcclService.onboardOrg(body: OnboardOrganizationPOSTData): Observable<OnboardOrganizationResponse>`
  - `OnboardOrganizationResponse` includes created `organization` and `invite`.
- Naming note:
  - In the component, use readable local method names if desired (for example `onboardOrganizationSetup()`), but map to generated service methods above.

Validation rules
- URL: required and valid URL format.
- Notes: optional and unrestricted text.
- Invite email (panel 4): optional; if present, validate email format.

Implementation checklist
- Create standalone component `app-onboard-org-ui` in `src/app/components/_crud/onboard-org-ui/`.
- Add input: `@Input() orgTypeCode: string` (hidden in UI, required in payload).
- Implement single-open accordion state:
  - Default open panel: panel 1
  - Progression: panel1 -> panel2 -> panel3 -> panel4
- Implement panel 1 setup call:
  - Validate URL format before request
  - Build `OnboardOrganizationPOJO` using URL, notes, orgTypeCode
  - Call `hcclService.onboardOrgSetup(...)`
  - Store `OnboardOrganizationUIHelper` response
- Initialize editable working model from helper:
  - Working model type: `OnboardOrganizationPOSTData`
  - Keep hidden geolocation values in model but do not render controls
- Implement panel 2 editable fields:
  - `providerOrganization.name`
  - `providerOrganization.primaryAddress.*` address fields
- Implement panel 3 editable fields:
  - `providerOrganization.mdMissionStatement`
  - `companyLogo.imageUrl`, `companyLogo.alt`
  - `companyMissionStatementImage.imageUrl`, `companyMissionStatementImage.alt`
- Implement panel 4 fields and submit:
  - Optional `inviteUserEmail`
  - Validate email format only if present
  - Call `hcclService.onboardOrg(...)`
  - Display resulting `organization` and `invite` details
- Add loading/error states for setup and final submit.
- Wire component into business creation screen and pass `orgTypeCode="BUSINESS"`.

Payload mapping (`OnboardOrganizationPOSTData`)
- `orgTypeCode`
  - Source: component input `orgTypeCode`
  - UI: hidden
- `providerOrganization.name`
  - Source: panel 2 org name field
- `providerOrganization.primaryAddress.addrLine1|addrLine2|city|stateCode|zip|countryCode`
  - Source: panel 2 address fields
- `providerOrganization.primaryAddress.geolocationLatitude|geolocationLongitude`
  - Source: setup response (preserved, hidden)
- `providerOrganization.mdMissionStatement`
  - Source: panel 3 mission statement field
- `companyLogo.imageUrl|alt`
  - Source: panel 3 logo inputs
- `companyMissionStatementImage.imageUrl|alt`
  - Source: panel 3 mission image inputs
- `inviteUserEmail`
  - Source: panel 4 optional email input