# TaskFlow - Collaborative Production-Ready Task Tracker

TaskFlow is a production-grade Full Stack Task Tracker application built for a Full Stack Internship Project. It adheres to senior-level engineering standards, emphasizing clean code, domain-driven modularity, strict security, and responsive SaaS design aesthetics.

---

## 🛠️ Technology Stack

### Frontend
*   **Core**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS v4 (native CSS module compiling, custom neutral tokens)
*   **Routing**: React Router DOM (v6/v7) with lazy-loaded route chunking
*   **Server State & Caching**: TanStack Query (v5)
*   **HTTP Client**: Axios with global credential sharing and 401 session-eviction interceptors
*   **Form Management**: React Hook Form
*   **Validation**: Zod schema validations
*   **Icons**: Lucide React

### Backend
*   **Runtime**: Node.js (LTS) & Express.js with TypeScript
*   **Database**: MongoDB Atlas via Mongoose ODM
*   **Security & Protection**: Helmet, CORS, express-rate-limit, bcryptjs, jsonwebtoken, cookie-parser
*   **Compression & Logs**: compression, morgan, dotenv
*   **Payload Validation**: Zod schemas

---

## 📦 Architecture & Folder Structure

TaskFlow utilizes a **Monorepo** design dividing code into two isolated workspace directories: `backend/` and `frontend/`.

### Backend: Layered Modular Architecture
Domain logic is isolated by features inside `backend/src/modules/`. Within each feature, layers are decoupled:
*   **Routes**: Declares paths and binds validation and auth guards.
*   **Controller**: Receives HTTP parameters, triggers services, and formats standard JSON payloads.
*   **Service**: Enforces business logic and permission validations.
*   **Repository**: Performs database Mongoose CRUD operations and aggregations.
*   **Validation**: Implements input boundaries using Zod.

```
backend/src/
├── config/             # DB singletons, validated env parameters
├── middleware/         # Authguards, global error formatters, rate-limiters
├── modules/            # Domain modules
│   ├── auth/           # User signups, logins, profiles
│   └── task/           # Task CRUD, metrics aggregates
├── types/              # Express Request interface type extensions
├── utils/              # Operational error class boundaries, async catchers
├── app.ts              # Express application configuration setup
└── server.ts           # Server listener entry and crash catcher guards
```

### Frontend: Feature-First Architecture
Frontend directories are organized by modules inside `frontend/src/features/`. Shared reusable helpers live in `frontend/src/shared/`.
```
frontend/src/
├── app/                # Global providers wrapper, React Router trees
├── features/           # Feature UI modules
│   ├── auth/           # Login/Register forms
│   ├── dashboard/      # Metrics visualization cards
│   └── tasks/          # Lists, creation forms, filters
└── shared/             # Reusable global elements
    ├── components/     # UI elements, route-guards, layouts
    ├── hooks/          # Global hooks (useAuth, useTheme, useToast)
    ├── lib/            # QueryClient settings
    ├── services/       # Base Axios api client interceptors
    ├── styles/         # Global index stylesheets (Tailwind v4 imports)
    └── types/          # Unified frontend typings declarations
```

---

## 🔒 Security Implementations

TaskFlow is configured with strict security layers guarding against standard web vulnerabilities:

1.  **JWT via HTTP-Only Cookies**: Tokens are delivered to the client inside `httpOnly`, `secure`, and `sameSite: strict` cookies, preventing JavaScript access (mitigating XSS) and blocking CSRF request hijacks.
2.  **Strict CORS Options**: API requests are allowed only from the designated client URL, blocking arbitrary browser domains.
3.  **Payload Limitation**: Incoming JSON bodies are capped at `10kb` to protect the Node event loop from overflow memory attacks (DDoS protection).
4.  **helmet Headers**: Binds standard headers protecting against clickjacking, mime-sniffing, and browser XSS injections.
5.  **IP Rate Limiting**: General API endpoints are capped at 100 requests per 15 minutes. Auth endpoints (login/register) are restricted to 15 attempts per 15 minutes.
6.  **Zod Sanitization**: Inputs are validated at the gateway, blocking NoSQL injections and malformed request arguments.
7.  **NoSQL Injection Safeguard**: Excludes passwords (`select: false`) by default on Mongoose queries and enforces strict ObjectId formats.
8.  **Central Error Boundaries**: Programming errors are caught and sanitized in production to prevent database schemas or directory structures from leaking.

---

## ⚡ Performance & Scalability

*   **Compound Database Indexes**: MongoDB collections are indexed on `{ createdBy: 1, status: 1 }` and `{ createdBy: 1, priority: 1 }` to scan filter lists in log-time.
*   **Concurrent Counting**: Paginated lists request documents and count matching totals concurrently using `Promise.all`.
*   **Aggregation Framework**: Dashboard statistics are computed inside MongoDB in a single pass using aggregation pipelines.
*   **Vite Code-Splitting**: Routes are dynamically imported, bundling page layouts into separate, lazy-loaded JavaScript chunks.
*   **Debounced Search Queries**: A 350ms input delay protects backend servers from database query spikes during active user typing.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (LTS v20+)
*   npm (v10+)
*   MongoDB Atlas connection string

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/Gamerking177/TaskFlow.git
    cd TaskFlow
    ```
2.  Install dependencies across the monorepo workspaces:
    ```bash
    npm run install:all
    ```

### Environment Configuration
Create a `.env` file inside the `backend/` directory:
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and configure:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=generate_a_secure_random_key_of_32_characters
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Running Locally
To boot up both the backend API server and frontend development server concurrently:
```bash
npm run dev
```
*   **Frontend client**: `http://localhost:5173`
*   **Backend server**: `http://localhost:5000`

---

## 🗺️ API Documentation

All requests use a JSON payload and return a standardized response format:
```json
{
  "success": true,
  "message": "Success message description",
  "data": { ... },
  "meta": { "total": 0, "page": 1, "limit": 10, "totalPages": 0 }
}
```

### Authentication Endpoints
*   `POST /api/v1/auth/register` (Public, Rate-limited)
    *   **Payload**: `{ "name": "...", "email": "...", "password": "..." }`
    *   **Returns**: Standard user profile and sets JWT cookie.
*   `POST /api/v1/auth/login` (Public, Rate-limited)
    *   **Payload**: `{ "email": "...", "password": "..." }`
    *   **Returns**: Standard user profile and sets JWT cookie.
*   `POST /api/v1/auth/logout` (Public)
    *   **Returns**: Clears the authentication session cookie.
*   `GET /api/v1/auth/me` (Protected)
    *   **Returns**: Currently logged-in user profile.

### Tasks Endpoints
*   `POST /api/v1/tasks` (Protected)
    *   **Payload**: `{ "title": "...", "description": "...", "status": "pending", "priority": "medium", "dueDate": "ISOString" }`
    *   **Returns**: The newly created task object.
*   `GET /api/v1/tasks` (Protected)
    *   **Query Parameters**: `search`, `status`, `priority`, `sort` (createdAt, dueDate, priority, title), `order` (asc, desc), `page`, `limit`
    *   **Returns**: Paginated array of task items.
*   `GET /api/v1/tasks/stats` (Protected)
    *   **Returns**: Task statistics counts: total, completed, pending, inProgress, and overdue.
*   `GET /api/v1/tasks/:id` (Protected)
    *   **Returns**: Specific task details (verifies user ownership).
*   `PUT /api/v1/tasks/:id` (Protected)
    *   **Payload**: `{ "title": "...", "status": "in-progress", ... }` (All properties optional)
    *   **Returns**: The updated task object.
*   `DELETE /api/v1/tasks/:id` (Protected)
    *   **Returns**: Deletion success message.

---

## 📈 Future Improvements
*   **Sub-tasks & Checklists**: Allow dividing parent tasks into smaller checklists.
*   **Visual Charting Trends**: Add charts showing completion velocities over weekly iterations.
*   **Collaboration & Team Workspaces**: Add member invite codes and share workspace tasks boards.

---

## 📄 License
This project is open-source software licensed under the MIT License.
