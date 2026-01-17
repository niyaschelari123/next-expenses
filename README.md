# Daily Money Manager

A Next.js application for managing daily expenses with Firebase, Tailwind CSS, and TypeScript.

## Features

- ✅ Add daily expenses with optional reason
- ✅ Set daily target expense (default: ₹400)
- ✅ View expenses in a table with date, amount, reason, and time
- ✅ Track savings (when spending < target) and extra spending
- ✅ Get congratulatory messages for savings or warnings for extra spending
- ✅ Mobile-oriented responsive design
- ✅ Firebase Firestore integration for data persistence

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, pnpm, or bun
- Firebase project

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up Firebase:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Firestore Database
   - Go to Project Settings > General > Your apps
   - Add a web app and copy the Firebase configuration

3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Set up Firestore Security Rules (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{document=**} {
      allow read, write: if true; // For development only - update for production
    }
  }
}
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Set Daily Target**: Enter your daily target expense at the top (default: ₹400)
2. **Add Expense**: Click "Add Expense" button to add a new expense
   - Select date (defaults to today)
   - Enter amount
   - Optionally add a reason
3. **View Expenses**: See all expenses in the table with:
   - Total expense
   - Savings (if spending < target)
   - Extra spending (if spending > target)
4. **Status Messages**: Get feedback on your spending habits below the table

## Project Structure

```
├── app/
│   ├── page.tsx          # Main page component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── AddExpenseModal.tsx  # Modal for adding expenses
│   ├── ExpenseTable.tsx     # Table displaying expenses
│   └── StatusMessage.tsx    # Savings/extra spending messages
├── lib/
│   └── firebase.ts       # Firebase configuration
└── types/
    └── index.ts          # TypeScript type definitions
```

## Technologies Used

- **Next.js 14** - React framework with App Router (compatible with Node.js 18)
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 3** - Styling
- **Firebase Firestore 10** - Database (compatible with Node.js 18)
- **date-fns** - Date formatting

## License

MIT
