# Frontend Code Quality Standards (Monorepo)

This document defines the code-quality rules for the HMS frontend monorepo (pnpm workspace with multiple Next.js apps). It is intended to keep the codebase maintainable, testable, and easy to evolve as features grow.

**Applies to:** `frontend/apps/*` (admin, doctor, patient)

---

## 1) Non‑Negotiables (Baseline)

1. **Readability over cleverness**: prefer explicit, boring code.
2. **Single source of truth**: avoid duplicated logic, constants, and types.
3. **Small units**: keep modules small and focused (SRP).
4. **Stable public boundaries**: exported APIs should be consistent and documented.
5. **Fail fast**: validate inputs early, use guard clauses.
6. **No mixed concerns in a file**: UI, business rules, and data access must not be blended.

---

## 2) Tooling & Standards

### 2.1 TypeScript
- Use TypeScript everywhere. Avoid `any`.
- Prefer `unknown` + narrowing over `any`.
- Do not use type assertions (`as X`) to silence errors unless there is a verified runtime guarantee.

### 2.2 ESLint / Next.js
- Follow `eslint-config-next/core-web-vitals` and Next TypeScript rules.
- Do not disable rules globally. If an exception is needed, keep it **local**, **justified**, and **temporary**.

### 2.3 Formatting
- Keep formatting consistent. Don’t mix formatting styles within a file.
- Prefer refactors over formatting-only PRs.

---

## 3) Folder Structure & Separation of Concerns

### 3.1 Layered structure (recommended)
Each app should organize code so that **UI**, **domain/business**, and **data access** can change independently.

Recommended structure inside an app (adapt to existing folders):

```
apps/<app>/
  app/                  # Next.js routes/layouts
  components/           # shared UI components (presentational)
  features/             # feature modules (vertical slices)
    appointments/
      ui/               # feature UI components
      hooks/            # useCases in hook form
      domain/           # business rules/types
      data/             # API adapters, DTO mapping
  client/               # shared HTTP client, request helpers
  store/                # zustand stores (UI state)
  lib/                  # generic utilities (pure, reusable)
```

### 3.2 Rules for file responsibilities
- **UI components** (React components) must not:
  - perform direct HTTP calls,
  - contain complex business decisions,
  - parse/transform API payloads deeply.
- **Data fetching logic** must live in **services/adapters/hooks** (e.g., React Query hooks) not in components.
- **Business/domain logic** (rules, invariants, calculations) must live in domain modules and be testable without React.

### 3.3 Business vs. Data vs. UI (hard rule)
Do not put these in the same file:
- Business domain logic (validation, rules, state transitions)
- Data access logic (Axios/fetch, DTO mapping)
- UI rendering (React components)

A good split looks like:
- `features/x/domain/*.ts`: pure functions/types
- `features/x/data/*.ts`: API calls + DTO mapping
- `features/x/hooks/*.ts`: React Query hooks composed from data layer
- `features/x/ui/*.tsx`: components using hooks

---

## 4) SOLID Principles (with Before/After Examples)

> SOLID is not “OOP-only”. The same ideas apply to modules, functions, hooks, and React components.

### 4.1 SRP — Single Responsibility Principle
**Rule:** a module/function/component should have one reason to change.

**Before (SRP violation: UI + request + mapping + business rules together)**
```ts
// features/profile/ui/ProfilePage.tsx
"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type Profile = { id: string; name: string; age: number };

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/profile");
        const p = res.data;

        // mapping + business rule
        if (p.age < 0) throw new Error("Invalid age");

        setProfile({ id: p.id, name: p.full_name, age: p.age });
      } catch (e: any) {
        setError(e.message);
      }
    })();
  }, []);

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return <h1>Hello {profile.name}</h1>;
}
```

**After (SRP applied: separate domain, data, hook, UI)**
```ts
// features/profile/domain/profile.ts
export type Profile = { id: string; name: string; age: number };

export function assertValidProfile(profile: Profile): void {
  if (profile.age < 0) throw new Error("Invalid age");
}
```

```ts
// features/profile/data/profileApi.ts
import type { Profile } from "../domain/profile";
import { assertValidProfile } from "../domain/profile";
import { http } from "@/client/http";

type ProfileDto = { id: string; full_name: string; age: number };

function mapProfile(dto: ProfileDto): Profile {
  const profile: Profile = { id: dto.id, name: dto.full_name, age: dto.age };
  assertValidProfile(profile);
  return profile;
}

export async function fetchProfile(): Promise<Profile> {
  const res = await http.get<ProfileDto>("/api/profile");
  return mapProfile(res.data);
}
```

```ts
// features/profile/hooks/useProfileQuery.ts
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../data/profileApi";

export function useProfileQuery() {
  return useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
}
```

```tsx
// features/profile/ui/ProfilePage.tsx
"use client";

import { useProfileQuery } from "../hooks/useProfileQuery";

export function ProfilePage() {
  const { data, isLoading, error } = useProfileQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load</div>;
  if (!data) return null;

  return <h1>Hello {data.name}</h1>;
}
```

**SRP checklist**
- If a component “needs to change” because API shape changed, it’s doing too much.
- If a data function “needs to change” because UI changed, it’s doing too much.

---

### 4.2 OCP — Open/Closed Principle
**Rule:** add new behavior by **extending**, not by editing large conditional blocks.

**Before (OCP violation: switch grows forever)**
```ts
type Notification = { channel: "email" | "sms"; to: string; message: string };

export async function sendNotification(n: Notification) {
  if (n.channel === "email") {
    return sendEmail(n.to, n.message);
  }
  if (n.channel === "sms") {
    return sendSms(n.to, n.message);
  }
  throw new Error("Unsupported channel");
}
```

**After (OCP applied: strategy map / registry)**
```ts
type Notification = { channel: "email" | "sms"; to: string; message: string };

type Sender = (to: string, message: string) => Promise<void>;

const senders: Record<Notification["channel"], Sender> = {
  email: sendEmail,
  sms: sendSms,
};

export async function sendNotification(n: Notification) {
  const sender = senders[n.channel];
  return sender(n.to, n.message);
}
```

To add a new channel, you add a new sender implementation and register it—no need to edit a large conditional chain.

---

### 4.3 LSP — Liskov Substitution Principle
**Rule:** if `B` is a subtype of `A`, you should be able to use `B` anywhere `A` is expected **without breaking behavior**.

**Before (LSP violation: subclass changes expected behavior)**
```ts
class AppointmentRepository {
  async save(appointment: { id: string }) {
    // expected to always persist
    return { ok: true };
  }
}

class ReadOnlyAppointmentRepository extends AppointmentRepository {
  async save() {
    throw new Error("Read-only");
  }
}

async function createAppointment(repo: AppointmentRepository) {
  // will now crash if ReadOnlyAppointmentRepository is passed
  await repo.save({ id: "a1" });
}
```

**After (LSP applied: model capabilities as interfaces)**
```ts
type Appointment = { id: string };

interface AppointmentReader {
  getById(id: string): Promise<Appointment | null>;
}

interface AppointmentWriter {
  save(appointment: Appointment): Promise<{ ok: true }>;
}

async function createAppointment(repo: AppointmentWriter) {
  await repo.save({ id: "a1" });
}
```

Now a read-only repository can implement `AppointmentReader` and will never be mistakenly used where writing is required.

---

## 5) Avoid Cognitive Complexity (Practical Rules)

Cognitive complexity comes from nesting, branching, and mixed responsibilities.

### 5.1 Rules
- Prefer **guard clauses** over deep `if/else` nesting.
- Extract complex branches into small named functions.
- Keep React components focused on rendering; move logic to hooks/services.
- Limit a function to ~20–40 lines unless it’s a thin coordinator.
- Avoid boolean flag explosions like `doThing(isFoo, isBar, isBaz)`.

### 5.2 Example: flatten nested logic
**Before**
```ts
function canBook(user: any, slot: any) {
  if (user) {
    if (user.active) {
      if (slot) {
        if (!slot.isFull) {
          return true;
        }
      }
    }
  }
  return false;
}
```

**After**
```ts
function canBook(user: { active: boolean } | null, slot: { isFull: boolean } | null) {
  if (!user) return false;
  if (!user.active) return false;
  if (!slot) return false;
  if (slot.isFull) return false;
  return true;
}
```

---

## 6) React + Next.js Rules

### 6.1 Server vs Client boundaries
- Keep Server Components pure (no browser-only APIs).
- Use `"use client"` only when needed (state, effects, event handlers).
- Avoid module-level singletons that can leak across requests on the server.

### 6.2 Components
- Prefer small components with clear props.
- Do not accept “god props” objects with dozens of fields.
- Prefer composition over conditionally rendering large blocks.

### 6.3 Hooks
- Hooks must be **pure orchestration** (compose data + domain rules + UI state).
- Hooks should not reach into unrelated features.

---

## 7) Data Fetching & API Rules

### 7.1 One HTTP client
- Use a single configured HTTP client module (Axios instance) to:
  - set base URL,
  - inject auth headers,
  - handle refresh/redirect,
  - standardize errors.

### 7.2 React Query is the default
- Prefer React Query (`useQuery`, `useMutation`) for remote state.
- Query keys must be stable, predictable, and grouped by feature.

Example query key convention:
```ts
export const profileKeys = {
  all: ["profile"] as const,
  me: () => [...profileKeys.all, "me"] as const,
};
```

### 7.3 DTO mapping
- Never leak raw API DTOs into UI.
- Convert DTO → domain model in the data layer.

---

## 8) State Management

### 8.1 Prefer the right state location
- **URL state**: filters/sort/pagination that should be shareable.
- **React Query**: server/remote state.
- **Zustand**: client UI state shared across components (sidebar open, draft form state).
- **Local component state**: ephemeral UI state.

### 8.2 Zustand rules
- Stores should be small and feature-scoped.
- Do not store derived values; compute them via selectors.

---

## 9) Design Patterns (When and How)

### 9.1 Singleton (use carefully)
Use singletons only for **pure client-side** objects or stateless helpers.

**Good Singleton example: one Axios instance (client only)**
```ts
// client/http.ts
import axios from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000,
});
```

**Avoid:** singletons that keep mutable per-user state in module scope.

### 9.2 Factory
Use factories to build objects with environment-specific configuration.

Example: API service factory per role/app
```ts
type Role = "patient" | "doctor" | "admin";

export function createAuthHeader(role: Role) {
  // decide token source per app/role
  return { Authorization: `Bearer ${getTokenForRole(role)}` };
}
```

### 9.3 Dependency Inversion (practical)
Prefer passing dependencies (HTTP client, clock, storage) rather than importing them everywhere.

Example:
```ts
export function makeProfileApi(deps: { http: typeof import("axios").default }) {
  return {
    fetchProfile: async () => deps.http.get("/api/profile"),
  };
}
```

---

## 10) Error Handling

- Normalize errors in one place (data layer) so UI handles a small set of error shapes.
- Show user-friendly messages; log diagnostic details separately.
- Do not swallow errors silently.

---

## 11) Security & Privacy

- Never log tokens or PII.
- Validate user input on the client (for UX) but treat server validation as the source of truth.
- Prefer allowlists over denylists (e.g., for roles, routes).

---

## 12) PR Review Checklist

- Does each file have a single responsibility?
- Are UI/data/domain separated?
- Are types explicit (no `any`)?
- Is cognitive complexity reasonable (low nesting, small functions)?
- Is API mapping isolated (DTO → domain)?
- Are query keys stable and well-scoped?
- Are errors handled and messages appropriate?

---

## 13) Naming & Style (Quick Rules)

- `PascalCase` for components and types.
- `camelCase` for functions/vars.
- File names match main export: `useProfileQuery.ts`, `ProfilePage.tsx`.
- Avoid abbreviations unless they’re standard (API, URL, ID).

---

## 14) Summary

- Keep modules small and focused.
- Separate UI, data fetching, and business rules.
- Apply SOLID to reduce change impact.
- Reduce cognitive complexity with guard clauses and extraction.
- Use patterns (Singleton/Factory) deliberately, not by default.
