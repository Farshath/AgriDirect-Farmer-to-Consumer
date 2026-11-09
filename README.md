# AgriDirect | Farmer-to-Consumer Agricultural Marketplace

> **A production-ready full-stack digital marketplace connecting local, verified farmers directly with conscious consumers.**  
> Eliminating middleman commission exploitation, providing 24-hour harvest-to-table freshness, and providing role-based portals for Farmers, Consumers, and Administrators.

---

## 🌾 Table of Contents
1. [Project Overview](#-project-overview)
2. [Technology Stack](#-technology-stack)
3. [Design System & Color Palette](#-design-system--color-palette)
4. [System Architecture & Roles](#-system-architecture--roles)
5. [Database Architecture & Mongoose Models](#-database-architecture--mongoose-models)
6. [RESTful API Endpoints](#-restful-api-endpoints)
7. [Getting Started & Local Setup](#-getting-started--local-setup)
8. [Demo Seed Credentials](#-demo-seed-credentials)
9. [Project Folder Structure](#-project-folder-structure)
10. [Deployment Guide](#-deployment-guide)

---

## 🚜 Project Overview

In traditional agriculture, up to 60% of retail produce prices go to intermediaries while produce sits in wholesale mandis and storage facilities for days. **AgriDirect** changes this dynamic:
- **Farmers** register their verified farm identities, set their own fair unit prices, manage live inventory, confirm dawn harvests, and receive 100% direct revenue disbursements.
- **Consumers** browse seasonal, chemical-free produce, filter by category and location, add items to their basket with free delivery options (for orders ₹500+), choose **Cash on Delivery (COD)**, track orders in real time across 6 fulfillment stages, and submit reviews.
- **Administrators** inspect farmer applications and land documents, approve/reject sellers with feedback, moderate crop listings, oversee orders, and view platform gross merchandise value (GMV) and Recharts analytics.

---

## 🛠 Technology Stack

### Frontend
- **Framework:** React.js 18 with Vite
- **Styling:** Tailwind CSS with custom Farm-to-Table agricultural color extensions and glowing accents
- **Routing:** React Router DOM v6 with role-based `ProtectedRoute` guards
- **Data Visualization:** Recharts (Monthly revenue trends, category distribution pie chart, top-selling crops bar chart)
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **HTTP Client:** Axios with JWT Bearer token interceptors

### Backend
- **Runtime:** Node.js (v20+ / v24)
- **Framework:** Express.js 4
- **Database:** MongoDB / MongoDB Atlas via Mongoose 8
- **Authentication:** JSON Web Tokens (JWT) with bcrypt password hashing
- **Security:** Helmet, CORS, and Express Rate Limiting
- **File Uploads:** Multer with local storage fallback and Cloudinary readiness
- **Database Fallback:** In-memory MongoDB Server fallback if local mongod is offline, ensuring zero installation downtime.

---

## 🎨 Design System & Color Palette

The entire interface follows an organic, farm-to-table aesthetic:

| Color Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Forest Green** | `#174D32` | Primary brand color, headers, hero backgrounds, primary buttons |
| **Leaf Green** | `#63A66B` | Accents, badges, active tab underlines, positive metrics |
| **Light Cream** | `#F7F8EF` | Warm organic page background, subtle section dividers |
| **Harvest Gold** | `#E5B64B` | Stars, accent badges, call-to-actions, highlighted metrics |
| **White** | `#FFFFFF` | Card surfaces, modals, table backgrounds |
| **Dark Text** | `#202B24` | High-contrast readable typography |

### Premium Button System
- **Primary Buttons (`.btn-primary`):** Forest green gradient (`#174D32` to `#27683E`), soft glowing shadow, hover elevation, smooth transitions.
- **Secondary Buttons (`.btn-secondary`):** White/transparent surface, emerald border (`#63A66B`), forest green text.
- **Gold Accent Buttons (`.btn-gold`):** Harvest gold gradient for primary merchant actions.
- **Danger Buttons (`.btn-danger`):** Clean rose red styling for deletions and rejections.

---

## 👥 System Architecture & Roles

### 1. Public Marketplace
- **Home Page:** Hero banner, category browser, popular harvests, verified farmers showcase, "How It Works" 4-step workflow, "Why Choose Us" soil health spotlight, customer testimonials, and newsletter subscription.
- **Shop Page:** Live product catalog with search, category tabs, 100% organic toggle, price sorting, stock indicators, and pagination.
- **Product Details:** High-res image gallery, harvest date, farmer bio card, available stock counter, quantity stepper, and customer reviews.
- **Farmer Directory:** Public directory of verified farmers with acreage, crop types, experience, and direct links to individual farm storefronts.
- **Information Pages:** About Us, How It Works, FAQ accordion, and Contact Us form.

### 2. Farmer Portal (`/farmer`)
- **Dashboard Overview:** Metric cards (Total Products, Active Products, Total Orders, Pending Orders, Completed Orders, Total Earnings, Farm Rating) + Recharts monthly sales chart.
- **My Products:** Grid and table view of listed crops with quick edit and deletion modal.
- **Add & Edit Product:** Form with crop name, description, category selector, unit price in ₹, selling unit (kg, gram, bunch, dozen, litre, box), stock quantity, organic toggle, and harvest date.
- **Manage Inventory:** Live inventory management table with quick stock quantity updater and low stock alert warnings.
- **Incoming Orders:** Orders table with customer address and phone, items ordered, and order stage updater (Pending -> Confirmed -> Processing -> Ready for Delivery -> Shipped -> Delivered -> Cancelled).
- **Earnings Hub:** Weekly direct bank settlement information and sales breakdown per order.
- **Farm Profile:** Farm name, location, district, state, acreage, farming method, and story editor.
- **Settings:** Password change and security preferences.

### 3. Customer Portal
- **Basket (`/cart`):** Live cart with quantity steppers, item removal, free delivery threshold indicator (orders ₹500+ get free shipping).
- **Checkout (`/checkout`):** Delivery address collection (Name, Phone, Street, City, District, State, Pincode, Notes), Cash on Delivery (COD) payment method with expandable online gateway placeholder.
- **Order Confirmation (`/order-success/:id`):** Celebration screen with unique order number (e.g. `AGRI-2026-XXXX`) and estimated arrival.
- **My Orders (`/customer/orders`):** Order history with status badges, date, items, and link to track.
- **Order Tracking (`/customer/orders/:id`):** Step-by-step progress timeline with timestamps and farmer dispatch notes.
- **Reviews:** Customers who purchased a product can submit 1-5 star ratings and reviews.

### 4. Administrator Portal (`/admin`)
- **Platform Overview:** Real-time platform metrics (Total Farmers, Verified, Pending, Total Consumers, Total Crops, Total Orders, Fulfilment Rate, Gross Sales GMV) + 6-month GMV line chart.
- **Farmer Verification Queue:** Audit applications, inspect land and farming documents, 1-click Approve, or Reject with custom reason feedback.
- **All Farmers:** Directory of all registered farmers with account activation/deactivation toggles.
- **Customer Directory:** Registered consumer accounts and total order volumes.
- **Crop Moderation:** Hide or remove inappropriate listings across the marketplace.
- **Master Orders:** All platform orders with status filter and administrative overrides.
- **Advanced Analytics:** Category distribution pie chart, top-selling produce bar chart, and revenue metrics.
- **Platform Settings:** Delivery fee thresholds, courier charges, and 0% commission enforcement.

---

## 🗄 Database Architecture & Mongoose Models

1. **User:** `name`, `email`, `password` (bcrypt), `role` (`FARMER`, `CUSTOMER`, `ADMIN`), `phone`, `avatar`, `isActive`, `timestamps`.
2. **FarmerProfile:** `user` (ref), `farmName`, `farmLocation`, `district`, `state`, `pincode`, `farmDescription`, `farmingMethod`, `cropTypes`, `experienceYears`, `totalAreaAcres`, `profileImage`, `coverImage`, `verificationStatus` (`PENDING`, `APPROVED`, `REJECTED`), `rejectionReason`, `documents`, `rating`, `numReviews`.
3. **Category:** `name`, `slug`, `description`, `image`, `icon`, `isActive`.
4. **Product:** `farmer` (ref), `name`, `slug`, `description`, `category` (ref), `price`, `unit`, `availableQuantity`, `minOrderQuantity`, `images`, `isOrganic`, `harvestDate`, `farmLocation`, `state`, `district`, `isActive`, `isApproved`, `tags`, `rating`, `numReviews`.
5. **Cart:** `user` (ref), `items: [{ product, quantity, priceAtAddition }]`.
6. **Order:** `orderNumber` (unique `AGRI-YYYY-XXXXXX`), `customer` (ref), `items: [{ product, farmer, name, price, quantity, unit, image }]`, `deliveryAddress`, `paymentMethod` (`COD`, `ONLINE`), `paymentStatus` (`PENDING`, `PAID`), `subtotal`, `deliveryCharge`, `totalAmount`, `orderStatus` (`Pending`, `Confirmed`, `Processing`, `Ready for Delivery`, `Shipped`, `Delivered`, `Cancelled`), `orderNotes`, `statusHistory: [{ status, timestamp, note }]`.
7. **Review:** `user` (ref), `product` (ref), `farmer` (ref), `rating` (1-5), `comment`, `isVerifiedPurchase`.
8. **Notification:** `recipient` (ref), `sender` (ref), `title`, `message`, `type` (`ORDER`, `VERIFICATION`, `SYSTEM`), `link`, `isRead`.
9. **Address:** `user` (ref), `fullName`, `phone`, `street`, `city`, `district`, `state`, `pincode`, `isDefault`.
10. **Dispute:** `order` (ref), `raisedBy` (ref), `farmer` (ref), `reason`, `description`, `status` (`OPEN`, `RESOLVED`).

---

## 📡 RESTful API Endpoints

### Authentication
- `POST /api/auth/register` - Register customer or farmer
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Get current session
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Update password
- `POST /api/auth/logout` - Logout

### Public Produce & Farmers
- `GET /api/products` - Catalog with search, category, organic filter, sorting & pagination
- `GET /api/products/:id` - Product details with farmer & reviews
- `GET /api/farmers` - Verified farmer directory
- `GET /api/farmers/:id` - Public farm storefront & crops
- `GET /api/categories` - List active categories

### Customer Cart & Orders
- `GET /api/cart` - View shopping basket
- `POST /api/cart` - Add crop to basket
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item
- `POST /api/orders` - Place order (validates stock, deducts inventory, creates notification)
- `GET /api/orders/my-orders` - Customer order history
- `GET /api/orders/:id` - Live order tracking & timeline
- `POST /api/reviews` - Submit review for crop & farmer

### Farmer Management
- `GET /api/farmers/dashboard` - Real data metrics & monthly sales
- `GET /api/products/farmer/my-products` - List farmer's crops
- `POST /api/products` - Publish new crop listing
- `PUT /api/products/:id` - Edit crop listing
- `DELETE /api/products/:id` - Delete crop listing
- `PATCH /api/products/:id/stock` - Quick stock & active status update
- `GET /api/orders/farmer-orders` - Orders received by farmer
- `PUT /api/orders/:id/status` - Update harvest fulfillment stage
- `PUT /api/farmers/profile` - Update farm story & details

### Administration
- `GET /api/admin/dashboard` - Platform GMV, orders, fulfilment rate & trends
- `GET /api/admin/farmers` - Roster with verification filters
- `PUT /api/admin/farmers/:id/approve` - Approve farmer application
- `PUT /api/admin/farmers/:id/reject` - Reject farmer with reason
- `GET /api/admin/customers` - Consumer directory with order counts
- `GET /api/admin/orders` - Master platform orders
- `GET /api/admin/analytics` - Category breakdown & top-selling crops
- `PUT /api/admin/users/:id/toggle-status` - Activate / suspend accounts

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- Node.js (v18, v20, or v24 recommended)
- npm or pnpm
- MongoDB Atlas URI or Local MongoDB instance (optional: auto-spins in-memory MongoDB if offline)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/Farmer-to-Consumer.git
cd Farmer-to-Consumer

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5050
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Optional: MongoDB Atlas URI. If omitted or unreachable, backend auto-spins an in-memory MongoDB!
MONGODB_URI=mongodb://127.0.0.1:27017/agri_marketplace

JWT_SECRET=agri_marketplace_super_secret_jwt_key_2026_farm_to_table_secure
JWT_EXPIRES_IN=7d

# Optional Cloudinary (for cloud images; falls back to local uploads if empty)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Run the Backend Server
```bash
cd backend
npm run dev
# Or: npm start
```
*Backend runs on `http://localhost:5050` with health check at `http://localhost:5050/api/health`.*

### 4. Run the Frontend Development Server
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173` with instant hot-reloading.*

---

## 🔑 Demo Seed Credentials

The application auto-seeds sample accounts on startup. You can also use the **1-Click Demo Login** buttons on the Login page:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@agrimarket.com` | `Admin@12345` | System Admin (Full Platform Control) |
| **Farmer (Approved)** | `farmer.rajesh@agrimarket.com` | `Farmer@12345` | Rajesh Patil (Green Harvest Organics, Nashik) |
| **Farmer (Approved)** | `farmer.anita@agrimarket.com` | `Farmer@12345` | Anita Sharma (Vedic Valley Dairy, Pune) |
| **Farmer (Pending)** | `farmer.suresh@agrimarket.com` | `Farmer@12345` | Suresh Kumar (Surya Nature Agro, Satara) |
| **Customer** | `customer.priya@agrimarket.com` | `Customer@12345` | Priya Deshmukh (Pune Resident) |
| **Customer** | `customer.rahul@agrimarket.com` | `Customer@12345` | Rahul Verma (Mumbai Resident) |

---

## 📁 Project Folder Structure

```
Farmer-to-Consumer/
├── package.json                   # Root orchestrator scripts
├── .env.example                   # Root environment template
├── README.md                      # Complete documentation
├── backend/
│   ├── package.json               # Backend dependencies
│   ├── .env                       # Backend active environment
│   ├── .env.example               # Backend template
│   ├── uploads/                   # Local image storage folder
│   └── src/
│       ├── config/
│       │   └── db.js              # Robust Mongoose connection with Atlas & fallback
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── farmerController.js
│       │   ├── productController.js
│       │   ├── categoryController.js
│       │   ├── cartController.js
│       │   ├── orderController.js
│       │   ├── adminController.js
│       │   ├── reviewController.js
│       │   └── notificationController.js
│       ├── middlewares/
│       │   ├── authMiddleware.js   # JWT token protection
│       │   ├── roleMiddleware.js   # FARMER, CUSTOMER, ADMIN RBAC
│       │   ├── errorMiddleware.js  # Centralized error handler
│       │   └── uploadMiddleware.js # Multer image configuration
│       ├── models/
│       │   ├── User.js
│       │   ├── FarmerProfile.js
│       │   ├── Category.js
│       │   ├── Product.js
│       │   ├── Cart.js
│       │   ├── Order.js
│       │   ├── Review.js
│       │   ├── Notification.js
│       │   ├── Address.js
│       │   └── Dispute.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── farmerRoutes.js
│       │   ├── productRoutes.js
│       │   ├── categoryRoutes.js
│       │   ├── cartRoutes.js
│       │   ├── orderRoutes.js
│       │   ├── adminRoutes.js
│       │   ├── reviewRoutes.js
│       │   ├── notificationRoutes.js
│       │   └── uploadRoutes.js
│       ├── seeds/
│       │   ├── autoSeed.js        # Automatic seed when database is clean
│       │   └── seedData.js        # Standalone seed runner
│       ├── utils/
│       │   └── helpers.js         # JWT & order number generators
│       └── server.js              # Express application entrypoint
└── frontend/
    ├── package.json               # Frontend dependencies
    ├── vite.config.js             # Vite proxy and build configuration
    ├── tailwind.config.js         # Agricultural theme colors & shadows
    ├── postcss.config.js
    ├── index.html                 # HTML shell with Google Fonts
    └── src/
        ├── api/
        │   ├── axiosClient.js     # Axios interceptors with Bearer token
        │   └── index.js           # Clean modular API service methods
        ├── context/
        │   ├── AuthContext.jsx    # Session & RBAC state
        │   ├── CartContext.jsx    # Basket, total, and quantities
        │   └── NotificationContext.jsx # Live notifications
        ├── components/
        │   ├── common/
        │   │   ├── Button.jsx     # Primary glowing, secondary & danger buttons
        │   │   ├── Badge.jsx      # Organic, verification & status badges
        │   │   ├── Loader.jsx     # Farm sprout animation & skeletons
        │   │   ├── EmptyState.jsx # Clean empty states
        │   │   ├── Modal.jsx      # Accessible dialogs
        │   │   └── StarRating.jsx # Interactive 5-star rating
        │   ├── layout/
        │   │   ├── Navbar.jsx     # Navigation, basket badge, user menu
        │   │   ├── Footer.jsx     # Farm-to-Table values & directory links
        │   │   ├── MainLayout.jsx # Public & customer shell
        │   │   └── DashboardLayout.jsx # Farmer & Admin sidebar layout
        │   └── cards/
        │       ├── ProductCard.jsx# Produce showcase with price, stock, organic tag
        │       ├── FarmerCard.jsx # Farm profile card with verification shield
        │       └── StatCard.jsx   # Dashboard KPI metric cards
        ├── pages/
        │   ├── public/
        │   │   ├── Home.jsx       # Hero, categories, popular harvests, testimonials
        │   │   ├── Shop.jsx       # Filterable catalog with search & pagination
        │   │   ├── ProductDetail.jsx # Image gallery, description, reviews & buy box
        │   │   ├── FarmerDirectory.jsx # All verified producers
        │   │   ├── FarmerDetail.jsx # Storefront for specific farm
        │   │   ├── About.jsx      # Story & soil health commitments
        │   │   ├── HowItWorks.jsx # 4-step consumer & farmer workflows
        │   │   ├── FAQ.jsx        # Interactive accordion
        │   │   ├── Contact.jsx    # Inquiry form & hub helplines
        │   │   ├── Login.jsx      # Sign in with 1-click demo buttons
        │   │   └── Register.jsx   # Multi-role consumer / farmer registration
        │   ├── customer/
        │   │   ├── CartPage.jsx   # Basket items & free delivery progress
        │   │   ├── CheckoutPage.jsx # Address, COD payment, order placement
        │   │   ├── OrderSuccessPage.jsx # Order confirmed congratulation
        │   │   ├── CustomerOrders.jsx # Purchase history
        │   │   └── OrderTrackingPage.jsx # 6-stage visual timeline & transit notes
        │   ├── farmer/
        │   │   ├── FarmerOverview.jsx # Sales chart & top KPI metrics
        │   │   ├── FarmerProducts.jsx # Crop catalog with CRUD operations
        │   │   ├── AddEditProduct.jsx # Publish / update listing
        │   │   ├── FarmerInventory.jsx# Live stock updater & alerts
        │   │   ├── FarmerOrders.jsx   # Harvest order status updates
        │   │   ├── FarmerEarnings.jsx # Revenue audits & settlement rules
        │   │   ├── FarmerProfile.jsx  # Farm dossier & verification editor
        │   │   └── FarmerSettings.jsx # Security credentials
        │   └── admin/
        │       ├── AdminOverview.jsx  # Platform GMV & verification alerts
        │       ├── AdminFarmerVerification.jsx # Inspect dossier, Approve, Reject
        │       ├── AdminFarmers.jsx   # Producer roster & account status
        │       ├── AdminCustomers.jsx # Consumer accounts & order counts
        │       ├── AdminProducts.jsx  # Marketplace listings moderation
        │       ├── AdminOrders.jsx    # Master orders & status override
        │       ├── AdminAnalytics.jsx # Recharts pie & bar analytics
        │       └── AdminSettings.jsx  # Delivery rules & 0% commission lock
        ├── routes/
        │   ├── AppRoutes.jsx      # Route map
        │   └── ProtectedRoute.jsx # Role-based route guard
        ├── App.jsx                # Toast config & provider wrapping
        ├── main.jsx               # React entrypoint
        └── index.css              # Custom Tailwind components & styles
```

---

## 🌐 Deployment Guide

### Deploying Frontend (e.g. Vercel, Netlify, Render)
1. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. The output directory is `frontend/dist/`.
3. Set environment variable on hosting dashboard:
   ```
   VITE_API_URL=https://your-backend-api-domain.com/api
   ```

### Deploying Backend (e.g. Railway, Render, Fly.io, AWS EC2)
1. Provision a MongoDB database on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Set environment variables on the hosting platform:
   ```env
   NODE_ENV=production
   PORT=5050
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/agri_marketplace?retryWrites=true&w=majority
   JWT_SECRET=your_production_secure_jwt_secret_key_here
   FRONTEND_URL=https://your-frontend-domain.com
   ```
3. Start command:
   ```bash
   node src/server.js
   ```

---

*Built with passion for sustainable agriculture, fair farmer wages, and healthy families.*

