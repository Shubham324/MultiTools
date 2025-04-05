document.addEventListener('DOMContentLoaded', function() {
    const voiceSelect = document.getElementById('voiceSelect');
    const rateRange = document.getElementById('rateRange');
    const pitchRange = document.getElementById('pitchRange');
    const rateValue = document.getElementById('rateValue');
    const pitchValue = document.getElementById('pitchValue');
    const inputText = document.getElementById('inputText');
    const charCount = document.getElementById('charCount');
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    const stopButton = document.getElementById('stopButton');
    const downloadButton = document.getElementById('downloadButton');
    const status = document.getElementById('status');

    let speechSynthesis = window.speechSynthesis;
    let voices = [];
    let currentUtterance = null;

    // Initialize voices
    function loadVoices() {
        voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = voices
            .map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`)
            .join('');
    }

    // Load voices when they're ready
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Update range values display
    rateRange.addEventListener('input', () => {
        rateValue.textContent = rateRange.value;
    });

    pitchRange.addEventListener('input', () => {
        pitchValue.textContent = pitchRange.value;
    });

    // Update character count
    inputText.addEventListener('input', () => {
        charCount.textContent = inputText.value.length;
    });

    // Play button click handler
    playButton.addEventListener('click', () => {
        if (speechSynthesis.speaking && speechSynthesis.paused) {
            resumeSpeech();
        } else {
            startSpeech();
        }
    });

    // Pause button click handler
    pauseButton.addEventListener('click', () => {
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
            speechSynthesis.pause();
            updateButtons(true, true, true);
            updateStatus('Paused');
        }
    });

    // Stop button click handler
    stopButton.addEventListener('click', () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            updateButtons(true, false, false);
            updateStatus('Stopped');
        }
    });

    // Download button click handler
    downloadButton.addEventListener('click', () => {
        updateStatus('Sorry, audio download is not available in the browser version. Try using a screen recorder instead.');
    });

    function startSpeech() {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const text = inputText.value.trim();
        if (!text) {
            updateStatus('Please enter some text to speak');
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = voices[voiceSelect.value];
        
        utterance.voice = selectedVoice;
        utterance.rate = parseFloat(rateRange.value);
        utterance.pitch = parseFloat(pitchRange.value);

        utterance.onstart = () => {
            updateButtons(false, true, true);
            updateStatus('Speaking...');
        };

        utterance.onend = () => {
            updateButtons(true, false, false);
            updateStatus('Finished speaking');
        };

        utterance.onerror = (event) => {
            updateButtons(true, false, false);
            updateStatus('Error occurred while speaking: ' + event.error);
        };

        currentUtterance = utterance;
        speechSynthesis.speak(utterance);
    }

    function resumeSpeech() {
        speechSynthesis.resume();
        updateButtons(false, true, true);
        updateStatus('Speaking...');
    }

    function updateButtons(playEnabled, pauseEnabled, stopEnabled) {
        playButton.disabled = !playEnabled;
        pauseButton.disabled = !pauseEnabled;
        stopButton.disabled = !stopEnabled;
    }

    function updateStatus(message) {
        status.textContent = message;
    }

    // Initial setup
    updateButtons(true, false, false);
    updateStatus('Ready to speak');
}); 