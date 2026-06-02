# Firebase Setup Guide for GeoGuesser Leaderboard

This guide will help you set up Firebase Firestore for the global leaderboard feature.

## Prerequisites

- A Google account
- Access to [Firebase Console](https://console.firebase.google.com/)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "geoguesser-leaderboard")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the web icon (`</>`) to add a web app
2. Enter an app nickname (e.g., "GeoGuesser Web App")
3. Check "Also set up Firebase Hosting" if you plan to deploy with Firebase (optional)
4. Click "Register app"
5. Copy the Firebase configuration object - you'll need these values for your `.env.local` file

## Step 3: Enable Firestore Database

1. In the Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Choose a location for your database (select one close to your users)
4. Start in **production mode** for security
5. Click "Enable"

## Step 4: Set Up Firestore Security Rules

1. Go to **Firestore Database > Rules**
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leaderboard collection
    match /leaderboard/{document} {
      // Anyone can read leaderboard entries
      allow read: if true;
      
      // Anyone can create entries, but with validation
      allow create: if request.resource.data.keys().hasAll([
        'playerName', 'continentId', 'continentName', 'score', 'total', 'timeTaken', 'timestamp'
      ])
      && request.resource.data.playerName is string
      && request.resource.data.playerName.size() >= 1
      && request.resource.data.playerName.size() <= 20
      && request.resource.data.score is int
      && request.resource.data.total is int
      && request.resource.data.timeTaken is int
      && request.resource.data.timestamp is int;
      
      // No updates or deletes allowed
      allow update, delete: if false;
    }
  }
}
```

3. Click "Publish"

## Step 5: Create Firestore Indexes

To improve query performance, create a composite index:

1. Go to **Firestore Database > Indexes**
2. Click "Add index"
3. Set up the following index:
   - **Collection ID**: `leaderboard`
   - **Fields**:
     - `continentId` - Ascending
     - `score` - Descending
     - `timeTaken` - Ascending
   - **Query scope**: Collection
4. Click "Create index"
5. Wait for the index to build (this may take a few minutes)

## Step 6: Enable Google Sign-In

1. Go to **Build > Authentication** in the Firebase Console.
2. Click **Get started** if needed, then open the **Sign-in method** tab.
3. Enable **Google** and save.
4. Under **Settings > Authorized domains**, keep `localhost` for development and add your production domain after deploy.

Europe is playable without login; Asia & Oceania require Google sign-in.

## Step 7: Configure Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following environment variables with your Firebase config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Replace the placeholder values with your actual Firebase configuration values from Step 2

## Step 8: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Play a game and complete it
3. Enter your name when prompted to submit to the leaderboard
4. Go to the Leaderboard page and check if your score appears

## Troubleshooting

### "Permission denied" errors
- Check that your Firestore security rules are set up correctly
- Verify that the rules allow public read and create operations

### Scores not appearing
- Check the browser console for errors
- Verify that your `.env.local` file has all the correct values
- Make sure the Firestore index has finished building

### Index errors
- If you see "The query requires an index" errors, Firebase will provide a direct link to create the required index

## Optional: Set Up Budget Alerts

To avoid unexpected charges:

1. Go to **Project Settings > Usage and billing**
2. Set up budget alerts for Firestore reads/writes
3. Firebase has a generous free tier that should be sufficient for most applications

## Data Structure

The leaderboard uses the following Firestore structure:

```
leaderboard (collection)
  └── [auto-generated-id] (document)
      ├── playerName: string
      ├── continentId: string
      ├── continentName: string
      ├── score: number
      ├── total: number
      ├── timeTaken: number (seconds)
      └── timestamp: number (milliseconds)
```

## Support

If you encounter any issues, please check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

