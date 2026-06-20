# Asset System

The starter is frontend-only. It renders public media URLs already exposed by the main platform or client repo. It does not upload, crop, resize, moderate, or store media.

Protected asset slots:

- `hero_background`
- `couple_photo`
- `venue_photo`
- `gallery_image`
- `gift_qr`
- `monogram`
- `section_decoration`

Design mode may render clearly marked demo media placeholders. Live mode must never show fake QR codes or fake photos as if they are real client media.

If a live gift option has text but no QR/image, render text-only or a neutral missing-media slot. Do not generate a QR in this repo.

The default gift missing-media slot should match the platform dashed/icon placeholder. It is a neutral missing-media state, not a fake QR or photo.

Media primitives live in `src/components/media`. Asset normalization helpers live in `src/lib/assets.ts`.
