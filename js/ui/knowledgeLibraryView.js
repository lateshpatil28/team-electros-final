/**
 * @file knowledgeLibraryView.js
 * Multilingual Audio + Text Knowledge Library UI Component
 * Features category filtering, expandable article reading, and audio read-aloud (SpeechSynthesis).
 */

import { KNOWLEDGE_ARTICLES, KNOWLEDGE_CATEGORIES } from '../data/knowledgeData.js';
import { SpeechService } from '../services/speechService.js';
import { i18n, t } from '../i18n/i18n.js';

let activeCategory = 'all';
let expandedArticleId = null;
let activeSpeakingArticleId = null;

export function initKnowledgeLibraryView() {
  const container = document.getElementById('knowledge-library-container');
  if (!container) return;

  renderLibraryUI();
  bindLibraryEvents();

  i18n.subscribe(() => {
    renderLibraryUI();
    bindLibraryEvents();
  });
}

function renderLibraryUI() {
  const container = document.getElementById('knowledge-library-container');
  if (!container) return;

  const currentLang = i18n.getLanguage();

  const filteredArticles = activeCategory === 'all'
    ? KNOWLEDGE_ARTICLES
    : KNOWLEDGE_ARTICLES.filter(a => a.category === activeCategory);

  container.innerHTML = `
    <div class="knowledge-card">
      <div class="form-header">
        <span class="form-icon">📚</span>
        <div>
          <h2 class="form-title">${t('library.title')}</h2>
          <p class="form-subtitle">${t('library.subtitle')}</p>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="library-categories-bar">
        ${KNOWLEDGE_CATEGORIES.map(cat => {
          const categoryName = {
            all: t('library.allCategory'),
            crops: t('library.cropsCategory'),
            soil: t('library.soilCategory'),
            water: t('library.waterCategory'),
            pests: t('library.pestCategory'),
            weather: t('library.weatherCategory'),
            practices: t('library.practicesCategory')
          }[cat.id] || cat.id;

          return `
            <button type="button" class="lib-cat-btn ${activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
              ${cat.icon} ${categoryName}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Articles Grid -->
      <div class="articles-grid">
        ${filteredArticles.map(article => {
          const title = article.title[currentLang] || article.title.en;
          const summary = article.summary[currentLang] || article.summary.en;
          const content = article.content[currentLang] || article.content.en;
          const isExpanded = expandedArticleId === article.id;
          const isSpeaking = activeSpeakingArticleId === article.id;

          return `
            <div class="article-card ${isExpanded ? 'card-expanded' : ''}" id="article-${article.id}">
              <div class="article-top">
                <div class="article-badge-row">
                  <span class="article-cat-badge">${article.icon} ${article.category.toUpperCase()}</span>
                  <div class="article-tags">
                    ${article.tags.slice(0, 2).map(tag => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join('')}
                  </div>
                </div>
                <h3 class="article-title">${escapeHtml(title)}</h3>
                <p class="article-summary">${escapeHtml(summary)}</p>
              </div>

              <!-- Expanded Detailed Content Area -->
              ${isExpanded ? `
                <div class="article-expanded-body">
                  <div class="article-markdown">${formatArticleMarkdown(content)}</div>
                </div>
              ` : ''}

              <!-- Bottom Actions Bar: Read + Listen -->
              <div class="article-bottom-actions">
                <button type="button" class="btn-read-article" data-id="${article.id}">
                  ${isExpanded ? '▲ ' + t('library.readBtn').replace('📖', '📖 Close') : '▼ ' + t('library.readBtn')}
                </button>

                <button type="button" class="btn-listen-article ${isSpeaking ? 'btn-speaking' : ''}" data-id="${article.id}">
                  ${isSpeaking ? '⏹ ' + t('library.stopAudioBtn') : '🔊 ' + t('library.listenBtn')}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function bindLibraryEvents() {
  const container = document.getElementById('knowledge-library-container');
  if (!container) return;

  const catBtns = container.querySelectorAll('.lib-cat-btn');
  const readBtns = container.querySelectorAll('.btn-read-article');
  const listenBtns = container.querySelectorAll('.btn-listen-article');

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-cat');
      renderLibraryUI();
      bindLibraryEvents();
    });
  });

  readBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      expandedArticleId = (expandedArticleId === id) ? null : id;
      renderLibraryUI();
      bindLibraryEvents();
    });
  });

  listenBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const article = KNOWLEDGE_ARTICLES.find(a => a.id === id);
      if (!article) return;

      const lang = i18n.getLanguage();
      const content = article.content[lang] || article.content.en;

      if (activeSpeakingArticleId === id) {
        SpeechService.stop();
        activeSpeakingArticleId = null;
        renderLibraryUI();
        bindLibraryEvents();
      } else {
        SpeechService.stop();
        activeSpeakingArticleId = id;
        renderLibraryUI();
        bindLibraryEvents();

        SpeechService.speak({
          text: content,
          languageCode: lang,
          onEnd: () => {
            activeSpeakingArticleId = null;
            renderLibraryUI();
            bindLibraryEvents();
          },
          onError: () => {
            activeSpeakingArticleId = null;
            renderLibraryUI();
            bindLibraryEvents();
          }
        });
      }
    });
  });
}

function formatArticleMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/### (.*?)\n/g, '<h4 class="md-heading">$1</h4>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n- /g, '<br>• ')
    .replace(/\n\d+\. /g, (match) => `<br><strong>${match.trim()}</strong> `);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
