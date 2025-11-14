# EmojiWords - Design Document

**Date:** 2025-11-13
**Project:** emojiwords
**Type:** Educational PWA for K-2 reading practice

## Overview

EmojiWords is an emoji-themed flashcard app for 1st and 2nd graders to practice sight words. The app uses progressive reveal to teach word recognition, syllable breakdown with audio pronunciation, and contextual usage through simple example sentences.

## User Flow

### Home Screen
- App title: "📚 EmojiWords"
- Subtitle: "Learn to read with emojis!"
- Progress display: "🌟 X of 200 words practiced"
- Badge showcase (5 badges, locked/unlocked)
- "Start Practice" button
- Settings button (⚙️) for API key entry

### Settings Modal
- OpenAI API key input
- Saves to localStorage
- Note: "Needed for syllable pronunciation"

### Practice Flow (Progressive Reveal)

**State 1 - Word Introduction:**
- Large semantic emoji at top
- Word displayed large below
- Tap anywhere to continue

**State 2 - Syllable Breakdown:**
- Smaller emoji at top
- Word split into colored bubbles (alternating gradients)
- Each bubble is tappable → OpenAI TTS speaks the syllable
- Visual feedback on tap (pulse/glow)
- Tap background to continue

**State 3 - Example Sentences:**
- Emoji + syllable bubbles at top (smaller)
- One example sentence displayed
- "Next Example ➡️" cycles through 2-3 sentences
- "Next Word ➡️" advances to next word
- Progress indicator: "Word X of 200"

### Completion Screen
- Celebration emojis (🎉✨🌟)
- "Amazing Work!" heading
- Session stats: words practiced today
- Overall progress: X of 200 total
- Progress bar visualization
- Badge unlock notification (if any)
- "Practice More" button

## Data Structure

### Word Object
```javascript
{
  word: "because",
  emoji: "🤔",
  syllables: ["be", "cause"],
  examples: [
    "I came because you called.",
    "He ran because it was time.",
    "We play because it is fun."
  ]
}
```

### Badge System
```javascript
const badges = [
  { id: 'starter', threshold: 1, emoji: '⭐', name: 'Word Starter' },
  { id: 'explorer', threshold: 25, emoji: '🚀', name: 'Word Explorer' },
  { id: 'reader', threshold: 50, emoji: '📖', name: 'Growing Reader' },
  { id: 'champion', threshold: 100, emoji: '🏆', name: 'Reading Champion' },
  { id: 'master', threshold: 200, emoji: '👑', name: 'Word Master' }
];
```

### localStorage Schema
- `openai_api_key`: String
- `practicedWords`: Array of word indices
- `badges`: Array of unlocked badge IDs
- `lastPracticeDate`: ISO date string
- `totalPracticed`: Number

## Word List (200 words from 1st & 2nd Grade Word Wall)

Organized alphabetically A-Z with:

**Emoji Assignment Strategy:**
- Concrete nouns: Direct semantic match (dog→🐕, car→🚗, school→🏫)
- Action verbs: Action emojis (run→🏃, eat→🍽️, play→⚽)
- Abstract/function words: Decorative (the→✨, and→🌟, if→💫)

**Syllable Breakdown Rules:**
- Single syllable: ["dog"]
- Clear divisions: ["be", "fore"]
- Multi-syllable: ["chil", "dren"]

**Example Sentences:**
- 2-3 per word
- Composed from words in the list
- K-1 appropriate (3-7 words)
- Various sentence types (statement, question)

## Technical Architecture

### State Management
```javascript
class WordPracticeApp {
  constructor() {
    this.wordList = WORD_LIST;
    this.currentIndex = 0;
    this.revealState = 'word'; // 'word' | 'syllables' | 'examples'
    this.currentExampleIndex = 0;
    this.progress = this.loadProgress();
    this.apiKey = localStorage.getItem('openai_api_key');
    this.audioCache = new Map(); // syllable audio caching
  }
}
```

### Audio Implementation
- **API:** OpenAI `/v1/audio/speech`
- **Voice:** "nova" or "alloy" (clear, child-friendly)
- **Speed:** 0.9x (slightly slower for learning)
- **Caching:** In-memory Map for syllable audio blobs
- **Error handling:** Graceful degradation (practice continues without audio)

### Responsive Design
**CSS Custom Properties:**
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --bubble-color-1: #FF6B9D;
  --bubble-color-2: #C371F6;
  --font-word: 3rem;
  --font-syllable: 2rem;
}
```

**Breakpoints:**
- Mobile: Base styles (< 768px)
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px (max-width container)

### Touch Interactions
- Large touch targets (min 44px)
- Tap feedback: scale + glow animation
- Prevent text selection
- Tap-based navigation (primary)

### PWA Features
- `manifest.json` for installability
- Apple touch icon (inline data URI)
- Mobile web app meta tags
- Standalone display mode
- Theme color matching app gradient

## Error Handling

**No API Key:**
- Banner: "Tap ⚙️ to add API key for syllable sounds"
- Syllable bubbles show info message on tap
- Practice continues without audio

**API Failures:**
- Network error: Toast notification
- Invalid key: Prompt to check settings
- Rate limit: "Audio unavailable" message
- Always allow practice to continue

**Data Validation:**
- Sanitize localStorage reads
- Default to empty progress if corrupted
- Defensive badge unlock logic

## Deployment

- No build process (vanilla HTML/CSS/JS)
- Deploy via GitHub Pages workflow
- Test locally: `serve` or `python3 -m http.server 8000`
- Update root `index.html` with project card

**Project Card:**
```html
<a href="./emojiwords/" class="project-card">
  <span class="project-icon">📚</span>
  <div class="project-title">EmojiWords</div>
  <div class="project-description">
    Learn to read with emoji flashcards. Practice word sounds and see example sentences.
  </div>
</a>
```

## Implementation Notes

- Single-file `index.html` with inline styles/scripts (or separate CSS/JS files)
- Manual word list construction from image data
- Sequential word presentation (random or alphabetical order)
- Progress tracking encourages daily practice
- Child-friendly UI with large text and clear feedback
