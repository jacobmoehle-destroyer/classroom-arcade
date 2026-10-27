# Global Chat setup

The chat page is hosted at `/chat/`, but shared messages require a Supabase project.

1. Create a project at https://supabase.com/.
2. In the Supabase Dashboard, open **SQL Editor**, paste the contents of `global-chat-setup.sql`, and run it.
3. Open **Project Settings → API** (or **Connect**) and copy the **Project URL** and the **anon/public key**.
4. Edit `chat/index.html` and replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_ANON_PUBLIC_KEY`.
5. Commit the updated file. Open the site, pick a display name, and test from two separate browsers.

## Important
- Never put a Supabase `service_role` key in browser code.
- This starter uses anonymous public posting; anyone who can access the site can read and post messages. It is a prototype, not a hardened public chat service.
- The UI escapes user content by inserting it as text, caps message/name lengths, and throttles sends in the browser. Client-side throttling can be bypassed. Before sharing widely, add server-enforced rate limits, moderation/reporting, and a retention policy.
- Names are display names, not verified identities. Don't use this for private or sensitive conversations.
