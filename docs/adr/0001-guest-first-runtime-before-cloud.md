# Guest-first runtime before cloud reconnect

Status: accepted

MBTI Z keeps the active assessment path on `guest-local` until a fresh Supabase target, Vercel binding, and cloud assessment adapter are verified end to end. The alternative was to reconnect auth/database persistence first, but that would put the working quiz/result/dashboard flow behind unstable external infrastructure; the trade-off is that account sync, premium unlock, and public share remain hold-state features until the cloud gate passes.
