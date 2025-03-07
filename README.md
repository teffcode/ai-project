# ChowMates 🍜🤝🏽 - Find Food Lovers Who Match Your Taste !

**ChowMates** is a powerful image-based search platform designed to connect food lovers with similar tastes. By leveraging advanced embeddings stored in PostgreSQL, our app enables users to find and discover like-minded individuals based on their food preferences.

## Key Features

- 🍽️ **Image-Based Search** – Upload a picture of your favorite dish and find others who love it too.  
- 🧠 **AI-Powered Recommendations** – Uses vector embeddings to deliver near-instant, highly relevant matches.
- 🚀 **Fast & Scalable** – Optimized with PostgreSQL for efficient, real-time search performance.  

ChowMates isn't just about food—it's about building connections through shared tastes and culinary experiences! 🍜✨

## Table of Contents

- [Key Features](#key-features)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
- [Environment Variables (.env.local)](#️environment-variables-envlocal)
- [Search Component Documentation](#search-component-documentation)
  - [Search Execution Flow](#search-execution-flow)
  - [Conditional UI Behavior](#conditional-ui-behavior)
  - [Components & Hooks Used](#components--hooks-used)
  - [Error Handling](#error-handling)
  - [Future Enhancements](#future-enhancements)
- [Image Similarity Search - Database Schema & Workflow](#️image-similarity-search---database-schema--workflow)
  - [Database Schema](#database-schema)
  - [Workflow: How It Works](#workflow-how-it-works)
- [Building for Production](#building-for-production)
- [WIP](#wip)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables `(.env.local)`

Before running the project, create a .env.local file in the root directory and add the following variables:

```
NEXT_PUBLIC_USERNAME=admin
NEXT_PUBLIC_PASSWORD=password123

DATABASE_URL=

AWS_S3_REGION=us-east-2
AWS_S3_ACCESS_KEY_ID=
AWS_S3_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=

HF_DATASET_API=
HF_ACCESS_TOKEN=
DATASET_NAME=
BATCH_SIZE=5
REQUESTS_PER_MINUTE=60
```

## Search Component Documentation

### Search Execution Flow
#### User Input & Processing
1. **User enters input** → `query` state is updated.
2. **Press Enter or upload an image** → `handleSearch()` function executes.
3. **Validation & Processing:**
   - If the query is a **valid image URL**, `fetchSimilarImagesByImageUrl()` is called.
   - If the query is a **website URL**, `fetchSimilarImagesByWebsite()` scrapes an image.
   - If the query is an **uploaded image**, `fetchSimilarImagesByImage()` is executed.
   - Otherwise, it assumes a **text-based search** and calls `fetchSimilarImagesByText()`.
4. **Results Display:**
   - Embeddings are displayed if available.
   - Scraped main image (if applicable) is shown.
   - Similar images are rendered in a grid layout.

### Conditional UI Behavior
- **If an embedding is generated**, it is displayed in a scrollable text box.
- **If a scraped image is found**, it is displayed alongside embeddings.
- **If similar images are retrieved**, they are displayed in a responsive grid.
- **If loading**, a spinner is displayed while fetching results.
- **If an error occurs**, an error message is shown to the user.

### Components & Hooks Used
#### Components:
- `<AuthGuard>`: Ensures authentication.
- `<UploadImage>`: Handles direct image uploads.
- `<LoadingSpinner>`: Displays a loading state.
- `<Image>` (from `next/image`): Optimizes image rendering.
- `<ErrorMessage>`: Displays errors encountered during search.

#### Hooks:
- `useSearchByText()` → Fetches embeddings & similar images via text.
- `useSearchByImage()` → Handles uploaded images.
- `useSearchByImageUrl()` → Processes image URLs.
- `useSearchByWebsite()` → Scrapes images from websites.

### Error Handling
- Invalid URLs are ignored with console errors.
- If no images are found, the results section remains empty.
- Unexpected errors in processing are caught and displayed via `<ErrorMessage>`.

### Future Enhancements
- Implement auto-suggestions for text search.
- Allow multi-image uploads.
- Improve error handling for failed image retrieval.
- Enhance UI with filters for search results.
- Optimize image similarity scoring for better matches.

---

## Image Similarity Search - Database Schema & Workflow

This project implements an image similarity search system using vector embeddings. Below is the database schema and workflow.

---

### **Database Schema**
We use **two tables** to efficiently manage images.

#### **1️⃣ `images` Table (Existing Image Database)**
Stores preprocessed images with their embeddings.

| Column      | Type            | Description |
|------------|----------------|-------------|
| `id`       | `SERIAL`        | Primary key |
| `image_url` | `TEXT`          | URL of the stored image |
| `embedding` | `VECTOR(512)`   | Embedding vector of the image (size depends on the model) |
| `metadata`  | `JSONB`         | Additional metadata (e.g., labels, categories) |

#### **2️⃣ `uploads` Table (User-Uploaded Images)**
Stores images uploaded by users before performing similarity searches.

| Column      | Type            | Description |
|------------|----------------|-------------|
| `id`       | `SERIAL`        | Primary key |
| `image_url` | `TEXT`          | URL of the uploaded image |
| `embedding` | `VECTOR(512)`   | Generated embedding for the uploaded image |
| `uploaded_at` | `TIMESTAMP`   | Upload timestamp |

---

### **Workflow: How It Works**
1️⃣ **A user uploads an image** → An embedding is generated and stored in the `uploads` table.  
2️⃣ **Find the most similar image in the database** → Compare embeddings in the `images` table using vector distance:  

```sql
SELECT id, image_url
FROM images
ORDER BY embedding <-> (SELECT embedding FROM uploads WHERE id = ?)
LIMIT 10;
```

---

## Building for Production

To build the application for production, run:

```bash
npm run build
````

Then, start the production server:

```bash
npm start
```

---

## WIP

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
