const emojiInput = document.getElementById("emojiInput");
const generateBtn = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const storyOutput = document.getElementById("storyOutput");
const storyText = document.getElementById("storyText");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeModal = document.getElementById("closeModal");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKey = document.getElementById("saveApiKey");
const clearApiKey = document.getElementById("clearApiKey");
const apiStatus = document.getElementById("apiStatus");
const apiStatusText = document.getElementById("apiStatusText");
const readAloudBtn = document.getElementById("readAloudBtn");
const stopReadingBtn = document.getElementById("stopReadingBtn");
const voiceSettingsBtn = document.getElementById("voiceSettingsBtn");
const voiceControls = document.getElementById("voiceControls");
const voiceSelect = document.getElementById("voiceSelect");
const speedRange = document.getElementById("speedRange");
const speedValue = document.getElementById("speedValue");
const settingsVoiceSelect = document.getElementById("settingsVoiceSelect");
const settingsSpeedRange = document.getElementById("settingsSpeedRange");
const settingsSpeedValue = document.getElementById("settingsSpeedValue");

let apiKey = "";
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let voices = [];

// Initialize app
function init() {
  loadApiKey();
  setupEmojiInput();
  updateApiStatus();
  initSpeech();

  // Check if API key exists on startup
  if (!apiKey) {
    setTimeout(() => {
      showSettings();
    }, 500);
  }
}

// Speech Synthesis Setup
function initSpeech() {
  if ("speechSynthesis" in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    // Setup speed control for story output
    speedRange.addEventListener("input", function () {
      speedValue.textContent = this.value + "x";
      saveVoicePreferences();
    });

    // Setup voice selection change for story output
    voiceSelect.addEventListener("change", function () {
      saveVoicePreferences();
    });

    // Setup speed control for settings
    settingsSpeedRange.addEventListener("input", function () {
      settingsSpeedValue.textContent = this.value + "x";
      speedRange.value = this.value;
      speedValue.textContent = this.value + "x";
      saveVoicePreferences();
    });

    // Setup voice selection change for settings
    settingsVoiceSelect.addEventListener("change", function () {
      voiceSelect.value = this.value;
      saveVoicePreferences();
    });
  } else {
    readAloudBtn.style.display = "none";
    console.log("Speech synthesis not supported");
  }
}

function loadVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";
  settingsVoiceSelect.innerHTML = "";

  // Filter for English voices and prioritize quality ones
  const englishVoices = voices.filter(
    (voice) =>
      voice.lang.startsWith("en") ||
      voice.lang.includes("US") ||
      voice.lang.includes("GB")
  );

  // Add all English voices to both selects
  englishVoices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;

    const settingsOption = document.createElement("option");
    settingsOption.value = index;
    settingsOption.textContent = `${voice.name} (${voice.lang})`;

    // Mark default voice
    if (voice.default) {
      option.selected = true;
      settingsOption.selected = true;
    }

    voiceSelect.appendChild(option);
    settingsVoiceSelect.appendChild(settingsOption);
  });

  // If no English voices, add all voices
  if (englishVoices.length === 0) {
    voices.forEach((voice, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${voice.name} (${voice.lang})`;

      const settingsOption = document.createElement("option");
      settingsOption.value = index;
      settingsOption.textContent = `${voice.name} (${voice.lang})`;

      voiceSelect.appendChild(option);
      settingsVoiceSelect.appendChild(settingsOption);
    });
  }

  // Load saved voice preferences
  loadVoicePreferences();
}

function readStoryAloud() {
  const text = storyText.textContent;

  if (!text || text.includes("❌") || text.includes("Oops!")) {
    showError("No story to read! Generate a story first. 📖");
    return;
  }

  // Stop any current speech
  if (currentUtterance) {
    speechSynthesis.cancel();
  }

  // Create new utterance
  currentUtterance = new SpeechSynthesisUtterance(text);

  // Get selected voice
  const selectedVoiceIndex = voiceSelect.value;
  if (voices[selectedVoiceIndex]) {
    currentUtterance.voice = voices[selectedVoiceIndex];
  }

  // Set speech rate
  currentUtterance.rate = parseFloat(speedRange.value);

  // Set pitch (slightly higher for kid-friendly tone)
  currentUtterance.pitch = 1.1;

  // Event handlers
  currentUtterance.onstart = function () {
    readAloudBtn.style.display = "none";
    stopReadingBtn.style.display = "inline-flex";
    readAloudBtn.disabled = true;
  };

  currentUtterance.onend = function () {
    readAloudBtn.style.display = "inline-flex";
    stopReadingBtn.style.display = "none";
    readAloudBtn.disabled = false;
    currentUtterance = null;
  };

  currentUtterance.onerror = function (event) {
    console.error("Speech synthesis error:", event);
    showError("Sorry, there was an error reading the story. 🔊");
    readAloudBtn.style.display = "inline-flex";
    stopReadingBtn.style.display = "none";
    readAloudBtn.disabled = false;
  };

  // Start speaking
  speechSynthesis.speak(currentUtterance);
}

function stopReading() {
  if (currentUtterance) {
    // Clear the error handler to prevent it from showing an error when we cancel
    currentUtterance.onerror = null;
    speechSynthesis.cancel();
    readAloudBtn.style.display = "inline-flex";
    stopReadingBtn.style.display = "none";
    readAloudBtn.disabled = false;
    currentUtterance = null;
  }
}

function toggleVoiceSettings() {
  voiceControls.classList.toggle("show");
}

// Voice preference management
function saveVoicePreferences() {
  const preferences = {
    voiceIndex: voiceSelect.value,
    speed: speedRange.value,
  };
  localStorage.setItem("voice_preferences", JSON.stringify(preferences));
}

function loadVoicePreferences() {
  const saved = localStorage.getItem("voice_preferences");
  if (saved) {
    try {
      const preferences = JSON.parse(saved);
      if (preferences.voiceIndex !== undefined) {
        voiceSelect.value = preferences.voiceIndex;
        settingsVoiceSelect.value = preferences.voiceIndex;
      }
      if (preferences.speed !== undefined) {
        speedRange.value = preferences.speed;
        settingsSpeedRange.value = preferences.speed;
        speedValue.textContent = preferences.speed + "x";
        settingsSpeedValue.textContent = preferences.speed + "x";
      }
    } catch (e) {
      console.error("Error loading voice preferences:", e);
    }
  }
}

// API Key Management
function loadApiKey() {
  apiKey = localStorage.getItem("anthropic_api_key") || "";
  apiKeyInput.value = apiKey;
}

function saveApiKeyToStorage() {
  const newKey = apiKeyInput.value.trim();
  if (newKey) {
    localStorage.setItem("anthropic_api_key", newKey);
    apiKey = newKey;
    showSuccess("API key saved successfully! 🔑");
  } else {
    showError("Please enter a valid API key");
    return;
  }
  updateApiStatus();
  hideSettings();
}

function clearApiKeyFromStorage() {
  localStorage.removeItem("anthropic_api_key");
  apiKey = "";
  apiKeyInput.value = "";
  updateApiStatus();
  showSuccess("API key cleared");
}

function updateApiStatus() {
  if (apiKey) {
    apiStatus.className = "status-indicator status-connected";
    apiStatusText.textContent = "API Key Connected";
    generateBtn.disabled = false;
  } else {
    apiStatus.className = "status-indicator status-disconnected";
    apiStatusText.textContent = "API Key Required";
    generateBtn.disabled = true;
  }
}

// Modal Management
function showSettings() {
  settingsModal.classList.add("show");
  apiKeyInput.focus();
}

function hideSettings() {
  settingsModal.classList.remove("show");
}

// Function to trigger emoji keyboard on iOS
function setupEmojiInput() {
  emojiInput.setAttribute("inputmode", "text");

  emojiInput.addEventListener("focus", function () {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      setTimeout(() => {
        this.focus();
      }, 100);
    }
  });
}

// Generate story using Claude API
async function generateStory() {
  const emojis = emojiInput.value.trim();

  if (!emojis) {
    showError("Please enter some emojis first! 🎭");
    return;
  }

  if (!apiKey) {
    showError("Please set your API key in settings first! ⚙️");
    showSettings();
    return;
  }

  try {
    setLoading(true);
    hideStory();

    const prompt = `Create a fun, imaginative, and kid-friendly story inspired by these emojis: ${emojis}

Please make it:
- Appropriate for children ages 5-12
- Creative and engaging
- 3-4 paragraphs long (about 4-6 sentences total)
- Include line breaks between the title and all paragraphs
- Use the emojis as inspiration for characters, settings, or story elements
- Have a positive, uplifting message
- DO NOT include any emojis in the actual story text - only use words
- Write in a storytelling style that's perfect for reading aloud

Turn these emojis into a magical adventure story!`;

    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [{ type: "text", text: prompt }],
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const story = data.content[0].text;
        // replace `\n` with line breaks
        showStory(story.replace(/\n/g, "<br>"));
      });
  } catch (error) {
    console.error("Error generating story:", error);
    if (error.message.includes("API key")) {
      showError("❌ " + error.message + " Check your settings! ⚙️");
      setTimeout(showSettings, 2000);
    } else {
      showError(
        "Oops! Something went wrong creating your story. Please try again! 🔄"
      );
    }
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  generateBtn.disabled = isLoading || !apiKey;
  generateBtn.textContent = isLoading ? "Creating Story..." : "Generate Story";

  if (isLoading) {
    loading.classList.add("show");
  } else {
    loading.classList.remove("show");
  }
}

function showStory(story) {
  storyText.innerHTML = story;
  storyOutput.classList.remove("error");
  storyOutput.classList.add("show");
}

function showError(message) {
  storyText.textContent = message;
  storyOutput.classList.add("error");
  storyOutput.classList.add("show");
}

function showSuccess(message) {
  storyText.textContent = message;
  storyOutput.classList.remove("error");
  storyOutput.classList.add("show");
  setTimeout(hideStory, 3000);
}

function hideStory() {
  storyOutput.classList.remove("show");
}

// Event listeners
generateBtn.addEventListener("click", generateStory);
settingsBtn.addEventListener("click", showSettings);
closeModal.addEventListener("click", hideSettings);
saveApiKey.addEventListener("click", saveApiKeyToStorage);
clearApiKey.addEventListener("click", clearApiKeyFromStorage);
readAloudBtn.addEventListener("click", readStoryAloud);
stopReadingBtn.addEventListener("click", stopReading);
voiceSettingsBtn.addEventListener("click", toggleVoiceSettings);

// Modal click outside to close
settingsModal.addEventListener("click", function (e) {
  if (e.target === settingsModal) {
    hideSettings();
  }
});

// Enter key to save API key
apiKeyInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    saveApiKeyToStorage();
  }
});

// Allow Enter key to generate (with Shift+Enter for new lines)
emojiInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    generateStory();
  }
});

// Initialize app
init();

// Auto-focus input on page load for mobile
window.addEventListener("load", function () {
  if (apiKey) {
    setTimeout(() => {
      emojiInput.focus();
    }, 500);
  }
});
