# Firebase Authentication Setup Guide

## Step 1: Enable Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** in the left sidebar
4. Click **Get Started** if you haven't enabled it yet
5. Go to the **Sign-in method** tab
6. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 2: Update Firestore Security Rules

**IMPORTANT**: Without proper security rules, your data is not secure!

1. Go to Firebase Console → **Firestore Database** → **Rules** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{expenseId} {
      // Only allow authenticated users to read and write
      allow read, write: if request.auth != null 
        && request.auth.uid != null;
    }
  }
}
```

3. Click **Publish** to save the rules

## Step 3: Test the Application

1. Start your development server: `npm run dev`
2. You should see the login page
3. Click "Don't have an account? Sign Up" to create a new account
4. Enter an email and password (minimum 6 characters)
5. After signing up, you'll be automatically logged in
6. You can now access all expense management features

## Security Notes

✅ **Secure**:
- Users must authenticate before accessing data
- Firestore rules prevent unauthorized access
- Each user can only access their own data (if you add userId filtering)

⚠️ **Important**:
- Make sure to update Firestore security rules as shown above
- Never commit your `.env.local` file to version control
- The Firebase API keys in `.env.local` are safe to expose (they're public keys), but your security rules protect the data

## Optional: User-Specific Data Isolation

If you want each user to only see their own expenses, you'll need to:

1. Update expense creation to include userId:
```typescript
const expenseData = {
  money,
  reason: reason || '',
  updatedTime: now,
  date,
  userId: currentUser.uid, // Add this
};
```

2. Update Firestore rules:
```javascript
allow read, write: if request.auth != null 
  && request.auth.uid != null
  && resource.data.userId == request.auth.uid;
```

3. Filter queries by userId when loading expenses
