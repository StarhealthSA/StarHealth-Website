# Insurance Page & Offer Booking — Changes & Workflows

This document summarizes the new features added for the **Insurance partners page** and the **Offers booking / admin confirmation flow**.

---

## 1. Insurance partners listing

### What changed

| Area | Change |
|------|--------|
| Public page | New route `/insurance` with hero banner + logo grid |
| Admin CMS | New **Insurance** section to add/edit/delete partners |
| Hero copy | Heading & subheading editable from admin (EN/AR) |
| Navigation | Insurance link added to header & footer |
| Hero image | Uses `src/assets/home/insurance-bg.png` |

### Data model (Firestore)

**Collection:** `insurancePartners`

| Field | Description |
|-------|-------------|
| `name` | `{ en, ar }` |
| `logoUrl` | Partner logo |
| `websiteUrl` | Optional external link |
| `slug` | URL-friendly id |
| `status` | `active` \| `draft` |
| `featured` | Boolean |
| `order` | Sort order |

**Site settings doc:** `siteSettings/insurance`

| Field | Description |
|-------|-------------|
| `heroTitle` | `{ en, ar }` — hero heading |
| `heroSubtitle` | `{ en, ar }` — hero subheading |

Empty hero fields fall back to default locale strings (`insurancePage.hero.*`).

### Public workflow

```
Visitor opens /insurance
        │
        ▼
Load active partners from Firestore
Load hero text from siteSettings/insurance
        │
        ▼
Show hero (image + title/subtitle)
Show partner cards (logo + name)
        │
        └─ If websiteUrl set → card opens in new tab
```

### Admin workflow

```
Admin → Insurance
        │
        ├─ Hero banner form
        │     Edit EN/AR heading & subheading → Save
        │
        └─ Partners list
              Add / Edit / Delete / set Active|Draft / order
              Logo upload → Storage
              Published partners appear on /insurance
```

### Key files

- Public: `src/app/(site)/insurance/page.jsx`, `src/components/insurance/insurance-listing.jsx`
- Admin: `src/app/admin/insurance/`, `src/components/admin/insurance/`
- Content: `src/lib/content/insurance.js`, `site-settings.js` (insurance helpers)
- API: `src/app/api/admin/insurance/`, `src/app/api/admin/site-settings/insurance/`

---

## 2. Offer page booking form (callback request)

### What changed

Offers no longer open the full doctor/slot appointment modal.

Instead, **Book Appointment** opens a dedicated **offer callback form**:

- Available offer (dropdown; preselected from the card clicked)
- Full name
- Phone number
- Age group
- Note: *You will get a call back for confirming the appointment*
- Submit button: **Book now** (full width, centered)

### Public workflow

```
Visitor on /offers → clicks Book Appointment on a card
        │
        ▼
Offer form opens (offer preselected)
Visitor fills name, phone, age → Book now
        │
        ▼
POST /api/offer-bookings
Save to Firestore appointments (type: offer_callback, status: pending)
Send EmailJS appointment email (best-effort)
Redirect to /thank-you
```

### Email on submit

Yes — uses the **appointment** EmailJS template with:

| Template field | Value |
|----------------|--------|
| name | Patient name |
| phonenumber | Phone |
| age | Age group |
| doctor | `Offer callback` |
| speciality | Offer name |
| date | `Callback requested` |
| time | `Team will confirm` |

If EmailJS is not configured, the booking is still saved; email failure is logged only.

Requires:

- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
- `NEXT_PUBLIC_EMAILJS_APPOINTMENT_TEMPLATE_ID`

### Key files

- UI: `src/components/offers/offer-appointment-modal.jsx`, `offers-listing.jsx`
- Submit: `src/lib/booking/submit-offer-callback.js`
- API: `src/app/api/offer-bookings/route.js`
- i18n: `offersPage.modal.*` in `en.json` / `ar.json`

---

## 3. Admin offer bookings (pending → confirmed)

### What changed

| Area | Change |
|------|--------|
| Bookings tabs | New **Offer Bookings** tab |
| Status | New requests are **Pending** until a doctor is assigned |
| Confirm | Admin assigns doctor + availability → **Booking confirmed** |
| Main bookings | Confirmed offer bookings also appear under **Active** |
| Notifications | Unread pending count badge on **Offer Bookings** tab |
| UX | Click anywhere on a row to open the booking |

### Offer booking document (Firestore `appointments`)

| Field | Pending | After confirm |
|-------|---------|----------------|
| `type` | `offer_callback` | `offer_callback` |
| `status` | `pending` | `booked` |
| `offerId` / `offerName` | set | kept |
| `doctorId` / `doctorName` | empty | assigned |
| `date` / `slotIndex` / `slotLabel` | empty / callback note | from availability |
| `source` | `offers` | `offers` |
| `confirmedAt` | — | timestamp |
| `unscheduled` | `true` | `false` (or still true if doctor has open schedule) |

Legacy offer rows saved earlier as `status: booked` without a doctor are treated as **Pending** in the UI until confirmed.

### Admin workflow

```
Admin → Bookings → Offer Bookings
        │
        ├─ Badge shows unread pending count
        │
        ▼
Click row → Offer booking detail
        │
        ├─ Pending
        │     Assign doctor (from DB)
        │     Load available dates & slots
        │     Confirm booking
        │           │
        │           ▼
        │     status → booked
        │     Status label → "Booking confirmed"
        │     Also listed under Active bookings
        │
        └─ Confirmed / Cancelled
              View details; edit (confirmed); cancel / delete
```

### Tab behavior

| Tab | Shows |
|-----|--------|
| **Active** | Normal appointments + **confirmed** offer bookings |
| **Cancelled** | Cancelled appointments (including confirmed-then-cancelled offers) |
| **All** | Same mix as above (excludes pending offers) |
| **Offer Bookings** | All `offer_callback` rows (Pending / Booking confirmed / Cancelled) |

### Confirm email

Confirming in admin (**assign doctor**) does **not** send a second email today. Only the public form submit sends mail.

### Key files

- List UI: `src/components/admin/appointments/bookings-tab.jsx`
- Detail + assign form: `src/app/admin/appointments/[id]/page.jsx`, `offer-booking-confirm-form.jsx`
- Logic: `src/lib/content/appointments.js` (`createOfferCallbackBooking`, `confirmOfferBooking`)
- Status helpers: `src/lib/appointments/offer-booking-status.js`
- Unread API: `src/app/api/admin/appointments/unread-count/route.js`

---

## 4. End-to-end offer journey (summary)

```
┌─────────────┐     Book now      ┌──────────────────┐
│  /offers    │ ───────────────►  │ Pending booking  │
│  public form│   (+ email)       │ Offer Bookings   │
└─────────────┘                   └────────┬─────────┘
                                           │
                              Admin assigns doctor/slot
                                           │
                                           ▼
                              ┌──────────────────────┐
                              │ Booking confirmed    │
                              │ Offer Bookings tab   │
                              │ + Active bookings    │
                              └──────────────────────┘
```

---

## 5. Quick admin checklist

### Insurance

1. Open **Admin → Insurance**
2. Set hero heading / subheading → Save
3. Add partners with logo → set **Active**
4. Check `/insurance`

### Offer bookings

1. Ensure offers exist and are published (**Admin → Offers**)
2. Submit a test booking from `/offers`
3. Open **Admin → Bookings → Offer Bookings** (badge should show if unread)
4. Open the row → assign doctor & slot → **Confirm booking**
5. Verify it appears under **Active** with status **Booking confirmed**
