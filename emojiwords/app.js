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
  { id: 'starter', threshold: 1, emoji: '⭐', name: 'Word Starter', unlocked: false },
  { id: 'explorer', threshold: 25, emoji: '🚀', name: 'Word Explorer', unlocked: false },
  { id: 'reader', threshold: 50, emoji: '📖', name: 'Growing Reader', unlocked: false },
  { id: 'champion', threshold: 100, emoji: '🏆', name: 'Reading Champion', unlocked: false },
  { id: 'master', threshold: 200, emoji: '👑', name: 'Word Master', unlocked: false }
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
