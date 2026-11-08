# StuDeepby

Learn Deep. Score Better. (Created by Deep Bhumarkar, @yus.deep)

Free BCA notes and PYQs (PDF) + YouTube video links, with an "Follow on Instagram to unlock" popup
and an admin dashboard. No student login. No payments.

## Kya kya hai
- Public site: Home, Courses > BCA > SGBAU > Semester > Subject > Notes / Videos / PYQs
- Download popup: Instagram khulta hai, wapas aane par loading, phir PDF download
- Admin dashboard (`/admin`): subjects add/rename/delete, PDF upload, YouTube link, show/hide, messages, download counts
- Contact form: message database me save hota hai, admin me dikhta hai
- Private PDF storage: PDF ka seedha link kabhi public nahi hota, sirf 1 minute ka link banta hai

## Zaroori sachchi baat
- Instagram follow verify NAHI ho sakta. Popup ek request hai; PDF dono case me unlock hoti hai.
- Ye code abhi tak sirf likha gaya hai. Pehli baar `npm run build` aur test tumhare Codespace me hoga.
- Supabase free plan: 1 hafte tak koi site na khole to project pause ho jata hai.

---

## STEP 1: Supabase setup (sirf ek baar)

1. supabase.com par login karo, **New project** banao. Database password sambhal ke rakho.
2. Left menu me **SQL Editor** kholo, **New query**. Is repo ki `supabase/schema.sql` file ka poora text paste karo, **Run** dabao. "Success" aana chahiye.
3. **Authentication** > **Users** > **Add user** (create new user). Apna email aur ek strong password daalo. "Auto confirm" ON rakho. Ye tumhara admin account hai.
4. Wapas **SQL Editor** me ye chalao (apna email likho):

```
insert into public.admins (user_id)
select id from auth.users where email = 'TUMHARA-EMAIL@example.com';
```

5. **Authentication** ke settings me "Allow new users to sign up" (ya "Enable sign ups") ko **OFF** karo, taaki koi aur account na bana sake. (Menu ka naam thoda alag ho sakta hai.)
6. **Project Settings** > **API** se 3 cheezein copy karo: Project URL, anon public key, service_role key.
   service_role SECRET hai. Kisi ko mat bhejna, chat me mat daalna.

## STEP 2: Codespace me chalao

```
cp .env.example .env.local
```

`.env.local` file kholo aur bharo:
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key
- `DOWNLOAD_TOKEN_SECRET` = koi lamba random text. Terminal me `openssl rand -hex 32` chalake output paste kar do.

Phir:

```
npm install
npm run lint
npm run typecheck
npm run build
npm run dev
```

Error aaye to poora error copy karke Claude ko bhejo.

## STEP 3: Pehli baar test karo
1. `/admin/login` par jao, apna email-password se login karo.
2. **Subjects** me ek subject banao (jaise Semester 1).
3. **Files** me us subject me ek PDF upload karo (Add notes).
4. Home site par us subject par jao > Notes > us file par tap karo > "Follow on Instagram".
5. Instagram khulega. Wapas aao. Bar chalega. PDF download hoga.
6. Admin dashboard me "Total downloads" 1 dikhna chahiye.

## STEP 4: CAPTCHA (Cloudflare Turnstile) - optional par accha
1. dash.cloudflare.com par free account banao. **Turnstile** > **Add site**.
2. Domain me apni site ka address daalo (Netlify wala, aur testing ke liye `localhost`).
3. Site key aur Secret key milengi. `.env.local` me daalo:
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY` aur `TURNSTILE_SECRET_KEY`.
4. Dono khali chhodo to CAPTCHA band rahega (site chalegi, par bots se kam suraksha).

## STEP 5: Netlify par publish
1. netlify.com par GitHub se login. **Add new project** > **Import an existing project** > apni repo chuno.
2. **Environment variables** me `.env.local` wali saari values daalo (`NEXT_PUBLIC_SITE_URL` me apni Netlify site ka address).
3. **Deploy**. Baad me env variables badlo to dobara deploy karo.

## Admin kaise use karein (mobile par)
- **Subjects**: naya subject add, naam badlo (rename), semester badlo, hide/show, delete.
  Web address (URL) subject banate waqt ke naam se bana rehta hai, rename karne se link nahi tootta.
- **Files**: subject chuno > Add notes / Add PYQ (PDF, max 20 MB) / Add YouTube video (link paste).
- **Messages**: contact form ke messages.

## Folder map
```
supabase/schema.sql      database + security rules
src/app                  pages, admin, api routes
src/components           design pieces, admin screens
src/lib/repo.ts          public data reading (Supabase ya demo data)
src/lib/token.ts         unlock token (HMAC)
```
