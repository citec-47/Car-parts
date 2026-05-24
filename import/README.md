# Product import

Drop a WooCommerce product export here as `products.csv`, then run:

```bash
npm run import:dry-run   # parse + summarize, NO writes
npm run import:products  # do the import (uploads images to Cloudinary, writes Prisma rows)
```

## Where to get the CSV

In your old WordPress site:

1. Sign in at `https://your-old-site.com/wp-admin/`
2. **Products → All Products**
3. Click **Export** (top of the list)
4. Leave all "Which columns" / "Which types" / "Which categories" fields empty (to export everything)
5. Check **"Yes, export all custom meta"**
6. Click **Generate CSV** — save the file as `products.csv` and place it in this folder.

## Expected columns

The importer reads the standard WooCommerce CSV format. These are the columns it uses (case-insensitive match — Woo sometimes uses `Name`, sometimes `Product Name`):

| Column | Required | Notes |
|---|---|---|
| `SKU` | yes | Must be unique per product. Used as the unique key. |
| `Name` / `Product Name` | yes | |
| `Type` | no | Defaults to "simple". Variable products are imported as the parent SKU only (variations skipped in v1). |
| `Published` | no | If `0`, the product is created as `isActive: false`. |
| `Is featured?` | no | Maps to `isFeatured`. |
| `Visibility in catalog` | no | `hidden` → `isActive: false`. |
| `Short description` | no | |
| `Description` | yes | Falls back to short description if missing. |
| `In stock?` | no | `0` → stock = 0. |
| `Stock` | no | Defaults to 0 if blank. |
| `Regular price` | yes | Decimal dollars. Converted to integer cents. |
| `Sale price` | no | Decimal dollars. |
| `Categories` | no | WooCommerce uses `>` for hierarchy and `,` for multiple, e.g. `"Engines > JDM Engines, Performance"`. The importer takes the **last leaf** of the first listed category as the product's category. If the category slug doesn't exist in your store, it's **auto-created** under the matching display order. |
| `Tags` | no | (ignored in v1) |
| `Images` | no | Comma-separated full URLs. The importer **downloads each, uploads to your Cloudinary**, and stores the resulting `secure_url` + `public_id` in `ProductImage`. |
| `Brands` | no | Custom Woo field if you used the Brands plugin. Maps to `Product.brand`. |

If your CSV has different column names, the script will print which ones it found and which were missing — adjust before running the full import.

## What the script does

For each row:

1. Skip if `Type` is `variation` (parent products only in v1)
2. Resolve / create the `Category` based on the first listed Woo category
3. Find existing `Product` by SKU — update if found, create if new (so the import is idempotent and re-runnable)
4. For each image URL: fetch the image, upload to Cloudinary in folder `revparts/products`, store the result as a `ProductImage` row
5. Log a single line per product: `[ 12 / 187] OK  sku=XYZ name="Honda K20A engine" imgs=3`

## Safety

- **Dry run first.** `npm run import:dry-run` parses the CSV and prints what *would* happen, without writing to Prisma or Cloudinary.
- **Idempotent.** Re-running the import updates existing products by SKU rather than duplicating.
- **No deletes.** The script never deletes products you already have. If a SKU was removed from the old site, it stays in your new store until you delete it manually.

## After import

- Open `/admin/products` — you should see all imported products. Use the inline **Active / Featured / Hot deal** toggles to publish them to the home page.
- Open the public site — products will show on `/shop`, the home page (if marked Featured), and on category pages.
