# 🎓 CampusBuddy

CampusBuddy is an AI-powered student platform that connects doubts, notes, and events, with Datadog integration providing real-time observability of Gemini AI for speed, safety, and reliability.
Try out:

https://campus-connect-183.firebaseapp.com/
## ✨ Features

### 🤖 AI Features (Powered by Gemini)
-  **AI Auto Moderation** - Automatically detects spam, toxicity, and inappropriate content
-  **AI Auto Tags** - Automatically categorizes posts (Notes, Doubts, Opportunities, Events, General)
-  **AI Summary** - Generates short summaries for long posts

### 🎨 UI/UX Features
-  **Theme** - Festive UI with glowing effects
-  **Responsive Design** - Works perfectly on mobile, tablet, and desktop
-  **Modern Design** - Clean, minimal, and professional

### 📱 Core Features
-  **Post Feed** - Browse all posts with search and category filters
-  **Create Posts** - Easy post creation with category selection
-  **Post Details** - View full posts with comments
-  **Comments System** - Add comments to any post
-  **Like System** - Upvote posts you find helpful
-  **User Profiles** - Simple username-based authentication
-  **Search** - Search posts by title or content
-  **Categories** - Filter by Notes, Doubts, Opportunities, Events, General
-  **Flagged Content** - Visual indicators for moderated content

## 🚀 Tech Stack

- **Frontend**: React 19 + React Router
- **Backend**: Supabase (Serverless)
- **Database**: Supabase PostgreSQL
- **AI**: Google Gemini API
- **Styling**: Custom CSS with animations
- **Deployment**: Firebase
- **Datadog RUM (Real User Monitoring)**: For tracking user interactions and AI performance latency
- **Datadog Custom Actions**: For visualizing AI decision-making (flagging, token usage)

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Go to your Supabase project
   - Run the SQL commands from `SUPABASE_SETUP.md`

4. Configure environment variables:
   - Add your Gemini API key to `.env`:
   ```
   REACT_APP_GEMINI_API_KEY=your_api_key_here
   ```

5. Start the development server:
   ```bash
   npm start
   ```

## 🎯 Pages

1. **Home** (`/`) - Browse all posts with search and filters
2. **Create Post** (`/create`) - Create new posts
3. **Post Detail** (`/post/:id`) - View post with comments
4. **Profile** (`/profile`) - View your posts and profile
5. **Games** (`/profile`) - Fun games

## 🔑 How to Use

1. **Login** - Click "Login" with google account
2. **Create Post** - Go to "Create Post" and write your content
3. **Browse** - Use search and category filters to find posts
4. **Interact** - Like posts and add comments
5. **AI Magic** - Posts are automatically moderated, tagged, and summarized

## Christmas Theme

- Christmas background.
- And more
- 
## License
This project is licensed under the MIT License.

