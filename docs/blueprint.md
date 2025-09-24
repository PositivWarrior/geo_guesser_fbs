# **App Name**: Geo Explorer

## Core Features:

- Game Initialization: Initialize the game with a black and white world map (SVG/GeoJSON) displaying country borders. The map defaults to the free Europe mode. Other continents will be locked.
- Guess Validation: Validate user input against country names (case-insensitive, diacritics, aliases). Highlight the country green on correct answer.
- IAP Integration: Integrate in-app purchases for unlocking continents using RevenueCat or react-native-iap. Support one-time purchase for each continent and an 'All World' package. A Cloud Function verifies the IAP
- Game Mode Selection: Allow users to select game modes (continents or All World) from the home screen. Show locked continents with a CTA for purchase.
- Real-time Timer: Countdown timer per continent and All World game modes, configurable via Remote Config.  The LLM acts as a tool to allow challenges to disable timer pausing. It reasons whether the current remote config should have any influence over this behavior or not.
- Achievements: Implement achievements, locally stored and synced to Firestore, like 'Europe 100%' or 'All World under 10 min.'
- Data Persistence: Implement backend functionality (Firebase Cloud Functions) to mirror entitlements in Firestore.

## Style Guidelines:

- Primary color: A deep, muted teal (#468499) to evoke exploration and sophistication, steering clear of typical bright shades.
- Background color: A dark, desaturated teal (#26414A), complementing the primary and providing contrast.
- Accent color: A contrasting yellow-orange (#E58E26) to highlight important elements such as successful guesses and calls to action.
- Headline font: 'Space Grotesk' (sans-serif) for a modern and tech-oriented feel, well-suited to short displays of text; body text: 'Inter' (sans-serif).
- Use minimalist icons to represent game modes and achievements.
- Employ a clean and intuitive layout, optimizing for mobile screens with clear hierarchy.
- Incorporate subtle animations for map highlights and user feedback.