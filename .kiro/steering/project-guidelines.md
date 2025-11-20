# CampusConnect Project Guidelines

## Project Overview
CampusConnect is a comprehensive campus community platform built with React, Supabase, and AI features powered by Google Gemini.

## Tech Stack
- **Frontend**: React 18 with React Router
- **Backend**: Supabase (PostgreSQL database, authentication)
- **AI Integration**: Google Gemini API for content moderation, summarization, and auto-tagging
- **Styling**: Tailwind CSS with custom CSS
- **Deployment**: Netlify

## Code Standards
- Use functional components with React Hooks
- Follow ES6+ JavaScript standards
- Use async/await for asynchronous operations
- Implement proper error handling with try-catch blocks
- Keep components modular and reusable

## Feature Requirements
- User authentication (login/signup)
- Post creation with AI moderation
- Real-time leaderboard
- Interactive games (Pac-Man)
- AI-powered chatbot
- Flashcard system for studying
- Project showcase
- Contact form integration

## Database Schema
- Users table: id, username, email, password, created_at
- Posts table: id, title, content, category, author, likes, flagged, summary, created_at
- Comments table: id, post_id, author, content, created_at
- Flashcards table: id, user_id, question, answer, category, created_at

## AI Features
- Content moderation for inappropriate posts
- Auto-categorization of posts
- Post summarization for long content
- Chatbot for campus queries

## Development Workflow
- Test all features locally before deployment
- Ensure responsive design for mobile devices
- Validate all forms before submission
- Handle API errors gracefully with fallbacks
