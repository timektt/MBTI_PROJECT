# MBTI Z Context

Shared domain language for the MBTI Z product. This glossary captures project-specific terms used across product planning, UI copy, runtime behavior, and implementation discussions.

## Language

**MBTI Z**:
The current product and domain name for this repository: a Thai-first MBTI assessment platform with quiz, result, dashboard, type atlas, share artifact, and future account-backed persistence surfaces.
_Avoid_: MBTI Nocturne, Nocturne

**Guest-first runtime**:
The current product mode where quiz, result, dashboard, local history, PNG export, and reconnect package behavior work without account or database persistence.
_Avoid_: anonymous demo, temporary mock

**Reconnect Bundle**:
A browser-local `guest-cloud-handoff-v1` package that preserves guest result, history, and pending session state for future account/cloud import.
_Avoid_: backup file, export dump

**Result Artifact**:
The user-facing MBTI Z result object and visual surface containing type, house, animal signature, Movie Profile, dimensions, and share/export presentation.
_Avoid_: score page, quiz output

**Cloud Runtime**:
The future Supabase-backed assessment adapter that will persist sessions, answers, results, reports, and share records after the cloud gate is verified.
_Avoid_: production mode, live mode

**Relaunch Hold State**:
An intentional page state for account, social, admin, share, or settings surfaces that are not ready to reconnect to auth/cloud behavior yet.
_Avoid_: broken page, placeholder
