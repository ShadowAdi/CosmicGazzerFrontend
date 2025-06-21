```md
# Cosmic Gazzer (Frontend)

Cosmic Gazzer is a mobile-first social media and community platform for stargazers and astronomy enthusiasts. Built with React Native using Expo Router, this app allows users to explore and share cosmic events like meteor showers, lunar eclipses, and more.

## 🌟 Features

- 🌌 **Explore Posts:** View user-generated content related to various events.
- 📝 **Create/Delete Posts:** Add insights, experiences, or updates around events.
- 📅 **Events System:** Create and join stargazing-related events.
- 👤 **Profile Screen:** See all your posts and events in one place.
- 🔐 **Authentication:** Sign up, login, logout with secure token handling.
- 🚀 **Onboarding/Welcome Screen:** Simple index screen with navigation to Sign In/Up.

## 🧱 Tech Stack

- **React Native** with **Expo Router**
- **TypeScript**
- **Context API** for global state
- **REST API** integration with backend
- **LinearGradient UI**, dark theme inspired by night sky


## 🚀 Getting Started

```bash
npm install
npx expo start
````

Make sure your backend is running at the URL defined in `constants.ts`.

## 📦 Dependencies

* `expo-router`
* `@react-navigation/native`
* `@react-native-community/datetimepicker`
* `react-hook-form`
* `expo-linear-gradient`

## 🔐 Auth Flow

* Tokens are stored securely
* AuthContext handles fetching user data
* Private screens check `user` and `token` state

---

### 🧪 Todo / Improvements

* [ ] Image upload for posts
* [ ] Edit events/posts
* [ ] Notifications for events
* [ ] Join/RSVP to events

````

## Demos Can Be Found in the demo folder
