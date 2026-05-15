# Magzineer: Premium Magazine Management System

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/State-Redux_Toolkit-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Framer Motion](https://img.shields.io/badge/Motion-Framer_Motion-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Framework-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/ODM-Mongoose-880000?logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-22B573?logo=minutemailer&logoColor=white)](https://nodemailer.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-FF6B6B?logo=react&logoColor=white)](https://recharts.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

Magzineer is a production-grade, full-stack magazine management system designed for premium editorial publishers running a network of magazines under one digital roof. The platform delivers a complete end-to-end reading experience — from a richly animated editorial homepage and a curated magazine network to a paywalled article reader with bookmark and reading-history tracking, secure Stripe-powered subscription and single-issue checkout, branded transactional emails, and a refined editorial light-theme UI. A dedicated admin panel offers full operational control over magazines, issues, articles (via a full React Quill rich-text editor with drag-and-drop article assignment), categories, subscription plans (auto-synced to Stripe Products + Prices), users, payments, contact messages, and analytics — including daily/weekly/monthly revenue reports exportable as a branded PDF.

---

# 🚀 Demo
 
Click the link below to see a demonstration of the Magzineer platform.
 
Link 👉 https://drive.google.com/file/d/1MsC4AATEZY36ftD-28o8maAPUnI7u4Gp/view?usp=sharing 👈
 
---

## ✨ Features

| Category | Features |
|---|---|
| Public Discovery | Animated editorial homepage with a Framer-Motion hero slider, featured magazines strip, latest-issues cover grid, trending articles by view count, three-up subscription plans preview with "most popular" highlight, testimonials carousel, and a wide editorial offer banner. |
| Authentication & Profiles | Secure JWT-based auth with HTTP-only cookies. Separate reader and admin login flows (admin credentials loaded from `.env`). Reader registration with optional Cloudinary-hosted profile photo upload. Profile management for name, email, photo, and password change. Auto-block enforcement on every request — blocked readers cannot log in. |
| Magazine Network | Network of multiple magazines — each with cover image, description, featured-on-homepage toggle, and active/inactive status. Public discovery pages support live search by magazine title and a clean grid layout. |
| Magazine Detail | Full editorial detail page with hero, "current issue" highlight card, latest publication date, archive of every published issue, and prominent subscribe CTA. |
| Issue Detail | Sticky sidebar with cover, magazine, publication date, and purchase or subscribe options. Full article listing showing thumbnails, titles, excerpts, author, reading time, and lock/unlock status per article. |
| Article Reading | Editorial article reader with eyebrow, large display title, italic standfirst, byline with reading time, hero image, sanitized rich-text rendering (DOMPurify), drop-cap excerpt fade for paywalled content, top reading-progress bar, bookmark + social share row, and same-magazine related-articles sidebar. |
| Paywall Logic | Articles tagged free or premium. Free articles always render in full. Premium articles render only when the reader has an active subscription OR has purchased the issue that owns the article. Access is recomputed server-side via the `canAccessArticle` helper on every detail request. |
| Global Search | Site-wide search across magazines and articles with debounced input, magazine + issue + category + date-range filters, paginated results, and URL-synced query string. |
| Subscription Plans | Plans comparison page lists every active plan side by side with feature lists and pricing. Stripe Checkout in subscription mode handles billing. Cancel-at-period-end, upgrade and downgrade flows are prorated automatically. Default plan can be selected by the admin and is surfaced to new users. |
| Single-Issue Purchases | Per-issue pricing (set 0 for free issues). One-time Stripe Checkout flow with deduplicated purchases — readers cannot buy the same issue twice. Purchased issues are remembered forever and grant access to every premium article inside that issue. |
| Stripe Webhook | Raw-body verified Stripe webhook handler routes `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`, and `invoice.payment_failed`. Webhook writes are idempotent — duplicate Stripe deliveries never double-charge or double-credit. |
| Branded Email Notifications | Automated light-themed editorial HTML emails for welcome on signup, subscription confirmation with renewal date, subscription cancellation, single-issue purchase receipt with order ID, contact-form acknowledgement to the user, and contact-form forwarding to the admin inbox. |
| Reader Dashboard | Authenticated readers get a six-page dashboard — Profile (with separate password tab), My Subscription (with cancel + upgrade/downgrade), My Purchases, Bookmarks, Reading History (with clear all), and Payment History. |
| Bookmarks & Reading History | Heart-style bookmark toggle on every article with instant optimistic updates via Redux. Reading history is automatically upserted on every article view, TTL-indexed to auto-prune after 90 days, and surfaced with "read X ago" timestamps. |
| Contact Form | Public contact page submits to a backend endpoint that stores the message in MongoDB, emails the admin a forwarded copy, and sends the user a branded acknowledgement reply — all in one request. |
| Admin Dashboard | Live KPIs (total magazines, issues, articles, readers, active subscribers, total revenue) plus revenue split by subscription vs single-issue, Recharts revenue-trend area chart and new-subscribers line chart over the last 14 days, and a recent-orders table of the latest 10 successful payments. |
| Magazine Management | Full CRUD for magazines with Cloudinary cover upload, animated featured-on-homepage toggle switch, and active/inactive status flip from the table. Deletion is protected when issues or articles still reference the magazine. |
| Issue Management | Per-magazine issue CRUD with cover upload, issue number, publication date, optional title, single-issue price (0 for free), and published/unpublished status. Bulk publish/unpublish toolbar appears when rows are selected. Drag-and-drop article assignment board `(@hello-pangea/dnd)` lets the admin shuffle articles between the unassigned pool and the issue. |
| Article Management | React Quill rich-text editor with header levels, bold/italic/underline/strike, blockquote, lists, alignment, link, and embedded image. Featured-image upload, author, magazine → issue cascade dropdown, category, reading time (auto-calculated from content at ~200 wpm or manual), access level (free/premium), and status (draft/published/scheduled with conditional date picker). Article preview modal renders the article exactly as readers will see it before publishing. |
| Category Management | CRUD for categories with image upload, auto-slug generation, and deletion protection when articles still reference them. |
| Subscription Plans Management | Plan CRUD that automatically syncs to Stripe — creating a Plan creates a Stripe Product and Price; editing price or duration creates a new Stripe Price (existing subscriptions keep their old price until renewal); deleting archives the Stripe Price. Toggle active/inactive, set "most popular" recommendation, and pick exactly one default plan. |
| User Management | Searchable, paginated reader list. Click into a reader to see their profile, subscription status, list of purchased issues with cover thumbnails, and bookmark count. One-click block/unblock — blocked users are immediately rejected on every authenticated request. |
| Payments & Orders | Three admin views — subscription-only ledger, single-issue-purchase-only ledger, and a combined Payments page with type + status + date range filters. Each row shows order ID, user, amount, status, and timestamp. |
| Analytics & Reports | Most-read articles bar chart, top-spenders leaderboard with avatars and lifetime totals, and a revenue report aggregable by daily, weekly, or monthly buckets with custom date range. Branded PDF revenue export streams directly to the browser via pdfkit — masthead, summary block, and full transaction table. |
| General Settings | Singleton settings document — site name, address, phone, email, logo (Cloudinary upload), and five social links (Facebook, Twitter, Instagram, LinkedIn, YouTube). Hydrates the public footer on every page. |
| Notifications | Real-time success and error feedback powered by React Toastify across the entire app — themed to match the editorial light palette. |

---

## 🛠️ Technologies Used

### Frontend (Client)
* **React 18:** Frontend library for building dynamic user interfaces.
* **Vite:** Lightning-fast dev server and bundler.
* **Tailwind CSS v4:** CSS-first utility framework with custom design tokens defined in `index.css` via the `@theme` directive — ivory, cream, charcoal, crimson, and warm-gold editorial palette.
* **Framer Motion:** Production-grade animation library powering page transitions, hero parallax, scroll reveals, modal entrances, mobile-drawer slide-ins, and micro-interactions.
* **Redux Toolkit & React-Redux:** Predictable state management for auth, magazines, articles, bookmarks, subscription, and global search.
* **React Router v7:** Client-side routing with nested layouts and route guards for protected and admin-only pages.
* **Axios:** HTTP client with global interceptors for cookie-based auth and friendly error toast messaging.
* **React Quill:** WYSIWYG rich-text editor with image embedding for the admin article composer.
* **DOMPurify:** XSS-safe HTML sanitization for rendering Quill-authored content on the reader-facing article pages.
* **Recharts:** Interactive charts on the admin dashboard and analytics page (revenue area, subscribers line, top-articles horizontal bar).
* **@hello-pangea/dnd:** Drag-and-drop board for assigning articles to issues.
* **React Hook Form + Yup:** Form state management with schema validation.
* **Stripe.js:** Browser-side Stripe primitives.
* **react-share:** Social share buttons (Facebook, Twitter, LinkedIn, WhatsApp) on every article page.
* **React Icons & React Toastify:** Icon library and toast notifications.
* **date-fns:** Date formatting throughout the editorial reading experience.

### Backend (Server) & Database
* **Node.js & Express.js:** Scalable backend runtime and web framework (ES modules).
* **MongoDB & Mongoose:** Document database with rich modeling, populated queries, compound indexes, text indexes for global search, partial unique indexes on completed purchases, and TTL-indexed reading history.
* **Bcrypt:** Secure password hashing.
* **JSON Web Token (JWT):** HTTP-only cookie-based authentication with admin role guards and per-request blocked-flag enforcement.
* **Multer:** Middleware for handling multipart/form-data file uploads (memory storage).
* **pdfkit:** Server-side PDF generation for revenue analytics reports.
* **Helmet, CORS, Morgan, Cookie-parser:** Security and middleware essentials.

### Third-Party Services
* **Stripe:** Hosted Checkout in both subscription and one-time payment modes. Webhook-verified subscription activation, renewal, cancellation, and single-issue access grants with idempotent event handling.
* **Cloudinary:** Cloud storage for user profile photos, magazine covers, issue covers, article featured images, embedded Quill images, category images, and site logo.
* **Nodemailer (SMTP):** Transactional emails for welcome, subscription confirmation/cancellation, single-issue receipts, and contact-form acknowledgements — all wrapped in a branded light-theme editorial HTML template.

---

## ⚙️ Installation & Setup

Clone the repository and navigate to the project folder to install dependencies.
```bash
  git clone https://github.com/MrTharinduDasantha/Magzineer.git
  cd Magzineer
```

**1. MongoDB Setup**

Before running the backend, set up your database:
* Sign in to [MongoDB Atlas](https://www.mongodb.com/).
* Create a new cluster and database named `magzineer_db`.
* Whitelist your IP address and create a database user.
* Copy the connection string — you will use it for the `MONGO_URI` environment variable in the next step.

> ℹ️ All required collections and indexes (including the TTL index on reading history and the text indexes on magazines and articles) are created automatically by Mongoose on first connection. The admin account is not stored as a regular user — admin credentials live in the server .env and the admin user record is auto-created in MongoDB on the first successful admin login.

**2. Cloudinary Setup**
 
* Sign up at [Cloudinary](https://cloudinary.com/) and grab your account's `CLOUDINARY_URL` from the dashboard.
* This single URL is used by the server for every image upload — profile photos, magazine covers, issue covers, article featured images, embedded article images, category images, and site logo.

**3. Server Deployment to Vercel & Stripe Webhook Setup**
 
Magzineer's Stripe webhook requires a publicly reachable HTTPS endpoint. The simplest way to obtain one during development is to deploy the server to Vercel for free.
 
1. Push the project to your GitHub account.
2. Sign in to [Vercel](https://vercel.com/) and import the repository.
3. Set the **Root Directory** to `server`, add environment variables relevant to the server (change NODE_ENV in those environment variables to production), and deploy. You will receive a live URL like `https://your-project.vercel.app`.
4. Open the [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/test/webhooks) and click **Add destination**.
5. Select to the following five events:
   * `checkout.session.completed`
   * `invoice.paid`
   * `invoice.payment_failed`
   * `customer.subscription.updated`
   * `customer.subscription.deleted`
6. Select destination type as **Webhook endpoint**
7. Add the **Endpoint URL** `https://your-project.vercel.app/api/stripe/webhook` and **Create destination**.
8. Then copy the **Signing secret** — this is your `STRIPE_WEBHOOK_SECRET`.
9. From [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys), copy your **Secret key** — this is your `STRIPE_SECRET_KEY`.

> ⚠️ Both keys must come from the **same Stripe environment** (test or live). Mixing them will cause webhook verification to fail.

**4. Server Setup (Backend)**
 
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```
 
**Environment Variables (Server)**
 
Create a `.env` file in the `server` folder and add the following configuration:
```bash
# ----- Server -----
PORT = 5000
NODE_ENV = development
CLIENT_URL = http://localhost:5173

# ----- MongoDB -----
MONGO_URI = "Enter your MongoDB connection string"

# ----- JWT / Auth -----
JWT_SECRET = magzineer_website_secret_key
JWT_EXPIRES_IN = 7d

# ----- Cloudinary -----
CLOUDINARY_URL = "Enter your Cloudinary URL"

# ----- Stripe -----
STRIPE_SECRET_KEY = "Enter your Stripe secret key"
STRIPE_WEBHOOK_SECRET = "Enter your Stripe webhook signing secret"

# ----- Email (SMTP via Nodemailer) -----
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = "Enter your SMTP email"
SMTP_PASS = "Enter your SMTP app password"
ADMIN_EMAIL = "Enter the inbox where contact-form messages should be forwarded"

# ----- Admin Credentials (for /admin login) -----
ADMIN_EMAIL_LOGIN = "Enter your admin login email"
ADMIN_PASSWORD_LOGIN = "Enter your admin login password"
```

> 📧 For Gmail SMTP, generate an [App Password](https://myaccount.google.com/apppasswords).

> 🔑 ADMIN_EMAIL_LOGIN and ADMIN_PASSWORD_LOGIN are the credentials used at /admin/login. They are checked directly against .env — there is no database admin to seed. On first successful login, a minimal admin user record is auto-created so admin actions can be attributed inside MongoDB.

**5. Client Setup (Frontend)**
 
Open a new terminal window, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```
 
**Environment Variables (Client)**
 
Create a `.env` file in the `client` folder and add the following configuration:
```bash
VITE_API_URL = "https://your-project.vercel.app/api"
```

> 💡 Use the live Vercel server URL for `VITE_API_URL` so Stripe webhooks can reach your backend in real time.

**6. Run the Application**
 
Start the backend server:
```bash
cd server
npm run server
```
 
Start the frontend development server:
```bash
cd client
npm run dev
```
 
Open `http://localhost:5173` in your browser.

---

## 💻 Usage
 
**Admin Workflow:**
 
1. Visit /admin/login and **sign in** with the admin credentials you configured in your server .env.

2. Open the **Dashboard** to view live KPIs (total magazines, issues, articles, readers, active subscribers, revenue split) and last-14-day analytics for revenue trend and new subscribers.

3. Visit **Settings** and configure the site name, address, phone, email, logo upload, and five social media URLs — these power the public footer everywhere.

4. Add **Categories** (Culture, Design, Travel, Food, etc.) — each with an image and short description. Categories are referenced by every article you create.

5. Add **Magazines** with title, cover image, description, featured-on-homepage toggle, and active/inactive status.

6. Inside each magazine, add **Issues** with issue number, publication date, optional title, cover image, single-issue price (set 0 to make it free), and published status.

7. Add **Subscription Plans** — name, description, duration in months, price, feature list, active toggle, and default-plan toggle. The plan is automatically created as a Stripe Product + Price in your Stripe dashboard.

8. Create **Articles** through the full-page article editor — title, excerpt, content via React Quill (with header levels, lists, blockquotes, links, embedded images), featured image, author, magazine → issue cascade, category, reading time (auto-calculated or manual), access level (free or premium), and status (draft / published / scheduled). Click Preview before publishing to see exactly how readers will see the article.

9. Use the **Issues** page's quick-assign buttons to open the drag-and-drop article assignment board for any issue — shuffle articles from the unassigned pool into the issue or back out.

10. Manage **Users** (search, paginate, view details, block/unblock), Subscriptions and Purchases ledgers, the combined Payments page (with type/status/date filters).

11. Open **Analytics** to view most-read articles, top-spending readers, and revenue aggregated daily/weekly/monthly. Export a branded PDF revenue report with one click.

**User Workflow:**
 
1. **Register** an account with name, email, password, and an optional profile photo. A branded welcome email arrives in your inbox automatically.

2. From the **home page**, browse the hero slider, featured magazines, latest issues, and trending articles — or use the global search bar in the navbar.

3. Open **Magazines** to browse the full library with debounced search, then click a magazine to see its current-issue highlight and the full archive of every published issue.

4. Open an **Issue** to see its full table of contents with thumbnail, title, excerpt, author, reading time, and lock/unlock badge per article. Free issues are fully readable for everyone; paid issues require either an active subscription or a single-issue purchase.

5. Open an **Article** to read it in an editorial layout — full-width hero, italic standfirst, byline, reading-progress bar at the top, and bookmark + share row. Free articles render in full. Premium articles render only when you're subscribed or have bought the issue — otherwise an animated paywall offers both the Subscribe and Buy Issue CTAs.

6. Visit **Subscribe** to compare all active plans side by side and choose Monthly, Annual, or Patron. Stripe Checkout opens for the secure payment.

7. On the **Issue Detail** page, click Buy Issue to purchase a single issue via Stripe Checkout — your access is granted the moment the Stripe webhook confirms payment.

8. Use **Search** for global discovery — query magazines and articles together with magazine, issue, category, and date-range filters and paginated results.

9. Access your **Reader Dashboard** anytime — **Profile** (edit name, email, photo, change password), **My Subscription** (current plan, renewal date, cancel, upgrade/downgrade), **My Purchases** (every issue you own), **Bookmarks** (save articles for later), **Reading History** (recently read with "X ago" timestamps), and **Payment History** (every receipt).

---

## 📸 Screenshots

### User Authentication (Register, Login)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%201.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%202.png)

### Public Homepage (Hero, Featured Magazines, Latest Issues, Trending, Plans, Testimonials)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%203.png)

### Magazine Discovery (All Magazines, Magazine Detail, Issue Detail)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%204.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%205.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%206.png)

### Article Reading (Free Article, Premium with Paywall, Bookmark)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%207.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%208.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%209.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2010.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2011.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2012.png)

### Global Search with Filters
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2013.png)

### Subscription Plans, Stripe Checkout & My Subscription
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2014.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2015.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2016.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2017.png)

### Static Pages (About, Contact, Privacy Policy)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2018.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2019.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2020.png)

### Reader Dashboard (Bookmarks, Reading History, Payment History & Not Found)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2021.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2022.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2023.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2024.png)

### Admin Login & Dashboard
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2025.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2026.png)

### Admin — Magazines
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2027.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2028.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2029.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2030.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2031.png)

### Admin — Issues & Drag-and-Drop Article Assignment
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2032.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2033.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2034.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2035.png)

### Admin — Articles & React Quill Editor with Preview
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2036.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2037.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2038.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2039.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2040.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2041.png)

### Admin — Categories
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2042.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2043.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2044.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2045.png)

### Admin — Subscription Plans
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2046.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2047.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2048.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2049.png)

### Admin — Users
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2050.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2051.png)

### Admin — Subscriptions, Purchases, & Payments
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2052.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2053.png)
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2054.png)

### Admin — Analytics & PDF Revenue Export
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2055.png)

### Admin — Settings
![image alt](https://github.com/MrTharinduDasantha/Magzineer/blob/ea13e3d7801cc9d83744d583be9737489e1caff8/client/src/assets/website/Img%20-%2056.png)

<h4 align="center"> Don't forget to leave a star ⭐️ </h4>
