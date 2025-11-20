# CampusConnect - Hackathon Submission

## Project Information

**Project Name:** CampusConnect  
**Category:** Education & Learning  
**Bonus Category:** Best Use of AI  
**Repository:** [Your GitHub URL]  
**Live Demo:** [Your Netlify URL]  
**Demo Video:** [Your YouTube/Vimeo URL]

---

## Project Description

CampusConnect is a comprehensive campus community platform that revolutionizes how students interact, share knowledge, and engage with campus life. Built with React and Supabase, it features AI-powered content moderation, an interactive Pac-Man game, flashcard study system, project showcase, and real-time leaderboard.

### Key Features

1. **AI-Powered Smart Posts**
   - Automatic content moderation using Google Gemini API
   - Auto-categorization of posts (Notes, Doubts, Opportunities, Events)
   - Intelligent post summarization for long content
   - Fallback mechanisms for offline functionality

2. **Interactive Learning Tools**
   - Flashcard system for studying with categories
   - AI Chatbot for campus queries and assistance
   - Project showcase for student work
   - Real-time leaderboard for gamification

3. **Entertainment & Engagement**
   - Classic Pac-Man game with smooth controls
   - Multiple difficulty levels with barriers
   - Score tracking and game state management

4. **Community Features**
   - Post creation and browsing
   - Comment system
   - Like/upvote functionality
   - User profiles
   - Search and filter capabilities

5. **Modern UI/UX**
   - Responsive design for all devices
   - Dark theme with vibrant accents
   - Smooth animations and transitions
   - Intuitive navigation

---

## How Kiro Was Used

### 1. Vibe Coding - Conversational Development

**Approach:** I structured conversations with Kiro by breaking down features into logical components and iterating based on feedback.

**Most Impressive Code Generation:**
- **Pac-Man Game Logic:** Kiro helped implement complex game mechanics including:
  - Continuous ghost movement with collision detection
  - Wall barriers and pathfinding
  - Smooth animation using useRef to prevent re-renders
  - Game state management with start screen and game over states
  
  The challenge was fixing ghost lag when arrow keys were pressed. Kiro identified that the game loop was restarting due to dependency changes and solved it by using `useRef` for direction instead of state, eliminating unnecessary re-renders.

- **AI Integration:** Kiro generated the entire Gemini API integration with proper error handling, fallback mechanisms, and three distinct AI features (moderation, categorization, summarization) in a single, well-structured utility file.

**Conversation Strategy:**
- Started with high-level feature requests
- Provided specific feedback on bugs (e.g., "ghosts stop when I move")
- Iterated on UI/UX improvements (e.g., "remove the right card, keep only the form")
- Used clear, concise language to describe issues

### 2. Spec-Driven Development

**Spec Created:** `ai-features-spec.md` in `.kiro/specs/`

**Structure:**
- Clear requirements for each AI feature
- Implementation details with API endpoints
- Success criteria and testing guidelines
- Status tracking (completed)

**Benefits:**
- Provided clear roadmap for AI implementation
- Ensured all features met requirements
- Made it easy to track progress
- Served as documentation for future reference

**Comparison to Vibe Coding:**
- Spec-driven was better for complex features with multiple components
- Vibe coding was faster for UI tweaks and bug fixes
- Spec provided better documentation
- Vibe coding allowed for more creative exploration

### 3. Steering Documents

**Created:** `project-guidelines.md` in `.kiro/steering/`

**Strategy:**
- Defined tech stack and coding standards upfront
- Specified database schema to ensure consistency
- Listed all feature requirements
- Established error handling patterns

**Impact:**
- Kiro automatically followed React best practices
- Consistent code style across all components
- Proper error handling in all API calls
- Modular, reusable component structure

**Biggest Difference:**
- Reduced need to repeat coding standards in each conversation
- Kiro proactively suggested improvements aligned with guidelines
- Faster development with fewer corrections needed

### 4. Agent Hooks

**Created:** `test-runner.json` in `.kiro/hooks/`

**Workflow Automated:**
- Automatically run tests when test files are saved
- Ensures code quality without manual intervention

**Improvement:**
- Caught bugs earlier in development
- Reduced context switching between coding and testing
- Maintained confidence in code changes

### 5. Development Workflow

**Typical Conversation Flow:**
1. Request feature: "Add a Pac-Man game with ghosts"
2. Kiro generates initial implementation
3. Test and provide feedback: "Ghosts are lagging"
4. Kiro debugs and fixes: Uses useRef to prevent re-renders
5. Request enhancement: "Add barriers to make it harder"
6. Kiro iterates on the solution

**Key Success Factors:**
- Clear, specific problem descriptions
- Immediate testing and feedback
- Iterative refinement
- Trust in Kiro's debugging capabilities

---

## Technical Implementation

### Architecture
- **Frontend:** React 18 with functional components and hooks
- **Backend:** Supabase (PostgreSQL, Authentication, Real-time)
- **AI:** Google Gemini 1.5 Flash API
- **Styling:** Tailwind CSS + Custom CSS
- **Routing:** React Router v6
- **Deployment:** Netlify

### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT,
  created_at TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  title TEXT,
  content TEXT,
  category TEXT,
  author TEXT,
  likes INTEGER DEFAULT 0,
  flagged BOOLEAN DEFAULT FALSE,
  summary TEXT,
  created_at TIMESTAMP
);

-- Comments, Flashcards, Projects tables...
```

### AI Features Implementation
- Content moderation with keyword fallback
- Auto-categorization using NLP
- Post summarization (max 15 words)
- Error handling with graceful degradation

---

## Challenges Overcome

1. **Ghost Movement Lag in Pac-Man**
   - Problem: Ghosts stopped moving when player pressed keys
   - Solution: Used useRef for direction to prevent game loop restarts
   - Kiro's Role: Identified the root cause and implemented the fix

2. **API Error Handling**
   - Problem: Gemini API 503 errors breaking post creation
   - Solution: Implemented fallback moderation and proper error checking
   - Kiro's Role: Added response.ok checks and fallback logic

3. **Responsive Design**
   - Problem: Layout breaking on mobile devices
   - Solution: Tailwind responsive classes and flexible layouts
   - Kiro's Role: Generated mobile-first responsive components

---

## Future Enhancements

- Real-time notifications
- File upload for posts
- Advanced search with filters
- User reputation system
- Mobile app version
- More games and interactive features

---

## Installation & Setup

```bash
# Clone repository
git clone [your-repo-url]

# Install dependencies
npm install

# Set up environment variables
echo "REACT_APP_GEMINI_API_KEY=your_key" > .env

# Run development server
npm start

# Build for production
npm run build
```

---

## License

MIT License - Open Source

---

## Acknowledgments

- Built with Kiro AI IDE
- Powered by Google Gemini API
- Database by Supabase
- Deployed on Netlify

---

**Submission Date:** November 20, 2024  
**Developer:** [Your Name]  
**Contact:** [Your Email]
