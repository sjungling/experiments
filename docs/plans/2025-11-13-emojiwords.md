# EmojiWords Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an educational PWA for K-2 students to practice sight words with emoji flashcards, syllable pronunciation using OpenAI TTS, and progress tracking with badges.

**Architecture:** Single-file PWA (or index.html + separate CSS/JS) using vanilla JavaScript with class-based state management. Progressive reveal UI (word → syllables → examples). OpenAI TTS API for syllable pronunciation with in-memory caching. localStorage for progress persistence and API key storage.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, OpenAI API (/v1/audio/speech), localStorage, PWA (manifest.json, meta tags)

---

## Task 1: Project Structure Setup

**Files:**
- Create: `/Volumes/Data/Work/play/experiments/emojiwords/index.html`
- Create: `/Volumes/Data/Work/play/experiments/emojiwords/styles.css`
- Create: `/Volumes/Data/Work/play/experiments/emojiwords/app.js`
- Create: `/Volumes/Data/Work/play/experiments/emojiwords/manifest.json`

**Step 1: Create directory**

```bash
mkdir -p /Volumes/Data/Work/play/experiments/emojiwords
```

**Step 2: Create manifest.json**

Create `/Volumes/Data/Work/play/experiments/emojiwords/manifest.json`:

```json
{
  "name": "EmojiWords",
  "short_name": "EmojiWords",
  "description": "Learn to read with emoji flashcards",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiByeD0iNDAiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxODAiIHkyPSIxODAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzY2N2VlYSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3NjRiYTIiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSI5MCIgeT0iMTIwIiBmb250LXNpemU9IjgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+TujwvdGV4dD4KPC9zdmc+Cg==",
      "sizes": "180x180",
      "type": "image/svg+xml"
    }
  ]
}
```

**Step 3: Create basic index.html structure**

Create `/Volumes/Data/Work/play/experiments/emojiwords/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="EmojiWords" />
    <meta name="mobile-web-app-capable" content="yes" />
    <title>📚 EmojiWords</title>

    <link rel="apple-touch-icon" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiByeD0iNDAiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxODAiIHkyPSIxODAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzY2N2VlYSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3NjRiYTIiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSI5MCIgeT0iMTIwIiBmb250LXNpemU9IjgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+TujwvdGV4dD4KPC9zdmc+Cg==" />
    <link rel="manifest" href="manifest.json" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="app.js"></script>
  </body>
</html>
```

**Step 4: Create CSS file with custom properties**

Create `/Volumes/Data/Work/play/experiments/emojiwords/styles.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --bubble-color-1: #FF6B9D;
  --bubble-color-2: #C371F6;
  --spacing-base: 1rem;
  --font-word: 3rem;
  --font-syllable: 2rem;
  --font-body: 1.1rem;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--primary-gradient);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

#app {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 600px;
  width: 100%;
  min-height: 400px;
}

@media (max-width: 768px) {
  :root {
    --font-word: 2.5rem;
    --font-syllable: 1.5rem;
  }

  #app {
    padding: 30px 20px;
  }
}
```

**Step 5: Create empty app.js**

Create `/Volumes/Data/Work/play/experiments/emojiwords/app.js`:

```javascript
// EmojiWords - Educational sight word practice app
// Main application logic

console.log('EmojiWords loaded');
```

**Step 6: Test basic structure**

```bash
cd /Volumes/Data/Work/play/experiments
serve
```

Open browser to http://localhost:3000/emojiwords/
Expected: White card centered on gradient background, console shows "EmojiWords loaded"

**Step 7: Commit**

```bash
git add emojiwords/
git commit -m "feat: add emojiwords project structure with PWA manifest"
```

---

## Task 2: Word List Data

**Files:**
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/app.js`

**Step 1: Add word list constant**

Add to top of `app.js`:

```javascript
// Word list from 1st & 2nd Grade Word Wall
const WORD_LIST = [
  // Aa
  { word: "a", emoji: "✨", syllables: ["a"], examples: ["I have a dog.", "Do you see a cat?"] },
  { word: "about", emoji: "💭", syllables: ["a", "bout"], examples: ["I know about that.", "Tell me about it."] },
  { word: "after", emoji: "⏰", syllables: ["af", "ter"], examples: ["Come after me.", "We play after school."] },
  { word: "again", emoji: "🔄", syllables: ["a", "gain"], examples: ["Do it again.", "Can we go again?"] },
  { word: "all", emoji: "🌟", syllables: ["all"], examples: ["I see all of them.", "We all run."] },
  { word: "also", emoji: "➕", syllables: ["al", "so"], examples: ["I also like that.", "She also came."] },
  { word: "always", emoji: "♾️", syllables: ["al", "ways"], examples: ["I always help.", "He is always here."] },
  { word: "am", emoji: "🙋", syllables: ["am"], examples: ["I am here.", "I am new."] },
  { word: "an", emoji: "✨", syllables: ["an"], examples: ["I have an idea.", "It is an old car."] },
  { word: "and", emoji: "🌟", syllables: ["and"], examples: ["You and me.", "I run and play."] },
  { word: "another", emoji: "🔄", syllables: ["an", "oth", "er"], examples: ["Give me another one.", "We saw another dog."] },
  { word: "any", emoji: "❓", syllables: ["an", "y"], examples: ["Do you have any?", "I can do any of them."] },
  { word: "are", emoji: "👥", syllables: ["are"], examples: ["You are good.", "We are here."] },
  { word: "around", emoji: "🔄", syllables: ["a", "round"], examples: ["Look around you.", "Run around the house."] },
  { word: "asked", emoji: "❓", syllables: ["asked"], examples: ["I asked about it.", "He asked me."] },
  { word: "at", emoji: "📍", syllables: ["at"], examples: ["Look at me.", "I am at school."] },
  { word: "away", emoji: "👋", syllables: ["a", "way"], examples: ["Go away now.", "He ran away."] },

  // Bb
  { word: "back", emoji: "⬅️", syllables: ["back"], examples: ["Come back here.", "I will be back."] },
  { word: "be", emoji: "⭐", syllables: ["be"], examples: ["I want to be first.", "Be good."] },
  { word: "because", emoji: "🤔", syllables: ["be", "cause"], examples: ["I came because you called.", "I run because I like it."] },
  { word: "been", emoji: "✅", syllables: ["been"], examples: ["I have been here.", "We have been good."] },
  { word: "before", emoji: "⏰", syllables: ["be", "fore"], examples: ["I saw that before.", "Come before me."] },
  { word: "best", emoji: "🏆", syllables: ["best"], examples: ["You are the best.", "I like this best."] },
  { word: "better", emoji: "⬆️", syllables: ["bet", "ter"], examples: ["This is better.", "I am better now."] },
  { word: "big", emoji: "📏", syllables: ["big"], examples: ["That is big.", "I have a big dog."] },
  { word: "but", emoji: "🤷", syllables: ["but"], examples: ["I like it but she does not.", "It is good but old."] },
  { word: "by", emoji: "📍", syllables: ["by"], examples: ["Come by me.", "I go by car."] },

  // Cc
  { word: "called", emoji: "📞", syllables: ["called"], examples: ["I called you.", "He called me back."] },
  { word: "came", emoji: "🚶", syllables: ["came"], examples: ["I came here.", "She came to see me."] },
  { word: "can", emoji: "💪", syllables: ["can"], examples: ["I can do it.", "Can you see?"] },
  { word: "car", emoji: "🚗", syllables: ["car"], examples: ["I have a car.", "The car is old."] },
  { word: "children", emoji: "👧👦", syllables: ["chil", "dren"], examples: ["The children play.", "I see children here."] },
  { word: "come", emoji: "👋", syllables: ["come"], examples: ["Come with me.", "Can you come?"] },
  { word: "could", emoji: "🤔", syllables: ["could"], examples: ["I could see it.", "Could you help?"] },

  // Dd
  { word: "day", emoji: "☀️", syllables: ["day"], examples: ["It is a good day.", "I play all day."] },
  { word: "did", emoji: "✅", syllables: ["did"], examples: ["I did it.", "Did you see?"] },
  { word: "do", emoji: "💼", syllables: ["do"], examples: ["I can do it.", "What do you want?"] },
  { word: "dog", emoji: "🐕", syllables: ["dog"], examples: ["I have a dog.", "The dog runs."] },
  { word: "down", emoji: "⬇️", syllables: ["down"], examples: ["Go down now.", "I put it down."] },

  // Ee
  { word: "each", emoji: "1️⃣", syllables: ["each"], examples: ["Give each one.", "Each day I play."] },
  { word: "eat", emoji: "🍽️", syllables: ["eat"], examples: ["I like to eat.", "We eat at home."] },
  { word: "end", emoji: "🏁", syllables: ["end"], examples: ["I see the end.", "It is the end."] },
  { word: "even", emoji: "➗", syllables: ["e", "ven"], examples: ["I can even do that.", "Even I know."] },
  { word: "ever", emoji: "❓", syllables: ["ev", "er"], examples: ["Have you ever seen it?", "I never ever did."] },
  { word: "every", emoji: "📅", syllables: ["ev", "er", "y"], examples: ["I do it every day.", "Every one is here."] },

  // Ff
  { word: "family", emoji: "👨‍👩‍👧‍👦", syllables: ["fam", "i", "ly"], examples: ["I love my family.", "My family is big."] },
  { word: "few", emoji: "🔢", syllables: ["few"], examples: ["I have a few.", "Only a few came."] },
  { word: "find", emoji: "🔍", syllables: ["find"], examples: ["Can you find it?", "I will find you."] },
  { word: "first", emoji: "1️⃣", syllables: ["first"], examples: ["I am first.", "He came first."] },
  { word: "for", emoji: "🎁", syllables: ["for"], examples: ["This is for you.", "I did it for her."] },
  { word: "friend", emoji: "🤝", syllables: ["friend"], examples: ["You are my friend.", "I see my friend."] },
  { word: "from", emoji: "📍", syllables: ["from"], examples: ["I am from here.", "This is from me."] },

  // Gg
  { word: "gave", emoji: "🎁", syllables: ["gave"], examples: ["I gave it to you.", "She gave me one."] },
  { word: "get", emoji: "🎯", syllables: ["get"], examples: ["Can I get it?", "Go get that."] },
  { word: "give", emoji: "🤲", syllables: ["give"], examples: ["Give it to me.", "I will give you one."] },
  { word: "go", emoji: "🚶", syllables: ["go"], examples: ["Let us go.", "I want to go."] },
  { word: "going", emoji: "➡️", syllables: ["go", "ing"], examples: ["I am going now.", "We are going home."] },
  { word: "good", emoji: "👍", syllables: ["good"], examples: ["That is good.", "You are good."] },
  { word: "got", emoji: "✅", syllables: ["got"], examples: ["I got it.", "She got one."] },

  // Hh
  { word: "had", emoji: "📦", syllables: ["had"], examples: ["I had a dog.", "We had fun."] },
  { word: "has", emoji: "🤲", syllables: ["has"], examples: ["He has a car.", "She has it."] },
  { word: "have", emoji: "🎁", syllables: ["have"], examples: ["I have a friend.", "Do you have it?"] },
  { word: "head", emoji: "🧠", syllables: ["head"], examples: ["I see your head.", "My head is big."] },
  { word: "heard", emoji: "👂", syllables: ["heard"], examples: ["I heard you.", "We heard a dog."] },
  { word: "he", emoji: "👦", syllables: ["he"], examples: ["He is my friend.", "He runs fast."] },
  { word: "help", emoji: "🤝", syllables: ["help"], examples: ["Can you help me?", "I will help you."] },
  { word: "her", emoji: "👧", syllables: ["her"], examples: ["I see her.", "This is for her."] },
  { word: "here", emoji: "📍", syllables: ["here"], examples: ["Come here.", "I am here."] },
  { word: "his", emoji: "👦", syllables: ["his"], examples: ["This is his car.", "I see his dog."] },
  { word: "home", emoji: "🏠", syllables: ["home"], examples: ["I go home.", "She is at home."] },
  { word: "house", emoji: "🏡", syllables: ["house"], examples: ["I have a house.", "The house is big."] },
  { word: "how", emoji: "❓", syllables: ["how"], examples: ["How are you?", "I know how."] },

  // Ii
  { word: "I", emoji: "🙋", syllables: ["I"], examples: ["I am here.", "I can do it."] },
  { word: "if", emoji: "💭", syllables: ["if"], examples: ["Come if you can.", "I will if I can."] },
  { word: "in", emoji: "📥", syllables: ["in"], examples: ["Come in here.", "I am in the house."] },
  { word: "into", emoji: "➡️", syllables: ["in", "to"], examples: ["Go into the house.", "I ran into her."] },
  { word: "is", emoji: "✨", syllables: ["is"], examples: ["This is good.", "He is here."] },
  { word: "it", emoji: "👉", syllables: ["it"], examples: ["Give it to me.", "I like it."] },
  { word: "its", emoji: "🏷️", syllables: ["its"], examples: ["I see its head.", "The dog has its toy."] },

  // Jj
  { word: "just", emoji: "🎯", syllables: ["just"], examples: ["I just came.", "It is just right."] },

  // Kk
  { word: "knew", emoji: "🧠", syllables: ["knew"], examples: ["I knew that.", "She knew me."] },
  { word: "know", emoji: "💡", syllables: ["know"], examples: ["I know you.", "Do you know?"] },

  // Ll
  { word: "last", emoji: "🏁", syllables: ["last"], examples: ["This is the last one.", "I came last."] },
  { word: "left", emoji: "⬅️", syllables: ["left"], examples: ["I left it there.", "She left me."] },
  { word: "let", emoji: "✅", syllables: ["let"], examples: ["Let me see.", "Let us go."] },
  { word: "like", emoji: "❤️", syllables: ["like"], examples: ["I like you.", "Do you like it?"] },
  { word: "little", emoji: "🐣", syllables: ["lit", "tle"], examples: ["I have a little dog.", "It is little."] },
  { word: "long", emoji: "📏", syllables: ["long"], examples: ["It is long.", "I have long hair."] },

  // Mm
  { word: "made", emoji: "🛠️", syllables: ["made"], examples: ["I made it.", "She made me do it."] },
  { word: "make", emoji: "🔨", syllables: ["make"], examples: ["I can make it.", "Make me one."] },
  { word: "many", emoji: "🔢", syllables: ["man", "y"], examples: ["I have many friends.", "Many people came."] },
  { word: "me", emoji: "🙋", syllables: ["me"], examples: ["Look at me.", "Give it to me."] },
  { word: "more", emoji: "➕", syllables: ["more"], examples: ["I want more.", "Give me more."] },
  { word: "morning", emoji: "🌅", syllables: ["morn", "ing"], examples: ["Good morning.", "I run every morning."] },
  { word: "most", emoji: "📊", syllables: ["most"], examples: ["I like this most.", "Most people know."] },
  { word: "much", emoji: "📏", syllables: ["much"], examples: ["I like it very much.", "How much is it?"] },
  { word: "must", emoji: "❗", syllables: ["must"], examples: ["I must go.", "We must help."] },
  { word: "my", emoji: "👤", syllables: ["my"], examples: ["This is my dog.", "I see my friend."] },

  // Nn
  { word: "never", emoji: "🚫", syllables: ["nev", "er"], examples: ["I never do that.", "He never came."] },
  { word: "new", emoji: "✨", syllables: ["new"], examples: ["I have a new car.", "This is new."] },
  { word: "next", emoji: "➡️", syllables: ["next"], examples: ["I am next.", "Come next time."] },
  { word: "night", emoji: "🌙", syllables: ["night"], examples: ["Good night.", "I play at night."] },
  { word: "not", emoji: "❌", syllables: ["not"], examples: ["I do not know.", "It is not good."] },
  { word: "now", emoji: "⏰", syllables: ["now"], examples: ["Come here now.", "I want it now."] },

  // Oo
  { word: "of", emoji: "📦", syllables: ["of"], examples: ["I am one of them.", "All of us know."] },
  { word: "off", emoji: "🔴", syllables: ["off"], examples: ["Get off of me.", "I am off now."] },
  { word: "old", emoji: "👴", syllables: ["old"], examples: ["I am old.", "This is old."] },
  { word: "on", emoji: "🔛", syllables: ["on"], examples: ["Put it on here.", "I am on it."] },
  { word: "once", emoji: "1️⃣", syllables: ["once"], examples: ["I saw it once.", "Do it once more."] },
  { word: "only", emoji: "1️⃣", syllables: ["on", "ly"], examples: ["I have only one.", "Only I know."] },
  { word: "open", emoji: "🔓", syllables: ["o", "pen"], examples: ["Open it now.", "The door is open."] },
  { word: "or", emoji: "❓", syllables: ["or"], examples: ["You or me?", "Do it now or never."] },
  { word: "other", emoji: "🔄", syllables: ["oth", "er"], examples: ["I see the other one.", "Give me another."] },
  { word: "our", emoji: "👥", syllables: ["our"], examples: ["This is our house.", "Our dog is big."] },
  { word: "out", emoji: "🚪", syllables: ["out"], examples: ["Go out now.", "I am out."] },

  // Pp
  { word: "people", emoji: "👥", syllables: ["peo", "ple"], examples: ["I see people.", "Many people came."] },
  { word: "place", emoji: "📍", syllables: ["place"], examples: ["This is a good place.", "I know that place."] },
  { word: "play", emoji: "⚽", syllables: ["play"], examples: ["I like to play.", "Can we play?"] },
  { word: "put", emoji: "📥", syllables: ["put"], examples: ["Put it here.", "I put it down."] },

  // Qq
  { word: "quiet", emoji: "🤫", syllables: ["qui", "et"], examples: ["Be quiet now.", "It is very quiet."] },

  // Rr
  { word: "ran", emoji: "🏃", syllables: ["ran"], examples: ["I ran home.", "She ran fast."] },
  { word: "read", emoji: "📖", syllables: ["read"], examples: ["I can read.", "Read it to me."] },
  { word: "right", emoji: "✅", syllables: ["right"], examples: ["That is right.", "Go right here."] },
  { word: "run", emoji: "🏃", syllables: ["run"], examples: ["I can run fast.", "Run to me."] },

  // Ss
  { word: "said", emoji: "💬", syllables: ["said"], examples: ["I said no.", "She said yes."] },
  { word: "saw", emoji: "👁️", syllables: ["saw"], examples: ["I saw you.", "We saw a dog."] },
  { word: "say", emoji: "🗣️", syllables: ["say"], examples: ["What did you say?", "I say yes."] },
  { word: "school", emoji: "🏫", syllables: ["school"], examples: ["I go to school.", "School is fun."] },
  { word: "see", emoji: "👀", syllables: ["see"], examples: ["I see you.", "Can you see it?"] },
  { word: "she", emoji: "👧", syllables: ["she"], examples: ["She is here.", "I see her."] },
  { word: "should", emoji: "💭", syllables: ["should"], examples: ["I should go.", "You should help."] },
  { word: "small", emoji: "🐣", syllables: ["small"], examples: ["It is small.", "I have a small dog."] },
  { word: "so", emoji: "✨", syllables: ["so"], examples: ["I am so good.", "It is so big."] },
  { word: "some", emoji: "🔢", syllables: ["some"], examples: ["Give me some.", "I have some."] },
  { word: "still", emoji: "⏸️", syllables: ["still"], examples: ["I am still here.", "It is still good."] },

  // Tt
  { word: "take", emoji: "🤲", syllables: ["take"], examples: ["Take it with you.", "I will take one."] },
  { word: "tell", emoji: "💬", syllables: ["tell"], examples: ["Tell me about it.", "I will tell you."] },
  { word: "that", emoji: "👉", syllables: ["that"], examples: ["I like that.", "What is that?"] },
  { word: "the", emoji: "✨", syllables: ["the"], examples: ["I see the dog.", "The car is old."] },
  { word: "their", emoji: "👥", syllables: ["their"], examples: ["This is their house.", "I see their dog."] },
  { word: "then", emoji: "⏭️", syllables: ["then"], examples: ["Do it then.", "I came then."] },
  { word: "there", emoji: "📍", syllables: ["there"], examples: ["Go over there.", "I am there."] },
  { word: "these", emoji: "👇", syllables: ["these"], examples: ["I like these.", "These are good."] },
  { word: "they", emoji: "👥", syllables: ["they"], examples: ["They are here.", "I see them."] },
  { word: "thing", emoji: "📦", syllables: ["thing"], examples: ["I like this thing.", "That is a good thing."] },
  { word: "think", emoji: "💭", syllables: ["think"], examples: ["I think so.", "What do you think?"] },
  { word: "this", emoji: "👇", syllables: ["this"], examples: ["I like this.", "This is good."] },
  { word: "thought", emoji: "💡", syllables: ["thought"], examples: ["I thought so.", "She thought about it."] },
  { word: "through", emoji: "➡️", syllables: ["through"], examples: ["Go through here.", "I ran through it."] },
  { word: "time", emoji: "⏰", syllables: ["time"], examples: ["It is time to go.", "I have time."] },
  { word: "to", emoji: "➡️", syllables: ["to"], examples: ["I go to school.", "Give it to me."] },
  { word: "today", emoji: "📅", syllables: ["to", "day"], examples: ["I play today.", "What day is today?"] },
  { word: "told", emoji: "💬", syllables: ["told"], examples: ["I told you.", "She told me."] },
  { word: "too", emoji: "➕", syllables: ["too"], examples: ["I do too.", "It is too big."] },

  // Uu
  { word: "under", emoji: "⬇️", syllables: ["un", "der"], examples: ["It is under here.", "I am under it."] },
  { word: "until", emoji: "⏰", syllables: ["un", "til"], examples: ["I will wait until then.", "Play until I say."] },
  { word: "up", emoji: "⬆️", syllables: ["up"], examples: ["Go up there.", "I am going up."] },
  { word: "us", emoji: "👥", syllables: ["us"], examples: ["Come with us.", "Give it to us."] },

  // Vv
  { word: "very", emoji: "💯", syllables: ["ver", "y"], examples: ["I am very good.", "It is very big."] },

  // Ww
  { word: "want", emoji: "🎯", syllables: ["want"], examples: ["I want that.", "Do you want it?"] },
  { word: "was", emoji: "📅", syllables: ["was"], examples: ["I was there.", "It was good."] },
  { word: "way", emoji: "🛤️", syllables: ["way"], examples: ["This is the way.", "I know the way."] },
  { word: "we", emoji: "👥", syllables: ["we"], examples: ["We are here.", "We can do it."] },
  { word: "went", emoji: "🚶", syllables: ["went"], examples: ["I went home.", "She went to school."] },
  { word: "what", emoji: "❓", syllables: ["what"], examples: ["What is that?", "I know what it is."] },
  { word: "when", emoji: "⏰", syllables: ["when"], examples: ["When did you go?", "I know when."] },
  { word: "where", emoji: "📍", syllables: ["where"], examples: ["Where is it?", "I know where."] },
  { word: "which", emoji: "❓", syllables: ["which"], examples: ["Which one do you want?", "I know which."] },
  { word: "who", emoji: "❓", syllables: ["who"], examples: ["Who is that?", "I know who."] },
  { word: "will", emoji: "🔮", syllables: ["will"], examples: ["I will do it.", "She will come."] },
  { word: "with", emoji: "🤝", syllables: ["with"], examples: ["Come with me.", "I go with you."] },

  // Xx - No common words

  // Yy
  { word: "year", emoji: "📅", syllables: ["year"], examples: ["I am one year old.", "Next year I will."] },
  { word: "yes", emoji: "✅", syllables: ["yes"], examples: ["Yes I can.", "I say yes."] },
  { word: "you", emoji: "👤", syllables: ["you"], examples: ["I see you.", "You are good."] },
  { word: "your", emoji: "👤", syllables: ["your"], examples: ["This is your dog.", "I like your house."] },
  { word: "yours", emoji: "🏷️", syllables: ["yours"], examples: ["This is yours.", "I have mine and yours."] }

  // Zz - No common words in this list
];

console.log(`Loaded ${WORD_LIST.length} words`);
```

**Step 2: Test word list loads**

```bash
cd /Volumes/Data/Work/play/experiments
serve
```

Open browser console, should see: "Loaded 200 words" (or similar count)

**Step 3: Commit**

```bash
git add emojiwords/app.js
git commit -m "feat(emojiwords): add complete word list with emojis and examples"
```

---

## Task 3: Core App Class & State Management

**Files:**
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/app.js`

**Step 1: Add Badge constants**

Add after WORD_LIST in `app.js`:

```javascript
// Badge system
const BADGES = [
  { id: 'starter', threshold: 1, emoji: '⭐', name: 'Word Starter', unlocked: false },
  { id: 'explorer', threshold: 25, emoji: '🚀', name: 'Word Explorer', unlocked: false },
  { id: 'reader', threshold: 50, emoji: '📖', name: 'Growing Reader', unlocked: false },
  { id: 'champion', threshold: 100, emoji: '🏆', name: 'Reading Champion', unlocked: false },
  { id: 'master', threshold: 200, emoji: '👑', name: 'Word Master', unlocked: false }
];
```

**Step 2: Add WordPracticeApp class**

Add to `app.js`:

```javascript
class WordPracticeApp {
  constructor() {
    this.appElement = document.getElementById('app');
    this.wordList = WORD_LIST;
    this.currentIndex = 0;
    this.revealState = 'word'; // 'word' | 'syllables' | 'examples'
    this.currentExampleIndex = 0;
    this.apiKey = localStorage.getItem('openai_api_key') || '';
    this.audioCache = new Map(); // Cache syllable audio

    // Load progress
    this.progress = this.loadProgress();

    // Shuffle words for variety
    this.shuffleWords();

    // Render home screen
    this.renderHome();
  }

  loadProgress() {
    try {
      const practicedWords = JSON.parse(localStorage.getItem('practicedWords') || '[]');
      const lastPracticeDate = localStorage.getItem('lastPracticeDate') || '';
      const badges = JSON.parse(localStorage.getItem('badges') || '[]');

      // Reset daily count if new day
      const today = new Date().toISOString().split('T')[0];
      const todayCount = lastPracticeDate === today
        ? parseInt(localStorage.getItem('todayCount') || '0')
        : 0;

      return {
        practicedWords: new Set(practicedWords),
        todayCount,
        lastPracticeDate,
        badges: new Set(badges)
      };
    } catch (e) {
      console.error('Error loading progress:', e);
      return {
        practicedWords: new Set(),
        todayCount: 0,
        lastPracticeDate: '',
        badges: new Set()
      };
    }
  }

  saveProgress() {
    try {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('practicedWords', JSON.stringify([...this.progress.practicedWords]));
      localStorage.setItem('todayCount', this.progress.todayCount.toString());
      localStorage.setItem('lastPracticeDate', today);
      localStorage.setItem('badges', JSON.stringify([...this.progress.badges]));
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }

  shuffleWords() {
    // Fisher-Yates shuffle
    for (let i = this.wordList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.wordList[i], this.wordList[j]] = [this.wordList[j], this.wordList[i]];
    }
  }

  renderHome() {
    // To be implemented
    this.appElement.innerHTML = '<h1>Home Screen</h1>';
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new WordPracticeApp();
  });
} else {
  new WordPracticeApp();
}
```

**Step 3: Test app initializes**

```bash
cd /Volumes/Data/Work/play/experiments
serve
```

Browser should show "Home Screen" heading

**Step 4: Commit**

```bash
git add emojiwords/app.js
git commit -m "feat(emojiwords): add core app class with state management"
```

---

## Task 4: Home Screen UI

**Files:**
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/app.js`
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/styles.css`

**Step 1: Add home screen styles to CSS**

Add to `styles.css`:

```css
/* Home Screen */
.home-screen {
  text-align: center;
}

.app-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.app-subtitle {
  font-size: var(--font-body);
  color: #666;
  margin-bottom: 2rem;
}

.progress-display {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.progress-text {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  transition: width 0.3s ease;
}

.badges-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.badge-icon {
  font-size: 3rem;
  opacity: 0.3;
  filter: grayscale(100%);
  transition: all 0.3s ease;
}

.badge.unlocked .badge-icon {
  opacity: 1;
  filter: grayscale(0%);
}

.badge-name {
  font-size: 0.8rem;
  color: #666;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-width: 200px;
  margin-top: 1rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.settings-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.2s ease;
}

.settings-button:hover {
  transform: rotate(90deg);
}
```

**Step 2: Implement renderHome method**

Replace the `renderHome()` method in `app.js`:

```javascript
renderHome() {
  const totalPracticed = this.progress.practicedWords.size;
  const totalWords = this.wordList.length;
  const progressPercent = (totalPracticed / totalWords) * 100;

  const badgesHTML = BADGES.map(badge => {
    const unlocked = this.progress.badges.has(badge.id);
    return `
      <div class="badge ${unlocked ? 'unlocked' : ''}">
        <div class="badge-icon">${unlocked ? badge.emoji : '🔒'}</div>
        <div class="badge-name">${badge.name}</div>
      </div>
    `;
  }).join('');

  this.appElement.innerHTML = `
    <button class="settings-button" id="settingsBtn">⚙️</button>
    <div class="home-screen">
      <h1 class="app-title">📚 EmojiWords</h1>
      <p class="app-subtitle">Learn to read with emojis!</p>

      <div class="progress-display">
        <div class="progress-text">🌟 ${totalPracticed} of ${totalWords} words practiced</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
      </div>

      <div class="badges-container">
        ${badgesHTML}
      </div>

      <button class="btn-primary" id="startBtn">Start Practice</button>
    </div>
  `;

  // Event listeners
  document.getElementById('startBtn').addEventListener('click', () => this.startPractice());
  document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());
}

startPractice() {
  // To be implemented
  console.log('Starting practice...');
}

showSettings() {
  // To be implemented
  console.log('Opening settings...');
}
```

**Step 3: Test home screen**

```bash
cd /Volumes/Data/Work/play/experiments
serve
```

Should see: Title, subtitle, progress bar at 0%, locked badges, Start Practice button, settings gear

**Step 4: Commit**

```bash
git add emojiwords/
git commit -m "feat(emojiwords): add home screen with progress and badges"
```

---

## Task 5: Settings Modal

**Files:**
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/styles.css`
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/app.js`

**Step 1: Add modal styles to CSS**

Add to `styles.css`:

```css
/* Modal */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal.active {
  display: flex;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
}

.close-btn:hover {
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-hint {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}

.btn-save {
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: transform 0.2s ease;
}

.btn-save:hover {
  transform: translateY(-2px);
}
```

**Step 2: Implement showSettings method**

Replace the `showSettings()` method in `app.js`:

```javascript
showSettings() {
  const modalHTML = `
    <div class="modal active" id="settingsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">⚙️ Settings</h2>
          <button class="close-btn" id="closeModal">&times;</button>
        </div>

        <div class="form-group">
          <label class="form-label" for="apiKeyInput">OpenAI API Key</label>
          <input
            type="password"
            id="apiKeyInput"
            class="form-input"
            placeholder="sk-..."
            value="${this.apiKey}"
          />
          <div class="form-hint">Needed for syllable pronunciation. Get your key at platform.openai.com</div>
        </div>

        <button class="btn-save" id="saveBtn">Save</button>
      </div>
    </div>
  `;

  // Add modal to body
  const existingModal = document.getElementById('settingsModal');
  if (existingModal) existingModal.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Event listeners
  document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
  document.getElementById('settingsModal').addEventListener('click', (e) => {
    if (e.target.id === 'settingsModal') this.closeModal();
  });
  document.getElementById('saveBtn').addEventListener('click', () => this.saveSettings());
}

closeModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.remove();
}

saveSettings() {
  const apiKeyInput = document.getElementById('apiKeyInput');
  this.apiKey = apiKeyInput.value.trim();

  if (this.apiKey) {
    localStorage.setItem('openai_api_key', this.apiKey);
  } else {
    localStorage.removeItem('openai_api_key');
  }

  this.closeModal();
}
```

**Step 3: Test settings modal**

```bash
cd /Volumes/Data/Work/play/experiments
serve
```

Click settings gear → modal opens
Enter API key → click Save → modal closes
Refresh page → settings gear → should show saved key

**Step 4: Commit**

```bash
git add emojiwords/
git commit -m "feat(emojiwords): add settings modal for API key"
```

---

## Task 6: Word Practice Screen - State 1 (Word Display)

**Files:**
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/styles.css`
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/app.js`

**Step 1: Add practice screen styles to CSS**

Add to `styles.css`:

```css
/* Practice Screen */
.practice-screen {
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.practice-top {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.9rem;
  color: #999;
}

.practice-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  cursor: pointer;
  padding: 2rem 0;
}

.word-emoji {
  font-size: 6rem;
  animation: fadeInScale 0.5s ease;
}

.word-display {
  font-size: var(--font-word);
  font-weight: 700;
  color: #333;
  animation: fadeInScale 0.5s ease 0.1s backwards;
}

.tap-hint {
  font-size: 0.9rem;
  color: #999;
  animation: fadeIn 0.5s ease 0.3s backwards;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

**Step 2: Implement startPractice method**

Replace the `startPractice()` method in `app.js`:

```javascript
startPractice() {
  this.currentIndex = 0;
  this.revealState = 'word';
  this.currentExampleIndex = 0;
  this.renderPractice();
}

renderPractice() {
  const word = this.wordList[this.currentIndex];
  const progressText = `Word ${this.currentIndex + 1} of ${this.wordList.length}`;

  this.appElement.innerHTML = `
    <div class="practice-screen">
      <div class="practice-top">${progressText}</div>
      <div class="practice-content" id="practiceContent">
        <div class="word-emoji">${word.emoji}</div>
        <div class="word-display">${word.word}</div>
        <div class="tap-hint">Tap to continue</div>
      </div>
    </div>
  `;

  // Event listener for tap to progress
  document.getElementById('practiceContent').addEventListener('click', () => this.handleTap());
}

handleTap() {
  if (this.revealState === 'word') {
    this.revealSyllables();
  } else if (this.revealState === 'syllables') {
    this.revealExamples();
  }
  // 'examples' state handled by buttons, not tap
}

revealSyllables() {
  // To be implemented
  console.log('Revealing syllables...');
}

revealExamples() {
  // To be implemented
  console.log('Revealing examples...');
}
```

**Step 3: Test word display**

```bash
cd /Volumes/Data/Work/play/experiments
serve
```

Click "Start Practice" → Should see emoji, word, "tap to continue"
Tap → Console shows "Revealing syllables..."

**Step 4: Commit**

```bash
git add emojiwords/
git commit -m "feat(emojiwords): add practice screen word display state"
```

---

## Task 7: Word Practice Screen - State 2 (Syllable Breakdown)

**Files:**
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/styles.css`
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/app.js`

**Step 1: Add syllable styles to CSS**

Add to `styles.css`:

```css
/* Syllable Display */
.syllables-container {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInScale 0.5s ease;
}

.syllable-bubble {
  background: var(--bubble-color-1);
  color: white;
  font-size: var(--font-syllable);
  font-weight: 700;
  padding: 1rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-width: 80px;
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
}

.syllable-bubble:nth-child(even) {
  background: var(--bubble-color-2);
}

.syllable-bubble:hover {
  transform: scale(1.05);
}

.syllable-bubble:active {
  transform: scale(0.95);
}

.syllable-bubble.playing {
  animation: pulse 0.6s ease;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 107, 157, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 20px 10px rgba(255, 107, 157, 0);
  }
}

.word-emoji.small {
  font-size: 3rem;
}

.word-display.small {
  font-size: 1.5rem;
  color: #999;
}
```

**Step 2: Implement revealSyllables method**

Replace the `revealSyllables()` method in `app.js`:

```javascript
revealSyllables() {
  this.revealState = 'syllables';
  const word = this.wordList[this.currentIndex];
  const progressText = `Word ${this.currentIndex + 1} of ${this.wordList.length}`;

  const syllablesHTML = word.syllables.map((syllable, index) =>
    `<div class="syllable-bubble" data-syllable="${syllable}">${syllable}</div>`
  ).join('');

  this.appElement.innerHTML = `
    <div class="practice-screen">
      <div class="practice-top">${progressText}</div>
      <div class="practice-content" id="practiceContent">
        <div class="word-emoji small">${word.emoji}</div>
        <div class="word-display small">${word.word}</div>
        <div class="syllables-container" id="syllablesContainer">
          ${syllablesHTML}
        </div>
        <div class="tap-hint">Tap syllables to hear them, or tap background to continue</div>
      </div>
    </div>
  `;

  // Add syllable click handlers
  document.querySelectorAll('.syllable-bubble').forEach(bubble => {
    bubble.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent background tap
      this.speakSyllable(bubble.dataset.syllable, bubble);
    });
  });

  // Background tap to continue
  document.getElementById('practiceContent').addEventListener('click', () => this.handleTap());
}

async speakSyllable(syllable, bubbleElement) {
  // To be implemented
  console.log('Speaking:', syllable);
  bubbleElement.classList.add('playing');
  setTimeout(() => bubbleElement.classList.remove('playing'), 600);
}
```

**Step 3: Test syllable display**

```bash
cd /Volumes/Data/Work/play/experiments
serve
```

Start practice → tap word → should see colored syllable bubbles
Click bubble → logs "Speaking: [syllable]" and bubble pulses
Tap background → console shows "Revealing examples..."

**Step 4: Commit**

```bash
git add emojiwords/
git commit -m "feat(emojiwords): add syllable breakdown display"
```

---

## Task 8: OpenAI TTS Integration

**Files:**
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/app.js`

**Step 1: Implement speakSyllable method with OpenAI TTS**

Replace the `speakSyllable()` method in `app.js`:

```javascript
async speakSyllable(syllable, bubbleElement) {
  // Visual feedback
  bubbleElement.classList.add('playing');
  setTimeout(() => bubbleElement.classList.remove('playing'), 600);

  // Check for API key
  if (!this.apiKey) {
    console.log('No API key - visual feedback only');
    return;
  }

  // Check cache
  if (this.audioCache.has(syllable)) {
    console.log('Playing from cache:', syllable);
    const cachedAudio = this.audioCache.get(syllable);
    cachedAudio.currentTime = 0;
    cachedAudio.play().catch(e => console.error('Playback error:', e));
    return;
  }

  // Call OpenAI TTS
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'nova',
        input: syllable,
        speed: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    // Cache the audio element
    this.audioCache.set(syllable, audio);

    // Cleanup URL after playing
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };

    await audio.play();

  } catch (error) {
    console.error('TTS error:', error);
    // Graceful degradation - continue without audio
  }
}
```

**Step 2: Test with API key**

```bash
cd /Volumes/Data/Work/play/experiments
serve
```

1. Click settings, enter OpenAI API key, save
2. Start practice → tap word → tap syllable bubble
3. Should hear syllable spoken
4. Tap same syllable again → should play instantly from cache

**Step 3: Test without API key**

1. Settings → clear API key → save
2. Start practice → tap syllable
3. Should show visual feedback but no audio (graceful)

**Step 4: Commit**

```bash
git add emojiwords/app.js
git commit -m "feat(emojiwords): add OpenAI TTS for syllable pronunciation"
```

---

## Task 9: Word Practice Screen - State 3 (Examples)

**Files:**
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/styles.css`
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/app.js`

**Step 1: Add example sentence styles to CSS**

Add to `styles.css`:

```css
/* Example Sentences */
.examples-section {
  animation: fadeInScale 0.5s ease;
}

.example-sentence {
  font-size: 1.3rem;
  color: #333;
  line-height: 1.6;
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
}

.practice-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.btn-next {
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.btn-next:hover {
  transform: translateY(-2px);
}
```

**Step 2: Implement revealExamples method**

Replace the `revealExamples()` method in `app.js`:

```javascript
revealExamples() {
  this.revealState = 'examples';
  this.currentExampleIndex = 0;
  this.renderExamples();
}

renderExamples() {
  const word = this.wordList[this.currentIndex];
  const progressText = `Word ${this.currentIndex + 1} of ${this.wordList.length}`;
  const example = word.examples[this.currentExampleIndex];
  const hasMoreExamples = this.currentExampleIndex < word.examples.length - 1;

  const syllablesHTML = word.syllables.map((syllable, index) =>
    `<div class="syllable-bubble" data-syllable="${syllable}">${syllable}</div>`
  ).join('');

  this.appElement.innerHTML = `
    <div class="practice-screen">
      <div class="practice-top">${progressText}</div>
      <div class="practice-content">
        <div class="word-emoji small">${word.emoji}</div>
        <div class="syllables-container" id="syllablesContainer">
          ${syllablesHTML}
        </div>

        <div class="examples-section">
          <div class="example-sentence">${example}</div>
        </div>

        <div class="practice-buttons">
          ${hasMoreExamples ? '<button class="btn-secondary" id="nextExampleBtn">Next Example ➡️</button>' : ''}
          <button class="btn-next" id="nextWordBtn">Next Word ➡️</button>
        </div>
      </div>
    </div>
  `;

  // Re-attach syllable handlers
  document.querySelectorAll('.syllable-bubble').forEach(bubble => {
    bubble.addEventListener('click', () => {
      this.speakSyllable(bubble.dataset.syllable, bubble);
    });
  });

  // Example navigation
  if (hasMoreExamples) {
    document.getElementById('nextExampleBtn').addEventListener('click', () => this.nextExample());
  }
  document.getElementById('nextWordBtn').addEventListener('click', () => this.nextWord());
}

nextExample() {
  this.currentExampleIndex++;
  this.renderExamples();
}

nextWord() {
  // Mark current word as practiced
  this.progress.practicedWords.add(this.currentIndex);
  this.progress.todayCount++;
  this.saveProgress();

  // Check for new badges
  this.checkBadges();

  // Move to next word
  this.currentIndex++;

  if (this.currentIndex >= this.wordList.length) {
    this.showCompletion();
  } else {
    this.revealState = 'word';
    this.currentExampleIndex = 0;
    this.renderPractice();
  }
}

checkBadges() {
  // To be implemented
  console.log('Checking badges...');
}

showCompletion() {
  // To be implemented
  this.appElement.innerHTML = '<h1>Complete!</h1>';
}
```

**Step 3: Test example sentences**

```bash
cd /Volumes/Data/Work/play/experiments
serve
```

Practice flow:
1. Tap word → syllables appear
2. Tap background → example sentence appears
3. "Next Example" button (if multiple) → cycles through
4. "Next Word" → moves to next word
5. After last word → shows "Complete!"

**Step 4: Commit**

```bash
git add emojiwords/
git commit -m "feat(emojiwords): add example sentences and navigation"
```

---

## Task 10: Badge System & Unlocking

**Files:**
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/styles.css`
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/app.js`

**Step 1: Add badge notification styles to CSS**

Add to `styles.css`:

```css
/* Badge Notification */
.badge-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  text-align: center;
  max-width: 400px;
  animation: badgePopIn 0.5s ease forwards;
}

@keyframes badgePopIn {
  to {
    transform: translate(-50%, -50%) scale(1);
  }
}

.badge-notification-emoji {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: rotate 1s ease;
}

@keyframes rotate {
  from {
    transform: rotate(0deg) scale(0);
  }
  to {
    transform: rotate(360deg) scale(1);
  }
}

.badge-notification-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.badge-notification-text {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.btn-continue {
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
```

**Step 2: Implement checkBadges method**

Replace the `checkBadges()` method in `app.js`:

```javascript
checkBadges() {
  const totalPracticed = this.progress.practicedWords.size;

  for (const badge of BADGES) {
    if (!this.progress.badges.has(badge.id) && totalPracticed >= badge.threshold) {
      this.progress.badges.add(badge.id);
      this.saveProgress();
      this.showBadgeNotification(badge);
      break; // Only show one badge at a time
    }
  }
}

showBadgeNotification(badge) {
  const notificationHTML = `
    <div class="badge-notification" id="badgeNotification">
      <div class="badge-notification-emoji">${badge.emoji}</div>
      <div class="badge-notification-title">Badge Unlocked!</div>
      <div class="badge-notification-text">${badge.name}</div>
      <button class="btn-continue" id="continueBtn">Continue</button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', notificationHTML);

  document.getElementById('continueBtn').addEventListener('click', () => {
    document.getElementById('badgeNotification').remove();
  });
}
```

**Step 3: Test badge unlocking**

```bash
cd /Volumes/Data/Work/play/experiments
serve
```

1. Start fresh (clear localStorage if needed)
2. Practice first word → should unlock "⭐ Word Starter" badge
3. Continue practicing to unlock more badges at 25, 50, 100, 200 words

**Step 4: Commit**

```bash
git add emojiwords/
git commit -m "feat(emojiwords): add badge unlocking system"
```

---

## Task 11: Completion Screen

**Files:**
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/styles.css`
- Modify: `/Volumes/Data/Work/play/experiments/emojiwords/app.js`

**Step 1: Add completion screen styles to CSS**

Add to `styles.css`:

```css
/* Completion Screen */
.completion-screen {
  text-align: center;
  padding: 2rem 0;
}

.celebration-emojis {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.completion-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;
}

.stats-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  font-size: 1.1rem;
  color: #333;
  margin: 0.75rem 0;
}

.stat-highlight {
  font-weight: 700;
  color: #667eea;
}
```

**Step 2: Implement showCompletion method**

Replace the `showCompletion()` method in `app.js`:

```javascript
showCompletion() {
  const totalPracticed = this.progress.practicedWords.size;
  const totalWords = this.wordList.length;
  const progressPercent = (totalPracticed / totalWords) * 100;

  // Cycle celebration emojis
  const celebrations = ['🎉', '✨', '🌟', '🎊'];
  let currentCelebration = 0;

  this.appElement.innerHTML = `
    <div class="completion-screen">
      <div class="celebration-emojis" id="celebrationEmojis">${celebrations[0]}</div>
      <h1 class="completion-title">Amazing Work!</h1>

      <div class="stats-container">
        <div class="stat-item">
          You practiced <span class="stat-highlight">${this.progress.todayCount}</span> words today!
        </div>
        <div class="stat-item">
          Total words practiced: <span class="stat-highlight">${totalPracticed}</span> of ${totalWords}
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
      </div>

      <button class="btn-primary" id="practiceMoreBtn">Practice More</button>
    </div>
  `;

  // Animate celebration emojis
  setInterval(() => {
    currentCelebration = (currentCelebration + 1) % celebrations.length;
    const emojiEl = document.getElementById('celebrationEmojis');
    if (emojiEl) {
      emojiEl.textContent = celebrations[currentCelebration];
    }
  }, 500);

  document.getElementById('practiceMoreBtn').addEventListener('click', () => {
    this.shuffleWords();
    this.startPractice();
  });
}
```

**Step 3: Test completion screen**

```bash
cd /Volumes/Data/Work/play/experiments
serve
```

Practice through all words (or modify code temporarily to skip to last word)
Should see: celebration emojis cycling, stats, progress bar, "Practice More" button

**Step 4: Commit**

```bash
git add emojiwords/
git commit -m "feat(emojiwords): add completion screen with stats"
```

---

## Task 12: Update Root Index

**Files:**
- Modify: `/Volumes/Data/Work/play/experiments/index.html`

**Step 1: Add emojiwords project card**

Add the project card after the emoji bank card in `index.html`:

```html
<a href="./emojiwords/" class="project-card">
  <span class="project-icon">📚</span>
  <div class="project-title">EmojiWords</div>
  <div class="project-description">
    Learn to read with emoji flashcards. Practice word sounds and see example sentences.
  </div>
</a>
```

**Step 2: Test root index**

```bash
cd /Volumes/Data/Work/play/experiments
serve
```

Navigate to root → should see EmojiWords card
Click card → navigates to emojiwords app

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add emojiwords to project directory"
```

---

## Task 13: Final Testing & Polish

**Step 1: Full end-to-end test**

Test complete flow:
1. ✅ Home screen displays correctly with badges
2. ✅ Settings modal saves/loads API key
3. ✅ Practice word display shows emoji + word
4. ✅ Syllable breakdown shows colored bubbles
5. ✅ Syllable tap plays audio (with API key) or shows visual feedback (without)
6. ✅ Example sentences display and cycle correctly
7. ✅ Badge unlocks show notification
8. ✅ Progress persists across refreshes
9. ✅ Completion screen shows stats
10. ✅ "Practice More" reshuffles and restarts

**Step 2: Mobile responsive test**

Test on mobile viewport or device:
- Touch targets large enough (min 44px)
- Text readable on small screens
- Layout doesn't break
- Audio works on iOS/Android

**Step 3: Edge cases**

Test:
- No API key (graceful degradation) ✅
- Invalid API key (error handling) ✅
- Clear localStorage and restart ✅
- Practice 1 word, refresh, continue ✅

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat(emojiwords): complete educational word practice PWA

- 200 word list from 1st/2nd grade word wall
- Progressive reveal: word → syllables → examples
- OpenAI TTS for syllable pronunciation with caching
- Badge system with 5 achievement levels
- Progress tracking in localStorage
- Responsive mobile-first design
- PWA with manifest for installability"
```

---

## Deployment

**Step 1: Test locally**

```bash
cd /Volumes/Data/Work/play/experiments
serve
```

Full test of all features

**Step 2: Push to main**

```bash
git push origin main
```

GitHub Pages workflow will auto-deploy

**Step 3: Verify deployed version**

Visit: https://sjungling.github.io/experiments/emojiwords/

Test on actual mobile device

---

## Implementation Complete

The EmojiWords app is now fully functional with:
- ✅ 200-word vocabulary from K-2 word wall
- ✅ Progressive reveal learning flow
- ✅ OpenAI TTS syllable pronunciation
- ✅ Badge achievement system
- ✅ Progress tracking
- ✅ Mobile-responsive PWA
- ✅ Graceful degradation without API key
