# Cards 07-08 - Pilot Approval And Home Production

## Card 07 - Style Lock Approval

Owner: A0 Lead Integrator
Reviewers: A3, A5, A6, A8
Status: `PENDING`
Tasks: `FAM-PIL-011..012`
Depends on: Cards 05-06

### Objective

ตัดสิน style lock จากภาพและ crop evidence ก่อนอนุญาต batch production

### Writable Files

Approval ledger/status docs only.

### Checklist

- score six pilots against one rubric
- compare House continuity and Animal camera language
- inspect TH/EN crop boards at 320/390/768/1024/1440
- approve, reject, or issue exactly one bounded revision brief
- record user/Lead decision without implying runtime integration

### Acceptance

`FAM-GATE-02` is explicitly PASS or remains BLOCKED with exact failed criteria. Batch work cannot start from an ambiguous review.

## Card 08 - Home Hero V2 Production

Owner: A3B Image Production Agent
Status: `PENDING`
Tasks: `FAM-AST-001..008`
Depends on: Card 07 PASS

### Objective

สร้าง production-ready Home Hero V2 พร้อม immutable asset records, optimized variant และ crop proof

### Writable Files

`public/mbti-z/v4/fantasy-v2/home/**`, V2 manifest/verifier, asset evidence.

### Checklist

- create versioned namespace and filename
- preserve source candidate separately from runtime file
- test one-source crop; add mobile variant only if evidence requires it
- optimize to <=300KB desktop and <=180KB mobile target
- record source/runtime hash, dimensions and object-position contract
- do not edit Home page in this card

### Acceptance

Asset verifier passes and A5 can consume Hero without guessing crop, sizes, alt policy or loading priority.
