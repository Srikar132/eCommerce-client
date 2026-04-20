# Cloudinary Image Upload Implementation

## Overview

This implementation adds Cloudinary image hosting for product images in the Nala Armoire e-commerce admin panel.

## Features

- ✅ Secure server-side upload (API secret never exposed to client)
- ✅ Drag & drop image upload
- ✅ Multiple images per product (up to 8)
- ✅ Automatic image optimization (WebP format, quality auto)
- ✅ Responsive image sizes generated automatically
- ✅ Set primary image with one click
- ✅ Reorder images via drag & drop
- ✅ Delete images from Cloudinary when removed
- ✅ Upload progress indicators
- ✅ Error handling with retry option

## Setup Instructions

### 1. Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. Navigate to your Dashboard → Settings → API Keys
3. Copy your Cloud Name, API Key, and API Secret

### 2. Configure Environment Variables

Add these variables to your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Install Dependencies

The Cloudinary SDK has been added to the project:

```bash
npm install cloudinary
```

## File Structure

```
lib/
  cloudinary.ts          # Cloudinary configuration and utility functions
app/api/upload/
  route.ts               # API route for image upload/delete
components/admin/
  image-upload.tsx       # Drag & drop image upload component
  product-form.tsx       # Redesigned product form with image upload
  delete-confirm-dialog.tsx  # Confirmation dialog for deletions
```

## API Endpoints

### POST /api/upload

Upload images to Cloudinary.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `files` - Array of image files

**Response:**
```json
{
  "success": true,
  "uploaded": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "nala-armoire/products/abc123",
      "width": 1200,
      "height": 1200,
      "format": "webp",
      "size": 45000,
      "originalName": "product.jpg"
    }
  ]
}
```

### DELETE /api/upload

Delete an image from Cloudinary.

**Query Parameters:**
- `publicId` - The Cloudinary public ID of the image
- OR `url` - The full Cloudinary URL (public ID will be extracted)

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

## Image Optimization

Images are automatically optimized on upload:

1. **Format**: Auto-converted to WebP for modern browsers
2. **Quality**: Automatically adjusted for optimal size/quality balance
3. **Size**: Limited to 1200x1200 max while maintaining aspect ratio
4. **Thumbnails**: 400x400 and 800x800 sizes generated asynchronously

## Database Schema

The existing `product_images` table is used:

```sql
product_images (
  id            TEXT PRIMARY KEY,
  product_id    TEXT REFERENCES products(id),
  image_url     TEXT NOT NULL,
  alt_text      TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary    BOOLEAN DEFAULT false,
  created_at    TIMESTAMP DEFAULT NOW()
)
```

## Security

- API secret is **never** exposed to the client
- All uploads go through server-side API route
- Admin authentication is required for uploads
- File type validation (only JPEG, PNG, WebP, GIF allowed)
- File size limit (5MB max per image)

## Usage in Product Form

The product form now includes a drag & drop image upload area:

```tsx
import { ImageUpload } from "@/components/admin/image-upload";

// In your component
<ImageUpload
  images={currentImages}
  onImagesChange={handleImagesChange}
  maxImages={8}
  disabled={isFormDisabled}
/>
```

## Admin Panel Font Update

The admin panel now uses **Inter** font (professional sans-serif) instead of decorative fonts:

```tsx
// app/(admin)/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-admin",
});
```

## Delete Confirmation Dialog

A reusable delete confirmation dialog has been added:

```tsx
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

<DeleteConfirmDialog
  open={deleteDialog.open}
  onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
  onConfirm={confirmDelete}
  title="Delete Variant"
  description="Are you sure you want to delete this variant?"
/>
```

## Troubleshooting

### Images not uploading

1. Check Cloudinary credentials in `.env.local`
2. Verify you're logged in as an admin
3. Check browser console for errors
4. Verify file size is under 5MB

### Module not found errors

If you see TypeScript errors about missing modules after install:

```bash
# Restart TypeScript server in VS Code
# Press Ctrl+Shift+P and run "TypeScript: Restart TS Server"

# Or restart your dev server
npm run dev
```

### Images not displaying

1. Check Cloudinary URL is valid
2. Verify image was uploaded successfully
3. Check Next.js Image component configuration

## Next.js Image Configuration

Add Cloudinary domain to `next.config.ts`:

```ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};
```
