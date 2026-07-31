# 🏺 ASTHA Interior Studio

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9.7-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)]()

A modern, high-performance luxury interior design studio website and custom Content Management System (CMS) built for **Astha Interior Studio**. Designed with a bespoke **cardboard & kraft-paper aesthetic theme**, smooth physics-driven scroll animations, a dynamic project portfolio, an interactive client inquiry system, and a robust admin management portal.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Folder Structure](#-folder-structure)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
- [Database Schema](#-database-schema)
- [API Routes](#-api-routes)
- [NPM Scripts](#-npm-scripts)
- [Deployment](#-deployment)

---

## 📖 Overview

**Astha Interior Studio** is a digital platform tailored for a high-end luxury residential, commercial, villa, and architectural interior design studio. The web application features:

- **Bespoke Kraft-Paper Design System**: Organic paper-textured backgrounds, warm luxury earth tones (`#C5A880`, `#5C4B3A`, `#1C1C1C`), and high-contrast typography.
- **Fluid Micro-Interactions**: Lenis smooth scrolling combined with GSAP scroll-triggered animations and Framer Motion page transitions.
- **Custom Admin Portal**: Complete in-house CMS allowing studio administrators to manage portfolio projects, studio branding & SEO settings, read incoming contact messages, and modify admin security credentials.

---

## 🛠 Tech Stack

### Frontend & Core
- **Framework**: [Next.js 16.2.10](https://nextjs.org/) (App Router)
- **UI Library**: [React 19.2.4](https://react.dev/) & React DOM 19.2.4
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)

### Styling & Design System
- **CSS Engine**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss`
- **Utilities**: `clsx` (v2.1.1), `tailwind-merge` (v3.6.0)
- **Icons & Alerts**: [Lucide React](https://lucide.dev/) (v1.24.0), [Sonner](https://sonner.emilkowal.ski/) (v2.0.7)

### Animations & Motion Physics
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/) (v1.3.25)
- **Scroll Effects**: [GSAP](https://greensock.com/gsap/) (v3.15.0) & `@gsap/react` (v2.1.2)
- **Component Motion**: [Framer Motion](https://www.framer.com/motion/) (v12.42.2)

### Backend, Database & Cloud Media
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 9.7.4](https://mongoosejs.com/)
- **Media Storage**: [Cloudinary SDK](https://cloudinary.com/) (v2.10.0)
- **Security & Authentication**: `jsonwebtoken` (v9.0.3) for httpOnly JWT cookie auth, `bcryptjs` (v3.0.3) for password hashing
- **Schema Validation**: [Zod](https://zod.dev/) (v4.4.3)

---

## ✨ Key Features

### 🏛 Public Studio Website
- **Home Page (`/`)**: Hero section featuring luxury copy, interactive project showcase, live studio statistics, craftsmanship highlights, client testimonials, and process workflow.
- **About Studio (`/about`)**: Deep dive into studio philosophy, design values, statistics breakdown, and background kraft-paper design system.
- **Services Overview (`/services`)**: Full service breakdown covering Residential, Commercial, Villa Design, Custom Furniture, Renovation, and Architectural Planning.
- **Portfolio & Filter Grid (`/projects`)**: Real-time category filter (Residential, Commercial, Office, Villa, Apartment, Restaurant, Hotel, Renovation, Custom) with responsive grid cards.
- **Project Details (`/projects/[slug]`)**: Dynamic server-rendered project page featuring high-res featured image, client details, completion timeline, area specifications, services tags, and lightbox gallery.
- **Contact & Inquiry System (`/contact`)**: Interactive inquiry form with project selection, real-time toast feedback via Sonner, studio contact metadata, and interactive Google Maps embed.

### 🔐 Protected Admin Portal (`/admin`)
- **JWT & Brute-Force Protected Auth**: Secured cookie authentication (`admin_token`), automatic redirect middleware (`src/middleware.ts`), and IP-based brute-force tracking (`FailedLogin` model).
- **Dashboard (`/admin/dashboard`)**: Metric overview cards displaying total projects count, total inquiries count, and unread message indicators.
- **Project CMS (`/admin/projects`)**: Full CRUD interface to create, edit, draft, publish, archive, or delete portfolio items. Supports uploading featured and multiple gallery images directly to Cloudinary.
- **Studio Info & Dynamic SEO CMS (`/admin/studio-info`)**: Single-page management form to update company name, hero headers, about text, phone/email/address, social media links, stat counters, and meta SEO (title, description, keywords, Open Graph image, favicon).
- **Messages Inbox (`/admin/messages`)**: Inbox listing incoming client inquiries with read/unread status tracking, detailed modal view, and message deletion.
- **Admin Profile (`/admin/profile`)**: Manage email credentials and update access passwords with bcrypt hashing validation.

---

## 📁 Folder Structure

```
astha_interior_studio/
├── public/
│   ├── background.png               # Kraft paper texture asset
│   └── fevicon.png                  # Studio favicon icon
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (public pages)
│   │   │   ├── page.tsx             # Home Page
│   │   │   ├── about/page.tsx       # About Studio Page
│   │   │   ├── services/page.tsx    # Services Page
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx         # Projects Listing
│   │   │   │   ├── ProjectsFilterGrid.tsx
│   │   │   │   └── [slug]/page.tsx  # Project Details Page
│   │   │   └── contact/
│   │   │       ├── page.tsx         # Contact Page
│   │   │       └── ContactForm.tsx  # Interactive Contact Form
│   │   ├── admin/                   # Admin Portal Routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx             # Admin Entry Redirect
│   │   │   ├── login/page.tsx       # Admin Login Page
│   │   │   └── (protected)/
│   │   │       ├── layout.tsx
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── projects/        # Project Management CMS
│   │   │       │   ├── page.tsx
│   │   │       │   ├── ProjectsListTable.tsx
│   │   │       │   ├── new/page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       ├── studio-info/     # Studio Info & SEO CMS
│   │   │       │   ├── page.tsx
│   │   │       │   └── StudioInfoForm.tsx
│   │   │       ├── messages/        # Client Messages Inbox
│   │   │       │   ├── page.tsx
│   │   │       │   └── MessagesInbox.tsx
│   │   │       └── profile/         # Account Credentials CMS
│   │   │           ├── page.tsx
│   │   │           └── ProfileForm.tsx
│   │   ├── api/                     # REST API Routes
│   │   │   ├── admin/
│   │   │   │   ├── messages/[id]/route.ts
│   │   │   │   ├── profile/route.ts
│   │   │   │   ├── projects/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/route.ts
│   │   │   │   ├── studio-info/route.ts
│   │   │   │   └── upload/route.ts
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   ├── contact/route.ts
│   │   │   └── debug/db/route.ts
│   │   ├── error.tsx
│   │   ├── globals.css              # Design tokens & Kraft Paper theme
│   │   ├── layout.tsx               # Root Layout
│   │   ├── loading.tsx              # Loading skeleton / spinner
│   │   └── not-found.tsx            # Custom 404 page
│   ├── components/
│   │   ├── admin/                   # Admin UI Components
│   │   │   ├── ImageUpload.tsx      # Cloudinary drag & drop uploader
│   │   │   ├── ProjectForm.tsx      # Project creation/edit form
│   │   │   └── Sidebar.tsx          # Admin navigation sidebar
│   │   ├── shared/                  # Reusable Layout Components
│   │   │   ├── Footer.tsx           # Global Footer
│   │   │   ├── ImageGallery.tsx     # Lightbox gallery modal
│   │   │   ├── Navbar.tsx           # Global Header & Mobile Menu
│   │   │   ├── PageTransition.tsx   # Framer Motion page wrapper
│   │   │   ├── ProjectCard.tsx      # Portfolio card component
│   │   │   ├── ScrollAnimations.tsx # GSAP reveal controllers
│   │   │   └── SmoothScroll.tsx     # Lenis provider setup
│   │   └── ui/                      # Kraft Paper UI Elements
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Container.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── SectionTitle.tsx
│   │       └── Textarea.tsx
│   ├── lib/
│   │   ├── auth.ts                  # JWT Verification & Cookie Signer
│   │   ├── cloudinary.ts            # Cloudinary Config & Upload Stream
│   │   ├── db.ts                    # Mongoose Connection & Admin Seeder
│   │   ├── utils.ts                 # Classname merger (`cn`) & formatters
│   │   └── models/                  # Mongoose Schemas
│   │       ├── Admin.ts
│   │       ├── ContactMessage.ts
│   │       ├── FailedLogin.ts
│   │       ├── Project.ts
│   │       └── StudioInfo.ts
│   └── middleware.ts                # Route Guard Middleware
├── .env.example                     # Environment Configuration Template
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## 🔑 Environment Variables

To run the application locally or in production, configure a `.env.local` file based on `.env.example`:

| Environment Variable | Required | Description |
| :--- | :---: | :--- |
| `MONGODB_URI` | **Yes** | MongoDB connection URI string (MongoDB Atlas or local instance). |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Cloudinary Cloud Name for storing studio & project images. |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API Key. |
| `CLOUDINARY_API_SECRET` | **Yes** | Cloudinary API Secret Key. |
| `JWT_SECRET` | **Yes** | Secret string (min 32 chars) for signing admin auth cookies (`admin_token`). |
| `INITIAL_ADMIN_EMAIL` | Optional | Initial email used by auto-seeder to create default admin account. |
| `INITIAL_ADMIN_PASSWORD` | Optional | Initial password used by auto-seeder to create default admin account. |

---

## ⚡ Installation & Setup

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **Package Manager**: `npm` (v9+)
- **MongoDB**: Local MongoDB server or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Cloudinary**: Free or paid Cloudinary account

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ErMeetkanteliya/astha_interior_studio.git
   cd astha_interior_studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and populate your MongoDB URI, Cloudinary credentials, and JWT secret key.

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Access the web application at [http://localhost:3000](http://localhost:3000).

5. **Access the Admin Portal**
   Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login). Use the credentials set in `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` (defaults to `admin@asthainterior.com` / `AdminPassword123!`).

---

## 🗄 Database Schema

The database relies on **Mongoose** models located in `src/lib/models/`:

### 1. `StudioInfo` Schema (`StudioInfo.ts`)
Stores studio branding details, homepage copy, contact information, social handles, stats counters, and SEO metadata.
```ts
{
  companyName: String, // Default: "ASTHA"
  logo: { url: String, publicId: String },
  heroImage: { url: String, publicId: String },
  heroTitle: String,
  heroSubtitle: String,
  aboutTitle: String,
  aboutSubtitle: String,
  aboutDescription: String,
  aboutImage: { url: String, publicId: String },
  phone: String,
  email: String,
  address: String,
  googleMapsUrl: String,
  instagram: String,
  facebook: String,
  pinterest: String,
  linkedin: String,
  footerCopyright: String,
  seoTitle: String,
  seoDescription: String,
  seoKeywords: String,
  openGraphImage: { url: String, publicId: String },
  favicon: { url: String, publicId: String },
  stat1Value: String, stat1Label: String,
  stat2Value: String, stat2Label: String,
  stat3Value: String, stat3Label: String,
  stat4Value: String, stat4Label: String
}
```

### 2. `Project` Schema (`Project.ts`)
Stores portfolio projects with categories, Cloudinary image references, and completion metadata.
```ts
{
  title: String, // Required
  slug: String, // Unique, indexed
  category: 'Residential' | 'Commercial' | 'Office' | 'Villa' | 'Apartment' | 'Restaurant' | 'Hotel' | 'Renovation' | 'Custom',
  location: String,
  shortDescription: String,
  fullDescription: String,
  featuredImage: { url: String, publicId: String },
  galleryImages: [{ url: String, publicId: String }],
  servicesUsed: [String],
  status: 'Draft' | 'Published' | 'Archived', // Default: 'Draft'
  completedDate: Date,
  clientName: String,
  area: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. `ContactMessage` Schema (`ContactMessage.ts`)
Stores client inquiry messages submitted through the `/contact` form.
```ts
{
  name: String,
  email: String,
  phone: String,
  projectType: 'Residential' | 'Commercial' | 'Office' | 'Villa' | 'Apartment' | 'Restaurant' | 'Hotel' | 'Renovation' | 'Custom',
  message: String,
  read: Boolean, // Default: false
  viewedAt: Date,
  createdAt: Date // Default: Date.now
}
```

### 4. `Admin` Schema (`Admin.ts`)
Stores admin login accounts with hashed passwords.
```ts
{
  email: String, // Unique
  password: String, // bcrypt hashed
  createdAt: Date
}
```

### 5. `FailedLogin` Schema (`FailedLogin.ts`)
Tracks failed login attempts by IP address for rate-limiting and account lockout security.
```ts
{
  email: String,
  ip: String,
  attempts: Number,
  blockedUntil: Date,
  lastAttempt: Date
}
```

---

## 📡 API Routes

| HTTP Method | Endpoint | Protection | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/contact` | Public | Submits a new client contact inquiry message. |
| `POST` | `/api/auth/login` | Public | Authenticates admin user, sets httpOnly `admin_token` cookie. |
| `POST` | `/api/auth/logout` | Public | Clears admin authentication cookie. |
| `GET` | `/api/admin/studio-info` | Admin | Fetches current studio info & SEO settings. |
| `PUT` | `/api/admin/studio-info` | Admin | Updates studio info & SEO settings. |
| `GET` | `/api/admin/projects` | Admin | Fetches list of projects. |
| `POST` | `/api/admin/projects` | Admin | Creates a new portfolio project. |
| `GET` | `/api/admin/projects/[id]` | Admin | Gets project details by ID. |
| `PUT` | `/api/admin/projects/[id]` | Admin | Updates existing project details. |
| `DELETE` | `/api/admin/projects/[id]` | Admin | Deletes project from database. |
| `GET` | `/api/admin/messages` | Admin | Retrieves all contact messages. |
| `PATCH` | `/api/admin/messages/[id]` | Admin | Marks contact message as read/unread. |
| `DELETE` | `/api/admin/messages/[id]` | Admin | Deletes contact message. |
| `POST` | `/api/admin/upload` | Admin | Uploads image files directly to Cloudinary. |
| `PUT` | `/api/admin/profile` | Admin | Updates admin email and password credentials. |
| `GET` | `/api/debug/db` | Public | Utility endpoint to check MongoDB connection status. |

---

## 📜 NPM Scripts

Commands defined in `package.json`:

| Command | Script | Description |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Launches the Next.js development server on `localhost:3000`. |
| `npm run build` | `next build` | Compiles and builds the production-optimized application. |
| `npm run start` | `next start` | Starts the production server using compiled build artifacts. |
| `npm run lint` | `eslint` | Executes ESLint to check for code quality and syntax issues. |

---

## 🚀 Deployment

The application is fully optimized for zero-configuration deployment on **Vercel** or any Node.js hosting platform (AWS, DigitalOcean, Render).

### Deploying to Vercel

1. Push your repository to **GitHub / GitLab / Bitbucket**.
2. Import the repository into your [Vercel Dashboard](https://vercel.com/new).
3. In **Project Settings** -> **Environment Variables**, add all environment variables listed in `.env.example`:
   - `MONGODB_URI`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `JWT_SECRET`
   - `INITIAL_ADMIN_EMAIL`
   - `INITIAL_ADMIN_PASSWORD`
4. Click **Deploy**. Vercel will automatically build (`npm run build`) and launch your application.

---

## 📄 License

This project is proprietary software for **Astha Interior Studio**. All rights reserved.
