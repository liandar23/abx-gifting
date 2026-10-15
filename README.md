# Rocketlane gift request page

A static page for GitHub Pages. Gift requests are written to a Google Sheet through a small Google Apps Script.

## 1. Connect the Google Sheet (about 3 minutes)

1. Open the sheet: https://docs.google.com/spreadsheets/d/1To2W-Er2xXv3j8ePeYdiseMgqO0Cwsa5X3phl_kGAuU
2. **Extensions → Apps Script**. Delete the sample code and paste in everything from `apps-script/Code.gs`. Save.
3. **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, approve the Google permissions, then copy the **Web app URL** (it ends in `/exec`).
5. Open that URL in a browser. You should see `"Gift request endpoint is live"`.
6. In `app.js`, replace `PASTE_APPS_SCRIPT_WEB_APP_URL_HERE` with the URL.

The header row is created on the first submission. If the first tab already has content, set `SHEET_NAME` in `Code.gs` (for example `'Gift requests'`) and a new tab is created.

If you change `Code.gs` later: **Deploy → Manage deployments → Edit → Version: New version**. Updating this way keeps the same URL.

## 2. Put it on GitHub and turn on Pages

1. On github.com: **New repository** → name it (for example `abx-gifting`) → **Create**.
2. Click **uploading an existing file**, drag in *everything in this folder*, including `assets/`, `apps-script/` and `.nojekyll`, then **Commit**.
   (Finder hides `.nojekyll`. Press Cmd+Shift+. to show it. The site works without it.)
3. **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / `(root)` → **Save**.
4. After about a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

Free GitHub accounts can use Pages only on public repos. The page contains no secrets: the Apps Script URL can only add rows. It can't read the sheet.

## Tracking links per account

Anything in the link's query string is saved with the request:

```
https://<user>.github.io/abx-gifting/?account=acme&utm_source=linkedin&utm_campaign=q4-abx
```

These are captured: `account`, `ref`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, plus the page URL and referrer.

## Files

- `index.html`, `style.css`, `app.js`, `assets/gift.jpg`: the site
- `apps-script/Code.gs`: the Google Sheets endpoint (it runs in Google, not on GitHub)
- `.nojekyll`: tells GitHub Pages to serve the files as-is
