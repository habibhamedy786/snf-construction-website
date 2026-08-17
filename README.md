# SNF Construction — Website

A one-page marketing website for SNF Construction, a general contractor serving California.

Plain HTML, CSS, and JavaScript. There is nothing to install and nothing to build — you can
open the site by double-clicking `index.html`.

---

## What is in this folder

| File / folder | What it is |
|---|---|
| `index.html` | All the page content — headings, text, phone number, email |
| `styles.css` | All the colors, fonts, spacing, and the mobile layout |
| `script.js` | Menu, scroll animations, and the contact form |
| `images/` | Photos and the logo |
| `README.md` | This file |

---

## How to open the site on your Mac

1. Open **Finder**.
2. Go to **Desktop → snf construction website**.
3. Double-click **`index.html`**.

It opens in your browser. That is the whole site.

---

## 1. Putting in your real logo

Right now the logo is a recreation of your mark, saved as `images/logo.svg`. To use your
actual logo file instead:

1. Rename your logo file to **`logo.png`** (a PNG with a transparent background works best).
2. Drag it into the **`images`** folder.
3. Open `index.html` in TextEdit. Press **Cmd+F**, search for `images/logo.svg`.
4. There are **3 places** it appears. Change each one to `images/logo.png`.
5. Save, then refresh the browser.

Ideal logo size: about **200 px wide**, transparent background.

---

## 2. Changing text on the page

Everything you can read on the site lives in `index.html`. Open it in TextEdit, use
**Cmd+F** to find the words you want to change, type the new words, and save.

Things you will probably want to change:

- **"20+ Years"** — appears in the hero stats and on the About photo badge.
- **Project names and cities** in the "Our Jobsites" section — these are placeholders.
- **The three client reviews** — replace with real ones once you have them.
- **Hours** — currently "Mon–Sat, 7:00am – 6:00pm".
- **License number** — the footer says "Licensed · Bonded · Insured". Once you have your
  CSLB number, change it to something like "CSLB Lic. #1234567".

---

## 3. Changing the phone number or email

They appear in several places. Use **Cmd+F** in `index.html` and replace every match:

- Search `5303506659` → the tap-to-call links
- Search `(530) 350-6659` → the visible text
- Search `snfconstruction23@gmail.com` → the email links

Also update the phone number in `script.js` (search for `530`).

---

## 4. Swapping the photos

The photos in `images/` are free stock photos (from Unsplash, free for commercial use).
Replace them with real photos of your own jobs as soon as you have them — real project
photos convert far better than stock.

To swap one: give your photo the **exact same file name** as the one you are replacing,
then drag it into the `images` folder and choose **Replace**.

| File | Where it shows |
|---|---|
| `hero.jpg` | Big background photo at the top |
| `band.jpg` | Background of the "Ready to break ground?" strip |
| `about.jpg` | Photo in the About section |
| `type-residential.jpg` | Project Types — Residential card |
| `type-commercial.jpg` | Project Types — Commercial card |
| `type-industrial.jpg` | Project Types — Industrial card |
| `type-multifamily.jpg` | Project Types — Multifamily card |
| `proj-1.jpg` … `proj-4.jpg` | The four Jobsites cards |
| `interior.jpg` | Spare photo, not currently used |

Keep photos **wide (landscape)** and under about **500 KB** each so the site stays fast.

---

## 5. Making the contact form send you email

Right now, when someone submits the form, it opens **their** email app with the message
pre-filled and addressed to `snfconstruction23@gmail.com`. That works, but some visitors
will drop off.

To have submissions land directly in your inbox instead (free, takes 5 minutes):

1. Go to **https://formspree.io** and create a free account.
2. Create a **New Form**. Use `snfconstruction23@gmail.com` as the destination.
3. Formspree gives you a URL that looks like `https://formspree.io/f/abcdwxyz`.
4. Open `script.js` in TextEdit.
5. Near the top find this line:

   ```
   var FORMSPREE_ENDPOINT = '';
   ```

6. Paste your URL between the quotes:

   ```
   var FORMSPREE_ENDPOINT = 'https://formspree.io/f/abcdwxyz';
   ```

7. Save. Submit the form once yourself — Formspree will email you to confirm.

---

## 6. Putting the site online

The easiest option, and free:

1. Go to **https://app.netlify.com/drop**
2. Drag the whole **snf construction website** folder onto the page.
3. Wait about 20 seconds. You get a live link like `random-name-123.netlify.app`.
4. To use your own domain (e.g. `snfconstruction.com`), buy it, then in Netlify go to
   **Domain settings → Add a custom domain** and follow the steps.

To update the site later, drag the folder onto the same page again.

---

## 7. Before you go live — checklist

- [ ] Real logo added
- [ ] Phone number and email double-checked (tap them on a phone to test)
- [ ] Real project photos and project names in place
- [ ] Real client reviews (or remove the Reviews section until you have some)
- [ ] The **5.0 star rating** above the reviews is a placeholder — replace it with your real
      Google rating and review count, or delete that block. Do not publish it as-is
- [ ] Check the city list in the **Service Area** section matches where you actually work
- [ ] License number added to the footer
- [ ] Contact form connected to Formspree and tested
- [ ] Update `https://www.snfconstruction.com/` in `index.html` to your real domain
      (search for `canonical`)

---

## Colors used

If you ever want to adjust the blue, it is set in one place at the top of `styles.css`:

```
--blue-500:   #2A6CBE;   /* main blue — buttons, links, section labels */
--blue-400:   #5B8FD4;   /* logo blue — accents on dark backgrounds */
--orange-600: #C2410C;   /* safety orange — "Active" job badges */
--navy-800:   #0A1B33;   /* dark navy — header, footer */
```

Change those values and the whole site follows.

**A warning before you change them:** every colour above was picked to pass the WCAG AA
contrast standard (4.5:1) so the text stays readable for everyone, including people with
low vision — and, practically, so the site does not get flagged in accessibility audits.
A lighter blue or a brighter orange will look fine on your monitor and fail that test.
If you want to change one, check the new value at https://webaim.org/resources/contrastchecker/
against white (`#FFFFFF`) first and keep the ratio at 4.5 or above.
