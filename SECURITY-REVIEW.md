# Security review

**Reviewed:** 2026-10-08
**Scope:** Application source code (frontend and backend); deployment configuration was excluded.

## Findings

### 1. Private links can be re-shared without checking ownership

- **Severity:** Medium (policy-dependent)
- **Confidence:** 9/10
- **Location:** `backend/src/main/java/com/athelyr/linkmanager/grouplink/service/GroupLinksServiceImpl.java:177-185`

The group-share operation loads a private link by ID and creates a group share without checking that the authenticated user owns that private link. A group member who obtains another user's private-link ID may therefore cause its URL to be shared with the destination group.

This is a vulnerability if only the owner is meant to share a private link. If the product intentionally allows a member to re-share a private link they have received, this behavior is an accepted product policy; the ID lookup still means the endpoint does not verify that the caller actually received or knows the URL. Decide and document the intended policy.

### 2. Member creation accepts an owner role

- **Severity:** Medium
- **Confidence:** 9/10
- **Location:** `backend/src/main/java/com/athelyr/linkmanager/group/service/GroupServiceImpl.java:73-90`

The add-member operation correctly limits callers to group owners and admins, but it accepts the new member's role from the request. Either role can therefore add a user as `OWNER`. The separate role-update operation is owner-only, but this add-member path bypasses that restriction. An admin who can add members can grant an invitee owner-level group permissions.

For workflows such as a teacher adding students, keep the add-member operation available to admins but assign new members `MEMBER` by default. Reserve owner assignment for an explicitly owner-authorized operation.

## Authentication note

A signed JWT is sufficient to authenticate the user; a separate token for group admins or teachers is not needed. The server should validate the JWT, resolve the user, and check that user's current role in the specific group for each operation. Group roles should not be trusted from client-supplied request data or stale client-side state.
