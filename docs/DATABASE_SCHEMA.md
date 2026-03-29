# Database Schema Documentation

## Manual Image Management Workflow

Since we've moved from automated image uploads to manual management, here's how to handle images:

### 1. Upload Images to Supabase Storage

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to Storage > project-images bucket
3. Upload your images manually
4. Copy the public URL for each image

### 2. Projects Table Schema

The `projects` table uses the following structure:

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Auto-generated primary key |
| title | text | Project title |
| slug | text | URL-friendly slug |
| category | text | Project category |
| technology | text[] | Array of technologies used |
| description | text | Short description |
| long_description | text | Detailed description |
| challenge | text | Project challenge |
| solution | text | Solution provided |
| results | text[] | Array of results achieved |
| features | text[] | Array of project features |
| **images** | **jsonb** | **Array of image objects (see format below)** |
| duration | text | Project duration |
| team_size | integer | Number of team members |
| client_type | text | Type of client |
| live_url | text | Live project URL |
| github_url | text | GitHub repository URL |
| is_published | boolean | Whether project is published |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |
| testimonial | jsonb | Client testimonial object |

### 3. Images Field Format

The `images` field should be a JSONB array with the following structure:

```json
[
  {
    "id": 1,
    "alt": "Project homepage screenshot",
    "url": "https://fmwzrgjfxgxnnislysya.supabase.co/storage/v1/object/public/project-images/your-image-name.jpg",
    "caption": "Modern homepage design with clean UI"
  },
  {
    "id": 2,
    "alt": "Dashboard interface",
    "url": "https://fmwzrgjfxgxnnislysya.supabase.co/storage/v1/object/public/project-images/another-image.png",
    "caption": "Admin dashboard showing analytics"
  }
]
```

#### Required Fields:
- `id`: Unique number within the project (1, 2, 3, etc.)
- `url`: Full public URL from Supabase Storage
- `alt`: Alt text for accessibility

#### Optional Fields:
- `caption`: Description of the image

### 4. How to Add Images Manually

1. **Upload to Storage**: Upload your images to the `project-images` bucket in Supabase
2. **Get Public URLs**: Copy the public URL for each image
3. **Update Database**: In the projects table, update the `images` field with the JSONB format above

### 5. Example SQL Update

```sql
UPDATE projects 
SET images = '[
  {
    "id": 1,
    "alt": "Homepage design",
    "url": "https://fmwzrgjfxgxnnislysya.supabase.co/storage/v1/object/public/project-images/homepage.jpg",
    "caption": "Clean modern homepage"
  },
  {
    "id": 2,
    "alt": "Mobile view",
    "url": "https://fmwzrgjfxgxnnislysya.supabase.co/storage/v1/object/public/project-images/mobile.jpg",
    "caption": "Responsive mobile design"
  }
]'::jsonb
WHERE id = 1;
```

### 6. Authentication

- **Admin Email**: admin@rapidxtech.com
- **Password**: Admin@RapidXTech1
- **Authentication**: Uses Supabase Auth (no more hardcoded credentials)

### 7. Field Naming Convention

The database uses snake_case for field names:
- `is_published` (not `isPublished`)
- `long_description` (not `longDescription`)
- `team_size` (not `teamSize`)
- `created_at` (not `createdAt`)
- `updated_at` (not `updatedAt`)

This ensures consistency with PostgreSQL conventions and Supabase auto-generated timestamps.

## Blog Images Management

### Blog Posts Table Schema

The `blog_posts` table now uses the same image management approach as projects:

| Field | Type | Description |
|-------|------|-------------|
| images | **jsonb** | **Array of image objects (same format as projects)** |
| image_prompts | **jsonb** | **Array of AI image prompt strings (for manual image generation)** |

### Blog Images Format

The `images` field uses the exact same JSONB format as projects:

```json
[
  {
    "id": 1,
    "alt": "Featured blog image",
    "url": "https://fmwzrgjfxgxnnislysya.supabase.co/storage/v1/object/public/blog-images/blog-featured.jpg",
    "caption": "Main blog post illustration"
  },
  {
    "id": 2,
    "alt": "Content image",
    "url": "https://fmwzrgjfxgxnnislysya.supabase.co/storage/v1/object/public/blog-images/content-image.jpg",
    "caption": "Supporting diagram"
  }
]
```

### Blog Image Workflow

1. **Upload images** to the `blog-images` bucket in Supabase Storage
2. **Copy URLs** from Supabase dashboard
3. **Add blog post** in CMS with image management UI
4. **Paste URLs** in the ImageManager component
5. **First image** is used as featured image for blog cards/previews

### Storage Organization

- **Projects**: `project-images` bucket
- **Blog Posts**: `blog-images` bucket
- **Folder structure**: Organized by upload date (YYYY-MM/filename)

### Migration from Old Schema

If you have existing blog posts with the old `image:varchar` field, use the migration script at `scripts/migrate-blog-images.js` to convert them to the new format.
