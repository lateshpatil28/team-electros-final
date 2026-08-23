/**
 * @file assistantView.js
 * Context-Aware AI Farm Assistant UI Component
 * Integrates live Farm Context, quick questions, chat conversation history, and voice TTS.
 */

import { GeminiService } from '../services/geminiService.js';
import { SpeechService } from '../services/speechService.js';
import { farmStore } from '../state/farmContext.js';
import { i18n, t } from '../i18n/i18n.js';

let chatHistory = [];

export function initAssistantView() {
  const container = document.getElementById('ai-assistant-container');
  if (!container) return;

  renderAssistantUI();
  bindAssistantEvents();

  i18n.subscribe(() => {
    renderAssistantUI();
    bindAssistantEvents();
    renderChatMessages();
  });
}

function renderAssistantUI() {
  const container = document.getElementById('ai-assistant-container');
  if (!container) return;

  const currentCtx = farmStore.getContext();
  const farmer = currentCtx.farmer;

  container.innerHTML = `
    <div class="assistant-card">
      <div class="assistant-header">
        <div class="assistant-title-group">
          <div class="assistant-avatar">🤖</div>
          <div>
            <div class="flex-row gap-xs">
              <h3 class="assistant-title">${t('assistant.title')}</h3>
              <span class="badge badge-emerald-sm">${t('assistant.contextBadge')}</span>
            </div>
            <p class="assistant-subtitle">${t('assistant.subtitle')}</p>
          </div>
        </div>

        <div class="assistant-context-chip">
          <span>👨‍🌾 ${escapeHtml(farmer.farmerName || 'Farmer')} | ${escapeHtml(i18n.translateCrop(farmer.crop))} (${farmer.farmSize} ac)</span>
        </div>
      </div>

      <!-- Quick Suggestion Prompts -->
      <div class="quick-prompts-bar">
        <button type="button" class="quick-prompt-btn" data-query="${t('assistant.quickPrompt1')}">
          💡 ${t('assistant.quickPrompt1')}
        </button>
        <button type="button" class="quick-prompt-btn" data-query="${t('assistant.quickPrompt2')}">
          🎯 ${t('assistant.quickPrompt2')}
        </button>
        <button type="button" class="quick-prompt-btn" data-query="${t('assistant.quickPrompt3')}">
          💰 ${t('assistant.quickPrompt3')}
        </button>
        <button type="button" class="quick-prompt-btn" data-query="${t('assistant.quickPrompt4')}">
          🗣️ ${t('assistant.quickPrompt4')}
        </button>
      </div>

      <!-- Chat Messages Scroll Container -->
      <div class="chat-messages-container" id="chat-messages-list">
        <!-- Initial greeting message -->
        <div class="chat-bubble bubble-assistant">
          <div class="bubble-avatar">🤖</div>
          <div class="bubble-content">
            <p>${t('assistant.welcomeMessage')}</p>
            <div class="bubble-meta">
              <span>FarmWise Assistant</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Bar -->
      <div class="chat-input-bar">
        <input type="text" id="chat-user-input" class="chat-input" placeholder="${t('assistant.placeholder')}">
        <button type="button" id="btn-chat-mic" class="btn-chat-voice" title="Voice Input">🎤</button>
        <button type="button" id="btn-send-chat" class="btn-chat-send">${t('assistant.sendBtn')}</button>
      </div>
    </div>
  `;
}

function bindAssistantEvents() {
  const input = document.getElementById('chat-user-input');
  const sendBtn = document.getElementById('btn-send-chat');
  const micBtn = document.getElementById('btn-chat-mic');
  const promptButtons = document.querySelectorAll('.quick-prompt-btn');

  const executeSend = (text) => {
    const query = (text || input?.value || '').trim();
    if (!query) return;
    if (input) input.value = '';
    handleUserMessage(query);
  };

  sendBtn?.addEventListener('click', () => executeSend());

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSend();
    }
  });

  promptButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      if (q) executeSend(q);
    });
  });

  micBtn?.addEventListener('click', () => {
    window.openVoiceModal?.((extractedText) => {
      if (extractedText) {
        executeSend(extractedText);
      }
    });
  });
}

async function handleUserMessage(userQuery) {
  const chatList = document.getElementById('chat-messages-list');
  if (!chatList) return;

  // Add User Message Bubble
  chatHistory.push({ sender: 'user', text: userQuery, time: new Date() });
  renderChatMessages();

  // Scroll to bottom
  chatList.scrollTop = chatList.scrollHeight;

  // Add loading placeholder
  const loadingBubble = document.createElement('div');
  loadingBubble.className = 'chat-bubble bubble-assistant bubble-loading';
  loadingBubble.id = 'assistant-loading-bubble';
  loadingBubble.innerHTML = `
    <div class="bubble-avatar">🤖</div>
    <div class="bubble-content">
      <div class="typing-indicator"><span></span><span></span><span></span></div>
    </div>
  `;
  chatList.appendChild(loadingBubble);
  chatList.scrollTop = chatList.scrollHeight;

  try {
    const context = farmStore.getContext();
    const engineResult = farmStore.getEngineResult();
    const language = i18n.getLanguage();

    const response = await GeminiService.askFarmAssistant({
      userMessage: userQuery,
      farmContext: context,
      engineResult: engineResult,
      language: language
    });

    const loadingEl = document.getElementById('assistant-loading-bubble');
    if (loadingEl) loadingEl.remove();

    chatHistory.push({
      sender: 'assistant',
      text: response.answer,
      notice: response.notice,
      time: new Date()
    });

    renderChatMessages();
    chatList.scrollTop = chatList.scrollHeight;
  } catch (err) {
    const loadingEl = document.getElementById('assistant-loading-bubble');
    if (loadingEl) loadingEl.remove();

    chatHistory.push({
      sender: 'assistant',
      text: 'I could not retrieve an answer right now. Please verify your connection or try again.',
      time: new Date()
    });
    renderChatMessages();
    chatList.scrollTop = chatList.scrollHeight;
  }
}

function renderChatMessages() {
  const chatList = document.getElementById('chat-messages-list');
  if (!chatList) return;

  const initialGreeting = `
    <div class="chat-bubble bubble-assistant">
      <div class="bubble-avatar">🤖</div>
      <div class="bubble-content">
        <p>${t('assistant.welcomeMessage')}</p>
        <div class="bubble-meta">
          <span>FarmWise Assistant</span>
        </div>
      </div>
    </div>
  `;

  const renderedHistory = chatHistory.map((item, idx) => {
    if (item.sender === 'user') {
      return `
        <div class="chat-bubble bubble-user">
          <div class="bubble-content">
            <p>${escapeHtml(item.text)}</p>
          </div>
          <div class="bubble-avatar">👨‍🌾</div>
        </div>
      `;
    } else {
      return `
        <div class="chat-bubble bubble-assistant">
          <div class="bubble-avatar">🤖</div>
          <div class="bubble-content">
            <div class="bubble-markdown-body">${formatAssistantMarkdown(item.text)}</div>
            ${item.notice ? `<div class="bubble-notice">${escapeHtml(item.notice)}</div>` : ''}
            <div class="bubble-actions">
              <button type="button" class="btn-tts-listen" data-idx="${idx}">
                🔊 ${t('assistant.listenAnswerBtn')}
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }).join('');

  chatList.innerHTML = initialGreeting + renderedHistory;

  // Bind TTS audio buttons
  const ttsButtons = chatList.querySelectorAll('.btn-tts-listen');
  ttsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-idx'));
      const msg = chatHistory[idx];
      if (msg && msg.text) {
        if (SpeechService.isSpeaking()) {
          SpeechService.stop();
          ttsButtons.forEach(b => b.textContent = `🔊 ${t('assistant.listenAnswerBtn')}`);
        } else {
          ttsButtons.forEach(b => b.textContent = `🔊 ${t('assistant.listenAnswerBtn')}`);
          btn.textContent = `⏹ ${t('library.stopAudioBtn') || 'Stop'}`;
          SpeechService.speak({
            text: msg.text,
            languageCode: i18n.getLanguage(),
            onEnd: () => {
              btn.textContent = `🔊 ${t('assistant.listenAnswerBtn')}`;
            },
            onError: () => {
              btn.textContent = `🔊 ${t('assistant.listenAnswerBtn')}`;
            }
          });
        }
      }
    });
  });
}

function formatAssistantMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n- /g, '<br>• ')
    .replace(/\n\d+\. /g, (match) => `<br>${match.trim()} `);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
