# 🍔 AI Project

## 🚀 Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚙️ Environment Variables `(.env.local)`

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

## 🏗️ Image Similarity Search - Database Schema & Workflow

This project implements an image similarity search system using vector embeddings. Below is the database schema and workflow.

### 📌 **Database Schema**
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

### 🔍 **Workflow: How It Works**
1️⃣ **A user uploads an image** → An embedding is generated and stored in the `uploads` table.  
2️⃣ **Find the most similar image in the database** → Compare embeddings in the `images` table using vector distance:  

```sql
SELECT id, image_url
FROM images
ORDER BY embedding <-> (SELECT embedding FROM uploads WHERE id = ?)
LIMIT 10;
```

## 📦 Building for Production

To build the application for production, run:

```bash
npm run build
````

Then, start the production server:

```bash
npm start
```

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
