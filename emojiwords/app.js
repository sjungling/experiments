// EmojiWords - Educational sight word practice app
// Main application logic

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

// Badge system
const BADGES = [
  { id: 'starter', threshold: 1, emoji: '⭐', name: 'Word Starter' },
  { id: 'explorer', threshold: 25, emoji: '🚀', name: 'Word Explorer' },
  { id: 'reader', threshold: 50, emoji: '📖', name: 'Growing Reader' },
  { id: 'champion', threshold: 100, emoji: '🏆', name: 'Reading Champion' },
  { id: 'master', threshold: 200, emoji: '👑', name: 'Word Master' }
];

class WordPracticeApp {
  constructor() {
    this.appElement = document.getElementById('app');
    this.wordList = WORD_LIST;
    this.currentIndex = 0;
    this.revealState = 'word'; // 'word' | 'syllables' | 'examples'
    this.currentExampleIndex = 0;
    this.apiKey = localStorage.getItem('openai_api_key') || '';
    this.audioCache = new Map(); // Cache syllable audio
    this.celebrationInterval = null; // Track celebration interval for cleanup

    // Load progress
    this.progress = this.loadProgress();

    // Shuffle words for variety
    this.shuffleWords();

    // Handle browser back/forward navigation
    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.word) {
        const wordIndex = this.findWordIndex(event.state.word);
        if (wordIndex !== -1) {
          this.currentIndex = wordIndex;
          this.renderPractice();
        } else {
          this.returnHome();
        }
      } else {
        this.returnHome();
      }
    });

    // Check for URL parameter and start practice if word is specified
    const urlWord = this.getWordFromURL();
    if (urlWord) {
      const wordIndex = this.findWordIndex(urlWord);
      if (wordIndex !== -1) {
        this.currentIndex = wordIndex;
        this.renderPractice();
        return;
      }
    }

    // Render home screen if no valid word in URL
    this.renderHome();
  }

  getWordFromURL() {
    // Support both query parameters (?word=family) and hash parameters (#word=family)
    const urlParams = new URLSearchParams(window.location.search);
    const queryWord = urlParams.get('word');

    if (queryWord) {
      return queryWord.toLowerCase();
    }

    // Check hash parameters
    const hash = window.location.hash.substring(1); // Remove the #
    const hashParams = new URLSearchParams(hash);
    const hashWord = hashParams.get('word');

    return hashWord ? hashWord.toLowerCase() : null;
  }

  findWordIndex(targetWord) {
    // Find the index of the word in the current (shuffled) word list
    return this.wordList.findIndex(item => item.word.toLowerCase() === targetWord);
  }

  updateURL(word) {
    // Update URL with current word using hash parameters
    const newURL = `${window.location.pathname}#word=${encodeURIComponent(word)}`;
    window.history.pushState({ word }, '', newURL);
  }

  loadProgress() {
    try {
      // practicedWords contains word strings (e.g., "family", "school")
      // This ensures progress persists across sessions even when word list is shuffled
      const practicedWords = JSON.parse(localStorage.getItem('practicedWords') || '[]');
      const lastPracticeDate = localStorage.getItem('lastPracticeDate') || '';
      const badges = JSON.parse(localStorage.getItem('badges') || '[]');

      // Reset daily count if new day
      const today = new Date().toISOString().split('T')[0];
      const todayCount = lastPracticeDate === today
        ? parseInt(localStorage.getItem('todayCount') || '0', 10)
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
    // Clear celebration interval if it exists
    if (this.celebrationInterval) {
      clearInterval(this.celebrationInterval);
      this.celebrationInterval = null;
    }

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
    // Clear celebration interval if it exists
    if (this.celebrationInterval) {
      clearInterval(this.celebrationInterval);
      this.celebrationInterval = null;
    }

    // Find first uncompleted word
    this.currentIndex = this.wordList.findIndex(word =>
      !this.progress.practicedWords.has(word.word)
    );

    // If all completed, start from beginning
    if (this.currentIndex === -1) {
      this.currentIndex = 0;
    }

    this.revealState = 'word';
    this.currentExampleIndex = 0;
    this.renderPractice();
  }

  returnHome() {
    // Clear URL parameter
    window.history.replaceState(null, '', window.location.pathname);
    this.renderHome();
  }

  renderPractice() {
    const word = this.wordList[this.currentIndex];
    const progressText = `Word ${this.currentIndex + 1} of ${this.wordList.length}`;

    // Update URL with current word
    this.updateURL(word.word);

    this.appElement.innerHTML = `
    <div class="practice-screen">
      <div class="practice-top">
        <button class="back-btn" id="backBtn">← Back</button>
        <span>${progressText}</span>
      </div>
      <div class="practice-content" id="practiceContent">
        <div class="word-emoji">${word.emoji}</div>
        <div class="word-display">${word.word}</div>
        <div class="tap-hint">Tap to continue</div>
      </div>
    </div>
  `;

    // Event listeners
    document.getElementById('backBtn').addEventListener('click', () => this.returnHome());
    document.getElementById('practiceContent').addEventListener('click', () => this.handleTap());

    // Add click handler to word display for pronunciation
    document.querySelector('.word-display').addEventListener('click', (e) => {
      e.stopPropagation();
      this.speakWord(word.word);
    });
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
    this.revealState = 'syllables';
    const word = this.wordList[this.currentIndex];
    const progressText = `Word ${this.currentIndex + 1} of ${this.wordList.length}`;

    const syllablesHTML = word.syllables.map((syllable, index) =>
      `<div class="syllable-bubble" data-syllable="${syllable}">${syllable}</div>`
    ).join('');

    this.appElement.innerHTML = `
    <div class="practice-screen">
      <div class="practice-top">
        <button class="back-btn" id="backBtn">← Back</button>
        <span>${progressText}</span>
      </div>
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

    // Event listeners
    document.getElementById('backBtn').addEventListener('click', () => this.returnHome());

    // Add syllable click handlers
    document.querySelectorAll('.syllable-bubble').forEach(bubble => {
      bubble.addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent background tap
        try {
          await this.speakSyllable(bubble.dataset.syllable, bubble);
        } catch (error) {
          console.error('Error speaking syllable:', error);
          // Visual feedback continues even on error
        }
      });
    });

    // Add click handler to word display for pronunciation
    document.querySelector('.word-display').addEventListener('click', (e) => {
      e.stopPropagation();
      this.speakWord(word.word);
    });

    // Background tap to continue
    document.getElementById('practiceContent').addEventListener('click', () => this.handleTap());
  }

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

  async speakWord(word) {
    // Visual feedback
    const wordDisplay = document.querySelector('.word-display');
    if (wordDisplay) {
      wordDisplay.classList.add('playing');
      setTimeout(() => wordDisplay.classList.remove('playing'), 600);
    }

    // Check for API key
    if (!this.apiKey) {
      console.log('No API key - visual feedback only');
      return;
    }

    // Check cache with word prefix to avoid syllable collision
    const cacheKey = `word_${word}`;
    if (this.audioCache.has(cacheKey)) {
      console.log('Playing word from cache:', word);
      const cachedAudio = this.audioCache.get(cacheKey);
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
          input: word,
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
      this.audioCache.set(cacheKey, audio);

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
      <div class="practice-top">
        <button class="back-btn" id="backBtn">← Back</button>
        <span>${progressText}</span>
      </div>
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

    // Event listeners
    document.getElementById('backBtn').addEventListener('click', () => this.returnHome());

    // Re-attach syllable handlers
    document.querySelectorAll('.syllable-bubble').forEach(bubble => {
      bubble.addEventListener('click', async () => {
        try {
          await this.speakSyllable(bubble.dataset.syllable, bubble);
        } catch (error) {
          console.error('Error speaking syllable:', error);
        }
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
    // Mark current word as practiced (store word string, not index)
    this.progress.practicedWords.add(this.wordList[this.currentIndex].word);
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
    this.celebrationInterval = setInterval(() => {
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

  showSettings() {
    const modalHTML = `
    <div class="modal active" id="settingsModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title" id="modalTitle">⚙️ Settings</h2>
          <button class="close-btn" id="closeModal" aria-label="Close settings">&times;</button>
        </div>

        <div class="form-group">
          <label class="form-label" for="apiKeyInput">OpenAI API Key</label>
          <input
            type="password"
            id="apiKeyInput"
            class="form-input"
            placeholder="sk-..."
            value="${this.apiKey}"
            autocomplete="off"
          />
          <div class="form-hint">Needed for syllable pronunciation. Get your key at platform.openai.com</div>
          <div class="error-message" id="apiKeyError" style="display: none;"></div>
        </div>

        <button class="btn-save" id="saveBtn">Save</button>
      </div>
    </div>
  `;

    // Add modal to body
    const existingModal = document.getElementById('settingsModal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Focus the API key input
    const apiKeyInput = document.getElementById('apiKeyInput');
    setTimeout(() => apiKeyInput.focus(), 0);

    // Keyboard escape handler
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Store handler reference for cleanup
    document.getElementById('settingsModal').dataset.escapeHandler = 'attached';

    // Event listeners
    document.getElementById('closeModal').addEventListener('click', () => {
      document.removeEventListener('keydown', handleEscape);
      this.closeModal();
    });
    document.getElementById('settingsModal').addEventListener('click', (e) => {
      if (e.target.id === 'settingsModal') {
        document.removeEventListener('keydown', handleEscape);
        this.closeModal();
      }
    });
    document.getElementById('saveBtn').addEventListener('click', () => this.saveSettings());
  }

  closeModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.remove();
  }

  saveSettings() {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKeyError = document.getElementById('apiKeyError');
    const apiKeyValue = apiKeyInput.value.trim();

    // Clear previous error
    apiKeyError.style.display = 'none';
    apiKeyError.textContent = '';

    // Validate API key format if provided
    if (apiKeyValue && !apiKeyValue.startsWith('sk-')) {
      apiKeyError.textContent = 'API key must start with "sk-"';
      apiKeyError.style.display = 'block';
      apiKeyInput.focus();
      return;
    }

    this.apiKey = apiKeyValue;

    if (this.apiKey) {
      localStorage.setItem('openai_api_key', this.apiKey);
    } else {
      localStorage.removeItem('openai_api_key');
    }

    this.closeModal();
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
