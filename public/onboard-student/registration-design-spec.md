# Registration Design Spec

## Overview

This specification defines the registration flow for the application. The registrant completes the registration form first, submits it, receives an email verification link, verifies the email address, and then logs in through the standard authentication flow.[cite:32][cite:44][cite:45]

The design supports collection of core profile data, Terms & Conditions acceptance, and age-based policy handling. Parent or guardian contact and consent are intentionally deferred until after the user has verified email and logged in, if later required by product policy.[cite:16][cite:17][cite:26][cite:60][cite:66]

## Objectives

- Capture the required registration data in a single initial form submission.[cite:29]
- Require CAPTCHA before registration is accepted and before any verification email is sent.[cite:23][cite:27]
- Create the account immediately after successful form submission in a pending state so profile data and legal acceptance can be stored on the account.[cite:32][cite:45][cite:51]
- Require email verification before the user can access the application.[cite:32][cite:45]
- Collect birth month and birth year during registration so the application can enforce age-based policy after login.[cite:26][cite:50][cite:66][cite:72]
- Record Terms & Conditions acceptance with timestamp and version for auditability.[cite:16][cite:17][cite:51]
- Defer parent or guardian collection and any parental consent flow until after the user logs in, when applicable.[cite:60][cite:66][cite:69]

## Scope

This specification covers UI behavior, backend behavior, API endpoints, data model requirements, validation rules, state transitions, and security requirements for registration and email verification, plus the handoff to post-login age-compliance handling. It also defines the pre-load UI data request used to populate form controls before the registration form is submitted.[cite:26][cite:32][cite:35][cite:66][cite:107]

This specification does not define the full post-login parental consent workflow beyond the requirement that the application may gate access and collect additional information after authentication when age policy requires it.[cite:60][cite:66][cite:69]

## User Flow

### Primary Registration Flow

1. The client invokes `loadOnboardStudentUIData()` as a pre-call GET request before the registration form is rendered or before school selection becomes interactive.[cite:107][cite:113]
2. The pre-call returns a `MenuControlDataList` containing the UI menu data required by the form, including the school options used to populate the School dropdown.[cite:107]
3. The user selects the Register action and is taken to the registration form.[cite:25][cite:29]
4. The user enters email, school, username, first name, last name, birth month, birth year, completes CAPTCHA, and accepts the Terms & Conditions.[cite:16][cite:17][cite:27][cite:29][cite:84]
5. The user submits the registration form.[cite:29]
6. The backend validates the request, creates the user account in a pending state, stores profile data and legal acceptance, generates an email verification token, and sends a verification email.[cite:32][cite:35][cite:45][cite:51]
7. The user opens the verification email and clicks the verification link.[cite:32][cite:44]
8. The system verifies the token, marks the email as verified, updates the account state, and displays a confirmation page.[cite:32][cite:35][cite:45]
9. The user logs in through the standard login flow.[cite:44][cite:45]
10. After login, the application evaluates age-based policy and may route the user into a separate compliance flow before allowing access to restricted content or features.[cite:60][cite:66][cite:69][cite:72]

### Post-Login Age Compliance Flow

1. The system determines whether the user falls into an age-restricted category based on birth month and birth year using server-side rules.[cite:26][cite:50][cite:56][cite:72]
2. If additional compliance is required, the user is redirected after login to a dedicated age-compliance flow rather than continuing directly into the application.[cite:60][cite:66][cite:69]
3. That post-login flow may collect parent or guardian email, additional attestations, or consent-related information depending on legal and product requirements.[cite:26][cite:60][cite:66][cite:69]
4. Until required compliance steps are completed, access to age-restricted features or content remains blocked.[cite:60][cite:66][cite:68][cite:72]

## Functional Requirements

### Pre-Load UI Data

Before the registration form is rendered, the client shall issue a pre-call GET request named `loadOnboardStudentUIData()` to retrieve menu and reference data needed by the UI.[cite:107][cite:113]

The response shall return a `MenuControlDataList`.[cite:107]

The School dropdown shall be populated from the school data contained in the returned `MenuControlDataList`, and the selected dropdown value shall be submitted as `schoolId` in the registration request.[cite:107][cite:109][cite:116]

If `loadOnboardStudentUIData()` fails, the registration form should prevent school selection and show an error in the messages section until the reference data can be loaded successfully.[cite:74][cite:76][cite:107]


### Registration Form Fields

The registration form shall contain the following required fields:[cite:16][cite:17][cite:27][cite:29]

- Email
- School (`schoolId`) selected from a provided dropdown list
- Username (`userName`)
- First name
- Last name
- Birth month
- Birth year
- CAPTCHA response
- Terms & Conditions acceptance checkbox

The registration form shall not collect parent or guardian email.[cite:60][cite:66][cite:69]

The username field shall be collected after the email field in the form layout and shall include a `useEmail` button that populates the username from the entered email using application-defined normalization rules, which reduces redundant typing and aligns with the principle of avoiding unnecessary duplicate input.[cite:29][cite:84][cite:86]

If Privacy Policy acceptance must be stored separately for legal reasons, a separate checkbox may be added. Otherwise, the Terms & Conditions text may explicitly reference the Privacy Policy in the same acceptance statement.[cite:16][cite:17][cite:57]

### Form Behavior

The registration form shall validate all required inputs before submission is accepted.[cite:27][cite:29][cite:35]

The form shall display helper text explaining why birth month and birth year are collected and that additional age-related steps may be required later depending on policy.[cite:26][cite:60][cite:66]

The form shall include a messages section for account creation outcomes and validation or processing feedback. This section shall render the `SimpleMessageList` and support error, warning, and informational messages, while field-specific issues should still be shown inline near the relevant inputs for usability and accessibility.[cite:74][cite:75][cite:76][cite:78][cite:81][cite:83]

The submit button shall remain disabled until required fields are complete, the Terms & Conditions checkbox is checked, and CAPTCHA has been completed successfully on the client side, while the server remains the final authority on validation.[cite:23][cite:27][cite:35]

### Account Creation

On successful registration submission, the backend shall:[cite:16][cite:17][cite:32][cite:45][cite:51]

- Create a user account immediately.
- Set the initial status to `PENDING_EMAIL_VERIFICATION`.
- Store all permitted profile attributes from the submitted form, including `schoolId` and `userName`.
- Store Terms & Conditions acceptance, acceptance timestamp, and Terms version.
- Store birth month and birth year for later age-policy decisions.
- Generate a one-time email verification token.
- Send an email verification message to the registrant.

### Email Verification

The email verification flow shall:[cite:32][cite:35][cite:44][cite:45]

- Accept a single-use, time-limited token.
- Validate that the token exists, is associated with the correct account, is not expired, and has not been used.
- Mark the user email as verified.
- Mark the token as used.
- Update the account state to allow standard login.
- Display a confirmation page instructing the user to log in.
- Not create an authenticated session automatically.

### Post-Login Age Compliance

For users whose age requires additional handling, the application shall:[cite:26][cite:60][cite:66][cite:68][cite:72]

- Evaluate age policy after successful login using stored birth month and birth year.
- Route the user to a dedicated age-compliance experience before permitting access to restricted features or content.
- Allow that separate experience to collect parent or guardian email and any other required information.
- Persist compliance state separately from the base registration record.
- Prevent access to restricted features until required compliance steps are completed.

## State Model

The implementation should use a primary account status plus supporting flags because this is easier to extend than encoding every condition into one status value.[cite:26][cite:45][cite:68]

### Recommended Status Values

- `PENDING_EMAIL_VERIFICATION` — registration complete, account created, email not yet verified.[cite:32][cite:45]
- `ACTIVE` — email verified and account is allowed to authenticate.[cite:32][cite:45]
- `DISABLED` — account is suspended or administratively blocked.[cite:45]

### Recommended Supporting Flags

- `email_verified`
- `requires_age_compliance`
- `age_compliance_completed`[cite:60][cite:66][cite:68][cite:72]

Using an `ACTIVE` account with feature-gating flags is recommended when login should succeed but access to certain experiences must remain blocked pending follow-up compliance.[cite:68][cite:72]

### State and Access Transitions

| Event | Account State | Access Outcome |
|---|---|---|
| Registration submitted successfully | `PENDING_EMAIL_VERIFICATION` | Login denied until email is verified.[cite:32][cite:45] |
| Email verified | `ACTIVE` | User may log in.[cite:32][cite:45] |
| Login by user requiring no additional age handling | `ACTIVE` | Normal access granted.[cite:66][cite:72] |
| Login by user requiring additional age compliance | `ACTIVE` | Redirect to post-login age-compliance flow; restricted features blocked.[cite:60][cite:66][cite:68][cite:72] |
| Age compliance completed | `ACTIVE` | Restricted access enabled.[cite:60][cite:66][cite:72] |
| Administrative suspension | `DISABLED` | Login denied.[cite:45] |

## Data Model

### User Table

Suggested columns for the user record:[cite:16][cite:17][cite:26][cite:45][cite:51][cite:72]

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key. |
| `email` | string | Original submitted email. |
| `email_normalized` | string | Lowercased and normalized email for uniqueness checks.[cite:35][cite:47] |
| `email_verified` | boolean | Whether the email has been verified. |
| `email_verified_at` | timestamp nullable | Timestamp of successful verification. |
| `status` | enum | Current account status. |
| `school_id` | string or UUID | Required; selected from the school options returned in `MenuControlDataList` and stored as a foreign key or lookup reference to the backend school table.[cite:94][cite:95][cite:97] |
| `user_name` | string | Required and unique.[cite:29][cite:84] |
| `first_name` | string | Required. |
| `last_name` | string | Required. |
| `birth_month` | integer | Required; range 1-12.[cite:26][cite:50] |
| `birth_year` | integer | Required; reasonable bounded range.[cite:26][cite:50] |
| `requires_age_compliance` | boolean | Derived from age-policy rules or set at login-time evaluation.[cite:60][cite:66][cite:72] |
| `age_compliance_completed` | boolean | Whether post-login age compliance is complete.[cite:60][cite:66][cite:72] |
| `tos_accepted` | boolean | Must be true on accepted registrations. |
| `tos_accepted_at` | timestamp nullable | Acceptance timestamp. |
| `tos_version` | string | Version of Terms accepted. |
| `created_at` | timestamp | Creation timestamp. |
| `updated_at` | timestamp | Last update timestamp. |

Recommended database constraints:[cite:29][cite:35][cite:47]

- Unique index on `email_normalized`.
- Unique index on `user_name`.
- Validation or check constraint on `birth_month`.
- Validation or service-layer enforcement for accepted birth year range.

### Email Verification Token Table

Suggested columns:[cite:32][cite:35]

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key. |
| `user_id` | UUID | Foreign key to user. |
| `token_hash` | string | Store a hash rather than the raw token when feasible. |
| `token_type` | string | `EMAIL_VERIFICATION`. |
| `expires_at` | timestamp | Expiration timestamp. |
| `used_at` | timestamp nullable | Set once consumed. |
| `created_at` | timestamp | Creation timestamp. |
| `request_ip` | string nullable | Optional audit field.[cite:35] |
| `request_user_agent` | string nullable | Optional audit field.[cite:35] |

### Optional Age Compliance Table

If age-related follow-up becomes a substantial workflow, store it in a dedicated table rather than overloading the user record.[cite:60][cite:66][cite:72]

Suggested columns:

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key. |
| `user_id` | UUID | Foreign key to user. |
| `compliance_state` | string | Workflow state for age handling. |
| `parent_contact_email` | string nullable | Collected later if required by policy.[cite:60][cite:66][cite:69] |
| `attestation_version` | string nullable | Version of age/compliance text accepted. |
| `completed_at` | timestamp nullable | Completion timestamp. |
| `created_at` | timestamp | Creation timestamp. |
| `updated_at` | timestamp | Last update timestamp. |

### Optional Legal Acceptance Audit Table

If stronger legal traceability is required, store acceptance history in a dedicated audit table instead of relying only on the latest fields stored on the user record.[cite:51]

Suggested columns:[cite:51]

- `id`
- `user_id`
- `document_type`
- `document_version`
- `accepted_at`
- `source`
- `ip_address`
- `user_agent`

## API Specification

### GET `loadOnboardStudentUIData()`

This pre-call GET request retrieves UI menu and lookup data needed by the registration form before submission.[cite:107]

#### Response

The response shall return a `MenuControlDataList`.[cite:107]

That `MenuControlDataList` shall include the school data used to populate the School dropdown on the registration form.[cite:107][cite:109][cite:116]

#### Client Behavior

- Call `loadOnboardStudentUIData()` before rendering the School dropdown as selectable.[cite:107]
- Bind the returned school menu entries to the School select control.[cite:107][cite:109]
- Persist only the selected school identifier as `schoolId` in form state and in the POST payload.[cite:94][cite:95][cite:97]
- Display a messages-section error if the pre-load request fails and block submission until the required school menu data is available.[cite:74][cite:76][cite:107]


### POST `/api/registration`

Creates a pending account and sends the email verification message.[cite:32][cite:45]

#### Request Body

```json
{
  "email": "user@example.com",
  "schoolId": "school-123",
  "userName": "ada_l",
  "firstName": "Ada",
  "lastName": "Lovelace",
  "birthMonth": 5,
  "birthYear": 2012,
  "captchaToken": "captcha-response",
  "acceptTos": true,
  "tosVersion": "2026-03-01"
}
```

#### Server Behavior

- Validate request schema and required fields.[cite:27][cite:29][cite:35]
- Validate CAPTCHA server-side.[cite:23][cite:27]
- Normalize email and username as needed for uniqueness and consistency.[cite:35][cite:47][cite:84]
- Reject duplicate email or username conflicts according to product policy.[cite:29][cite:35][cite:82]
- Validate that `schoolId` is one of the allowed school identifiers returned by `loadOnboardStudentUIData()` and resolvable against the backend school lookup table.[cite:94][cite:95][cite:97]
- Persist `schoolId`, `userName`, birth month, and birth year for later processing.[cite:26][cite:29][cite:50][cite:72][cite:84]
- Create the user in `PENDING_EMAIL_VERIFICATION`.[cite:32][cite:45]
- Store Terms acceptance data.[cite:16][cite:17][cite:51]
- Create an email verification token and send the verification email.[cite:32][cite:35][cite:45]

#### Response Body

```json
{
  "success": true,
  "status": "PENDING_EMAIL_VERIFICATION",
  "message": "Check your email to verify your account."
}
```

### GET `/api/registration/verify-email?token=...`

Consumes the email verification token and updates the user state.[cite:32][cite:35][cite:45]

#### Server Behavior

- Validate the token.[cite:32][cite:35]
- Mark `email_verified = true` and set `email_verified_at`.[cite:32][cite:45]
- Mark the token as used.[cite:32][cite:35]
- Set account status to `ACTIVE`.[cite:32][cite:45]
- Redirect to a confirmation page rather than establishing a logged-in session.[cite:44][cite:45]

### POST `/api/registration/resend-verification`

Resends the verification email for unverified accounts, subject to rate limits.[cite:35][cite:49]

#### Request Body

```json
{
  "email": "user@example.com"
}
```

#### Server Behavior

- Return a generic success response whether or not an account exists to reduce account enumeration risk.[cite:35]
- Enforce throttling by email and IP address.[cite:35][cite:49]
- If the account exists and remains unverified, create a new token or resend according to token policy.[cite:35]

### Post-Login Age Compliance Endpoints

The exact post-login age-compliance API may vary, but the system should reserve application endpoints for evaluating compliance state and collecting follow-up information after authentication.[cite:60][cite:66][cite:72]

Possible examples:

- `GET /api/me/age-compliance-status`
- `POST /api/me/age-compliance/start`
- `POST /api/me/age-compliance/submit`
- `POST /api/me/age-compliance/request-parent-contact`[cite:60][cite:66][cite:69]

## Validation Rules

### Client-Side Validation

The client should implement immediate usability validation for better user experience, but all rules must be enforced again on the server.[cite:29][cite:35]

Client-side validation should include:[cite:16][cite:17][cite:26][cite:27][cite:29]

- Required field checks.
- Email format check.
- Username length and allowed character check.
- Birth month bounds check.
- Birth year basic bounds check.
- Terms acceptance checkbox enforcement.
- CAPTCHA completion.

### Server-Side Validation

The server shall be authoritative for all validation decisions.[cite:35]

Server-side validation shall include:[cite:23][cite:26][cite:27][cite:29][cite:35][cite:50][cite:72]

- Request schema validation.
- CAPTCHA verification.
- Email normalization and uniqueness checks.
- Username uniqueness and format validation.
- Birth month and birth year bounds validation.
- Terms acceptance enforcement.
- Token validation for email verification.

Age classification may be computed at registration time, login time, or both, but enforcement decisions for restricted access must always come from server-side logic.[cite:60][cite:66][cite:72]

## Security Requirements

The registration and verification flows shall include the following security controls:[cite:23][cite:27][cite:32][cite:35]

- CAPTCHA before account creation.
- High-entropy, single-use, time-limited verification tokens.
- Hashed token storage when feasible.
- Rate limiting by IP and email for registration and resend endpoints.
- Generic responses on public recovery or resend endpoints where account enumeration risk exists.
- Audit logging for sensitive actions when required by policy.

The application should enforce post-login age-compliance gates at the authorization or feature-access layer so that restricted experiences cannot be reached merely by having a valid session.[cite:60][cite:66][cite:68][cite:72]

The email verification endpoint shall be idempotent in user-facing behavior where practical, such that reused or expired links show a friendly recovery page rather than a raw error.[cite:32][cite:35]

## UI Requirements

### Registration Page

The registration page shall include the following UI components:[cite:16][cite:17][cite:27][cite:29]

- Email input
- School dropdown bound to provided school options
- Email input
- Username input with `useEmail` button
- First name input
- Last name input
- Birth month selector
- Birth year input or selector
- Terms & Conditions checkbox with linked legal documents
- CAPTCHA widget
- Primary submit button labeled `Create account` or `Register`

The page shall provide clear inline helper text for why birth month and birth year are collected, what happens after submission, and how the `useEmail` button affects the username field.[cite:26][cite:45][cite:66][cite:84]

The page shall include a messages section above or near the form submission area that renders `SimpleMessageList` entries after submission and after non-field processing failures.[cite:74][cite:76][cite:78]

### Post-Submit Confirmation Page

After successful registration submission, the user shall be shown a confirmation page with:[cite:32][cite:45][cite:49]

- Confirmation that the account has been created in pending status.
- Instruction to check email for verification.
- Notice that login is available only after verification.
- A resend verification action.

### Email Verified Page

After successful email verification, the user shall be shown a confirmation that email is verified and the user may now log in.[cite:44][cite:45]

### Post-Login Age Compliance UX

If the application determines that additional age-related handling is required, the user shall be interrupted after login with a dedicated compliance experience before entering restricted parts of the application.[cite:60][cite:66][cite:69]

That experience may collect parent or guardian contact details, additional attestations, or other compliance data as needed by policy.[cite:26][cite:60][cite:66][cite:69]


## Submission Outcomes

After a registration post, the application shall update the messages section and surrounding actions according to the result.[cite:74][cite:76][cite:78]

### Existing Email Account

If the submitted email already belongs to an existing user account, the page shall display a warning in the messages section and present a link to the login page instead of indicating successful account creation.[cite:79][cite:82]

### Account Creation Failure

If account creation fails for any non-duplicate-email reason, the page shall display the returned `errorList` in the messages section using `SimpleMessageList`, with each entry rendered according to its severity such as error, warning, or informational state.[cite:74][cite:76][cite:78]

### Successful Account Creation

If account creation succeeds, the page shall display an informational success message telling the user to check email for the confirmation link and then log in after verification.[cite:32][cite:44][cite:45]

## Error Handling

The system shall explicitly handle the following cases:[cite:23][cite:27][cite:29][cite:32][cite:35]

- Duplicate email.
- Duplicate username.
- Invalid email format.
- Failed CAPTCHA verification.
- Missing required Terms acceptance.
- Expired email verification token.
- Used email verification token.

Any later post-login age-compliance flow shall separately handle missing or invalid follow-up information according to its own workflow rules.[cite:60][cite:66][cite:69]

Error messages shown to end users should be specific enough to resolve the issue while avoiding unnecessary leakage of account existence on public endpoints.[cite:35]

## Non-Functional Requirements

- All timestamps shall be stored in UTC.[cite:45]
- Email sending should be asynchronous or queued to keep user-facing latency low.[cite:35]
- Registration and resend endpoints shall be rate-limited.[cite:23][cite:35]
- State transitions should be logged for supportability and auditability.[cite:35][cite:51]
- Verification link processing should be safe to retry from a user experience perspective.[cite:32][cite:35]
- Age-compliance gates should be enforced consistently across UI routing and backend authorization checks.[cite:60][cite:66][cite:68][cite:72]

## Acceptance Criteria

The implementation will be considered complete when all of the following are true:[cite:16][cite:17][cite:23][cite:27][cite:32][cite:44][cite:45][cite:51][cite:60][cite:66][cite:72]

- A registrant can complete one registration form with all required profile fields, including `schoolId` and `userName`.
- Parent or guardian email is not collected during registration.
- CAPTCHA is required before the registration can be submitted.
- The system creates the account immediately after successful registration submission.
- Terms & Conditions acceptance is stored on the account with timestamp and version.
- A verification email is sent after account creation.
- The user cannot log in until email verification is complete.
- Email verification does not automatically log the user in.
- Birth month and birth year are stored for later age-policy evaluation.
- Users who require additional age compliance are routed into a post-login follow-up flow before restricted access is granted.
- Duplicate email and handle conflicts are handled correctly.
- Expired or used verification links produce recoverable user-facing behavior.

## Suggested Implementation Notes

A service-oriented backend design is recommended, with a registration service responsible for validation orchestration, state transitions, token issuance, and downstream email events, rather than spreading this logic across controller methods.[cite:32][cite:45]

Age thresholds, Terms version identifiers, token expiration durations, rate-limit thresholds, and the switch controlling post-login age-compliance gating should be externally configurable so policy and legal changes can be made without code deployment for every adjustment.[cite:26][cite:35][cite:51][cite:66][cite:72]
