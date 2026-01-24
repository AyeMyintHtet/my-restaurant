# My Restaurant

A modern, compact Restaurant Management System built with **Next.js 15** and **Supabase**.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, MUI Icons
- **Database & Auth:** Supabase
- **Forms:** React Hook Form + Zod
- **Utilities:** React-to-Print, QRCode.react, DayJS

## ✨ Features

- **Dashboard:** Real-time overview of restaurant performance.
- **Table Management:** Manage table availability and status.
- **Menu System:** Create and update menu items.
- **Order Processing:** Handle customer orders and receipts.
- **Authentication:** Secure staff login.
- **Responsive Design:** Optimized for tablets and desktops.

## 🛠 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-restaurant
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📜 Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with Turbopack. |
| `npm run build` | Builds the application for production. |
| `npm start` | Runs the built production application. |
| `npm run lint` | Runs ESLint to check for code quality. |

## 📄 License

This project is licensed under the MIT License.
