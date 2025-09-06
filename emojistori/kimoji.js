const emojiInput = document.getElementById("emojiInput");
const generateBtn = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const storyOutput = document.getElementById("storyOutput");
const storyText = document.getElementById("storyText");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeModal = document.getElementById("closeModal");
const anthropicApiKeyInput = document.getElementById("anthropicApiKeyInput");
const openaiApiKeyInput = document.getElementById("openaiApiKeyInput");
const saveApiKeys = document.getElementById("saveApiKeys");
const clearAnthropicKey = document.getElementById("clearAnthropicKey");
const clearOpenaiKey = document.getElementById("clearOpenaiKey");
const providerAnthropic = document.getElementById("providerAnthropic");
const providerOpenAI = document.getElementById("providerOpenAI");
const ttsBrowser = document.getElementById("ttsBrowser");
const ttsOpenAI = document.getElementById("ttsOpenAI");
const anthropicKeySection = document.getElementById("anthropicKeySection");
const openaiKeySection = document.getElementById("openaiKeySection");
const apiInfo = document.getElementById("apiInfo");
const apiInfoText = document.getElementById("apiInfoText");
const apiInfoLink = document.getElementById("apiInfoLink");
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
const audioTab = document.getElementById("audioTab");
const aiTab = document.getElementById("aiTab");
const audioContent = document.getElementById("audioContent");
const aiContent = document.getElementById("aiContent");
const anthropicStatus = document.getElementById("anthropicStatus");
const openaiStatus = document.getElementById("openaiStatus");
const openaiTTSStatus = document.getElementById("openaiTTSStatus");
const openaiTTSOption = document.getElementById("openaiTTSOption");

let anthropicApiKey = "";
let openaiApiKey = "";
let currentProvider = "anthropic";
let currentTTSProvider = "browser";
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let voices = [];
let currentAudioElement = null;
let openaiVoices = [
  { id: "alloy", name: "Alloy", description: "Neutral, balanced voice" },
  { id: "echo", name: "Echo", description: "Warm, engaging voice" },
  { id: "fable", name: "Fable", description: "Expressive storytelling voice" },
  { id: "onyx", name: "Onyx", description: "Deep, authoritative voice" },
  { id: "nova", name: "Nova", description: "Bright, energetic voice" },
  { id: "shimmer", name: "Shimmer", description: "Gentle, soothing voice" },
];
let selectedOpenAIVoice = "fable"; // Default to fable for storytelling

// Initialize app
function init() {
  loadApiKeys();
  setupEmojiInput();
  updateApiStatus();
  initSpeech();

  // Check if API key exists on startup
  const hasValidKey =
    (currentProvider === "anthropic" && anthropicApiKey) ||
    (currentProvider === "openai" && openaiApiKey);
  if (!hasValidKey) {
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
  voiceSelect.innerHTML = "";
  settingsVoiceSelect.innerHTML = "";

  if (currentTTSProvider === "openai") {
    // Load OpenAI voices
    openaiVoices.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice.id;
      option.textContent = `${voice.name} - ${voice.description}`;

      const settingsOption = document.createElement("option");
      settingsOption.value = voice.id;
      settingsOption.textContent = `${voice.name} - ${voice.description}`;

      // Mark default voice (fable for storytelling)
      if (voice.id === "fable") {
        option.selected = true;
        settingsOption.selected = true;
      }

      voiceSelect.appendChild(option);
      settingsVoiceSelect.appendChild(settingsOption);
    });
  } else {
    // Load browser voices
    voices = speechSynthesis.getVoices();

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
  }

  // Load saved voice preferences
  loadVoicePreferences();
}

async function readStoryAloud() {
  const text = storyText.textContent;

  if (!text || text.includes("❌") || text.includes("Oops!")) {
    showError("No story to read! Generate a story first. 📖");
    return;
  }

  // Stop any current speech or audio
  stopReading();

  try {
    if (currentTTSProvider === "openai" && openaiApiKey) {
      await readWithOpenAITTS(text);
    } else {
      readWithBrowserTTS(text);
    }
  } catch (error) {
    console.error("TTS error:", error);
    // Fallback to browser TTS on OpenAI TTS error
    if (currentTTSProvider === "openai") {
      showError("OpenAI TTS failed, falling back to browser TTS...");
      setTimeout(() => readWithBrowserTTS(text), 1000);
    } else {
      showError("Sorry, there was an error reading the story. 🔊");
    }
  }
}

function readWithBrowserTTS(text) {
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
    updateTTSButtons("playing");
  };

  currentUtterance.onend = function () {
    updateTTSButtons("idle");
    currentUtterance = null;
  };

  currentUtterance.onerror = function (event) {
    console.error("Speech synthesis error:", event);
    showError("Sorry, there was an error reading the story. 🔊");
    updateTTSButtons("idle");
  };

  // Start speaking
  speechSynthesis.speak(currentUtterance);
}

async function readWithOpenAITTS(text) {
  const selectedVoice = voiceSelect.value || "fable";
  const speed = parseFloat(speedRange.value);

  updateTTSButtons("loading");

  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        input: text,
        voice: selectedVoice,
        response_format: "mp3",
        speed: Math.max(0.25, Math.min(4.0, speed)), // OpenAI accepts 0.25 to 4.0
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI TTS error: ${response.status} - ${
          errorData.error?.message || response.statusText
        }`
      );
    }

    // Get the audio data as a blob
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create audio element but don't play yet
    const audioElement = new Audio(audioUrl);

    audioElement.onplay = function () {
      updateTTSButtons("playing");
    };

    audioElement.onended = function () {
      updateTTSButtons("idle");
      URL.revokeObjectURL(audioUrl);
      currentAudioElement = null;
    };

    audioElement.onerror = function () {
      console.error("Audio playback error");
      updateTTSButtons("idle");
      URL.revokeObjectURL(audioUrl);
      currentAudioElement = null;
    };

    // Try to play immediately, but handle autoplay restrictions
    try {
      await audioElement.play();
      currentAudioElement = audioElement;
    } catch (playError) {
      if (playError.name === "NotAllowedError") {
        // Autoplay blocked - show "Click to Play" button
        currentAudioElement = audioElement;
        updateTTSButtons("ready", audioElement);
        return; // Don't throw error, just wait for user interaction
      } else {
        // Other playback error
        URL.revokeObjectURL(audioUrl);
        throw playError;
      }
    }
  } catch (error) {
    updateTTSButtons("idle");
    throw error;
  }
}

function updateTTSButtons(state, audioElement = null) {
  // States: 'idle', 'loading', 'ready', 'playing'
  switch (state) {
    case "loading":
      readAloudBtn.textContent = "🎵 Generating Audio...";
      readAloudBtn.disabled = true;
      readAloudBtn.style.display = "inline-flex";
      stopReadingBtn.style.display = "none";
      readAloudBtn.classList.remove("playing");
      stopReadingBtn.classList.remove("playing");
      break;

    case "ready":
      readAloudBtn.textContent = "▶️ Click to Play";
      readAloudBtn.disabled = false;
      readAloudBtn.style.display = "inline-flex";
      stopReadingBtn.style.display = "none";
      // Store audio element for click-to-play
      readAloudBtn.dataset.audioReady = "true";
      readAloudBtn._audioElement = audioElement;
      readAloudBtn.classList.remove("playing");
      stopReadingBtn.classList.remove("playing");
      break;

    case "playing":
      readAloudBtn.style.display = "none";
      stopReadingBtn.style.display = "inline-flex";
      readAloudBtn.disabled = true;
      readAloudBtn.classList.remove("playing");
      stopReadingBtn.classList.add("playing");
      break;

    case "idle":
    default:
      readAloudBtn.textContent = "🔊 Read Aloud";
      readAloudBtn.disabled = false;
      readAloudBtn.style.display = "inline-flex";
      stopReadingBtn.style.display = "none";
      readAloudBtn.dataset.audioReady = "false";
      readAloudBtn._audioElement = null;
      readAloudBtn.classList.remove("playing");
      stopReadingBtn.classList.remove("playing");
      break;
  }
}

function playPreloadedAudio(audioElement) {
  try {
    audioElement.play();
    updateTTSButtons("playing");
  } catch (error) {
    console.error("Error playing preloaded audio:", error);
    updateTTSButtons("idle");
    showError("Sorry, there was an error playing the audio. 🔊");
  }
}

function stopReading() {
  // Stop browser TTS
  if (currentUtterance) {
    // Clear the error handler to prevent it from showing an error when we cancel
    currentUtterance.onerror = null;
    speechSynthesis.cancel();
    currentUtterance = null;
  }

  // Stop OpenAI audio
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
    currentAudioElement = null;
  }

  // Reset buttons
  updateTTSButtons("idle");
}

function toggleVoiceSettings() {
  voiceControls.classList.toggle("show");
}

// Voice preference management
function saveVoicePreferences() {
  const preferences = {
    voiceIndex: voiceSelect.value,
    speed: speedRange.value,
    ttsProvider: currentTTSProvider,
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
      if (preferences.ttsProvider !== undefined) {
        currentTTSProvider = preferences.ttsProvider;
      }
    } catch (e) {
      console.error("Error loading voice preferences:", e);
    }
  }
}

// API Key Management
function loadApiKeys() {
  anthropicApiKey = localStorage.getItem("anthropic_api_key") || "";
  openaiApiKey = localStorage.getItem("openai_api_key") || "";
  currentProvider = localStorage.getItem("current_provider") || "anthropic";
  currentTTSProvider =
    localStorage.getItem("current_tts_provider") || "browser";

  anthropicApiKeyInput.value = anthropicApiKey;
  openaiApiKeyInput.value = openaiApiKey;

  // Set provider radio buttons
  if (currentProvider === "openai") {
    providerOpenAI.checked = true;
    providerAnthropic.checked = false;
  } else {
    providerAnthropic.checked = true;
    providerOpenAI.checked = false;
  }

  // Set TTS provider radio buttons
  if (currentTTSProvider === "openai") {
    ttsOpenAI.checked = true;
    ttsBrowser.checked = false;
  } else {
    ttsBrowser.checked = true;
    ttsOpenAI.checked = false;
  }

  updateProviderUI();
  updateProviderStatuses();
  updateTTSAvailability();
}

function saveApiKeysToStorage() {
  const newAnthropicKey = anthropicApiKeyInput.value.trim();
  const newOpenAIKey = openaiApiKeyInput.value.trim();

  // Update provider selection
  currentProvider = providerAnthropic.checked ? "anthropic" : "openai";
  currentTTSProvider = ttsBrowser.checked ? "browser" : "openai";

  // Validate that at least one key is provided for the selected provider
  if (currentProvider === "anthropic" && !newAnthropicKey) {
    showError("Please enter an Anthropic API key or switch to OpenAI");
    return;
  }

  if (currentProvider === "openai" && !newOpenAIKey) {
    showError("Please enter an OpenAI API key or switch to Anthropic");
    return;
  }

  // Save keys
  if (newAnthropicKey) {
    localStorage.setItem("anthropic_api_key", newAnthropicKey);
    anthropicApiKey = newAnthropicKey;
  }

  if (newOpenAIKey) {
    localStorage.setItem("openai_api_key", newOpenAIKey);
    openaiApiKey = newOpenAIKey;
  }

  // Save provider preferences
  localStorage.setItem("current_provider", currentProvider);
  localStorage.setItem("current_tts_provider", currentTTSProvider);

  updateApiStatus();
  updateProviderStatuses();
  updateTTSAvailability();
  showSuccess("Settings saved successfully! 🔑");
  hideSettings();
}

function clearAnthropicApiKey() {
  if (!confirm("Are you sure you want to clear your Anthropic API key?")) {
    return;
  }
  
  localStorage.removeItem("anthropic_api_key");
  anthropicApiKey = "";
  anthropicApiKeyInput.value = "";
  
  // If Anthropic was selected, switch to OpenAI if available
  if (currentProvider === "anthropic" && openaiApiKey) {
    currentProvider = "openai";
    providerOpenAI.checked = true;
    providerAnthropic.checked = false;
    localStorage.setItem("current_provider", currentProvider);
    updateProviderUI();
  }
  
  updateApiStatus();
  updateProviderStatuses();
  updateTTSAvailability();
}

function clearOpenaiApiKey() {
  if (!confirm("Are you sure you want to clear your OpenAI API key?")) {
    return;
  }
  
  localStorage.removeItem("openai_api_key");
  openaiApiKey = "";
  openaiApiKeyInput.value = "";
  
  // If OpenAI was selected, switch to Anthropic if available
  if (currentProvider === "openai" && anthropicApiKey) {
    currentProvider = "anthropic";
    providerAnthropic.checked = true;
    providerOpenAI.checked = false;
    localStorage.setItem("current_provider", currentProvider);
    updateProviderUI();
  }
  
  updateApiStatus();
  updateProviderStatuses();
  updateTTSAvailability();
}

function updateApiStatus() {
  const hasValidKey =
    (currentProvider === "anthropic" && anthropicApiKey) ||
    (currentProvider === "openai" && openaiApiKey);

  generateBtn.disabled = !hasValidKey;
}

function updateProviderStatuses() {
  // Update Anthropic status
  if (anthropicApiKey) {
    anthropicStatus.textContent = "Connected";
    anthropicStatus.className = "provider-status connected";
  } else {
    anthropicStatus.textContent = "Not Connected";
    anthropicStatus.className = "provider-status disconnected";
  }

  // Update OpenAI status
  if (openaiApiKey) {
    openaiStatus.textContent = "Connected";
    openaiStatus.className = "provider-status connected";
  } else {
    openaiStatus.textContent = "Not Connected";
    openaiStatus.className = "provider-status disconnected";
  }
}

function updateTTSAvailability() {
  // Enable/disable OpenAI TTS based on API key availability
  if (openaiApiKey) {
    ttsOpenAI.disabled = false;
    openaiTTSOption.style.opacity = "1";
    openaiTTSOption.style.pointerEvents = "auto";
    openaiTTSStatus.textContent = "Available";
    openaiTTSStatus.className = "provider-status connected";
  } else {
    // If OpenAI TTS is currently selected but no key, switch to browser
    if (currentTTSProvider === "openai") {
      currentTTSProvider = "browser";
      ttsBrowser.checked = true;
      ttsOpenAI.checked = false;
      localStorage.setItem("current_tts_provider", "browser");
    }

    ttsOpenAI.disabled = true;
    openaiTTSOption.style.opacity = "0.5";
    openaiTTSOption.style.pointerEvents = "none";
    openaiTTSStatus.textContent = "Requires OpenAI Key";
    openaiTTSStatus.className = "provider-status disabled";
  }
}

function updateProviderUI() {
  // Show/hide API key sections
  if (currentProvider === "openai") {
    openaiKeySection.style.display = "block";
    anthropicKeySection.style.display = "none";
    apiInfoText.textContent =
      "You need an OpenAI API key to generate stories. Get yours at ";
    apiInfoLink.href = "https://platform.openai.com/api-keys";
    apiInfoLink.textContent = "platform.openai.com";
  } else {
    anthropicKeySection.style.display = "block";
    openaiKeySection.style.display = "none";
    apiInfoText.textContent =
      "You need an Anthropic API key to generate stories. Get yours at ";
    apiInfoLink.href = "https://console.anthropic.com";
    apiInfoLink.textContent = "console.anthropic.com";
  }
}

// Tab Management
function switchToTab(tabName) {
  // Remove active class from all tabs and content
  audioTab.classList.remove("active");
  aiTab.classList.remove("active");
  audioContent.classList.remove("active");
  aiContent.classList.remove("active");

  // Add active class to selected tab and content
  if (tabName === "audio") {
    audioTab.classList.add("active");
    audioContent.classList.add("active");
  } else if (tabName === "ai") {
    aiTab.classList.add("active");
    aiContent.classList.add("active");
  }
}

// Modal Management
function showSettings() {
  settingsModal.classList.add("show");
  updateProviderStatuses();
  updateTTSAvailability();

  // Default to Audio tab
  switchToTab("audio");
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

// Generate story using selected API provider
async function generateStory() {
  // Stop any currently playing audio
  stopReading();
  
  const emojis = emojiInput.value.trim();

  if (!emojis) {
    showError("Please enter some emojis first! 🎭");
    return;
  }

  const currentApiKey =
    currentProvider === "anthropic" ? anthropicApiKey : openaiApiKey;
  if (!currentApiKey) {
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

    let story;
    if (currentProvider === "openai") {
      story = await generateOpenAIStory(prompt, currentApiKey);
    } else {
      story = await generateAnthropicStory(prompt, currentApiKey);
    }

    // replace `\n` with line breaks
    showStory(story.replace(/\n/g, "<br>"));
  } catch (error) {
    console.error("Error generating story:", error);
    if (
      error.message.includes("API key") ||
      error.message.includes("401") ||
      error.message.includes("authentication")
    ) {
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

// Generate story using Anthropic Claude API
async function generateAnthropicStory(prompt, apiKey) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
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
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Anthropic API error: ${response.status} - ${
        errorData.error?.message || response.statusText
      }`
    );
  }

  const data = await response.json();
  return data.content[0].text;
}

// Generate story using OpenAI API
async function generateOpenAIStory(prompt, apiKey) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1024,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `OpenAI API error: ${response.status} - ${
        errorData.error?.message || response.statusText
      }`
    );
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function setLoading(isLoading) {
  const hasValidKey =
    (currentProvider === "anthropic" && anthropicApiKey) ||
    (currentProvider === "openai" && openaiApiKey);
  generateBtn.disabled = isLoading || !hasValidKey;
  generateBtn.textContent = isLoading ? "Creating Story..." : "Generate Story";

  if (isLoading) {
    loading.classList.add("show");
    generateBtn.classList.add("generating");
  } else {
    loading.classList.remove("show");
    generateBtn.classList.remove("generating");
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
saveApiKeys.addEventListener("click", saveApiKeysToStorage);
clearAnthropicKey.addEventListener("click", clearAnthropicApiKey);
clearOpenaiKey.addEventListener("click", clearOpenaiApiKey);

// Tab switching event listeners
audioTab.addEventListener("click", function () {
  switchToTab("audio");
});

aiTab.addEventListener("click", function () {
  switchToTab("ai");
});

// Provider selection event listeners
providerAnthropic.addEventListener("change", function () {
  if (this.checked) {
    currentProvider = "anthropic";
    updateProviderUI();
  }
});

providerOpenAI.addEventListener("change", function () {
  if (this.checked) {
    currentProvider = "openai";
    updateProviderUI();
  }
});

ttsBrowser.addEventListener("change", function () {
  if (this.checked) {
    currentTTSProvider = "browser";
    loadVoices(); // Reload voices for browser TTS
    saveVoicePreferences();
  }
});

ttsOpenAI.addEventListener("change", function () {
  if (this.checked) {
    currentTTSProvider = "openai";
    loadVoices(); // Reload voices for OpenAI TTS
    saveVoicePreferences();
  }
});
readAloudBtn.addEventListener("click", function () {
  // Check if audio is ready to play
  if (
    readAloudBtn.dataset.audioReady === "true" &&
    readAloudBtn._audioElement
  ) {
    // Play pre-loaded audio
    playPreloadedAudio(readAloudBtn._audioElement);
  } else {
    // Generate new audio
    readStoryAloud();
  }
});
stopReadingBtn.addEventListener("click", stopReading);
voiceSettingsBtn.addEventListener("click", showSettings);

// Modal click outside to close
settingsModal.addEventListener("click", function (e) {
  if (e.target === settingsModal) {
    hideSettings();
  }
});

// Enter key to save API keys
anthropicApiKeyInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    saveApiKeysToStorage();
  }
});

openaiApiKeyInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    saveApiKeysToStorage();
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
  const hasValidKey =
    (currentProvider === "anthropic" && anthropicApiKey) ||
    (currentProvider === "openai" && openaiApiKey);
  if (hasValidKey) {
    setTimeout(() => {
      emojiInput.focus();
    }, 500);
  }
});
