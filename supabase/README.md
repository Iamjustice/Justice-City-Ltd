# Supabase Setup (Justice City)

This project uses Supabase for backend persistence of users and Smile ID verification jobs.

## 1) Create a Supabase project
1. Open your Supabase dashboard.
2. Create a new project.
3. Copy:
   - `Project URL` -> `SUPABASE_URL`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`

## 2) Create database objects
Run `supabase/schema.sql` in the Supabase SQL editor.

This creates:
- `public.users`
- `public.verifications`
- `public.set_updated_at()` trigger function
- `public.update_verification_status(...)` helper function
- `public.verification_summary` view

## 3) Configure environment variables
Use `.env.example` and set these required values:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SMILE_ID_PARTNER_ID`
- `SMILE_ID_API_KEY`

Optional overrides:
- `SUPABASE_USERS_TABLE`
- `SUPABASE_VERIFICATIONS_TABLE`
- `SMILE_ID_CALLBACK_URL`
- `SMILE_ID_BASE_URL`
- `SMILE_ID_KYC_PATH`
- `SMILE_ID_BIOMETRIC_PATH`

## 4) Storage behavior
- If Supabase env vars are present, server storage uses Supabase.
- If not present, the app falls back to in-memory storage for local mock mode.

## 5) Smile ID callback wiring
Set Smile ID callback URL to:

`POST /api/verification/smile-id/callback`

Example local URL:
`http://localhost:5000/api/verification/smile-id/callback`


Production callback URL for this project:
`https://justicecityltd.com/api/verification/smile-id/callback`
