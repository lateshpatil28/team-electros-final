/**
 * @file app.js
 * FarmWise Complete MVP Application Entrypoint
 * Orchestrates Decision Engine, What-If Simulator, Multimodal Crop Scan, AI Assistant,
 * Audio Knowledge Library, Regional Agronomics, Live Weather, IoT Monitor, and 100% Multilingual Localization.
 */

import { initProfileForm } from './ui/profileForm.js';
import { initContextDisplay } from './ui/contextDisplay.js';
import { initRecommendationView } from './ui/recommendationView.js';
import { initAlternativesView } from './ui/alternativesView.js';
import { initWhatIfSimulator } from './ui/whatIfSimulator.js';
import { initDemoControls } from './ui/demoControls.js';
import { initCropScanView } from './ui/cropScanView.js';
import { initAssistantView } from './ui/assistantView.js';
import { initKnowledgeLibraryView } from './ui/knowledgeLibraryView.js';
import { initRegionalCropsView } from './ui/regionalCropsView.js';
import { initWeatherView } from './ui/weatherView.js';
import { initIoTMonitorView } from './ui/iotMonitorView.js';
import { initVoiceModal } from './ui/voiceModal.js';
import { initSettingsModal } from './ui/settingsModal.js';
import { i18n, t } from './i18n/i18n.js';
import { farmStore } from './state/farmContext.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌾 FarmWise Complete MVP Initializing...');

  // Initialize Core Services & Modals
  initVoiceModal();
  initSettingsModal();

  // Initialize UI modules
  initDemoControls();
  initProfileForm();
  initContextDisplay();
  initRecommendationView();
  initAlternativesView();
  initWhatIfSimulator();

  // Initialize Phase 2 Feature Modules
  initCropScanView();
  initAssistantView();
  initKnowledgeLibraryView();
  initRegionalCropsView();
  initWeatherView();
  initIoTMonitorView();

  // Setup Language Selector in Header
  initLanguageSelector();

  // Setup Collapsible Navigation Menu Drawer
  initNavDrawer();

  // Setup Settings button in Header
  const settingsBtn = document.getElementById('btn-open-settings-header');
  settingsBtn?.addEventListener('click', () => {
    window.openSettingsModal?.();
  });

  // Apply initial translations to static DOM elements
  updateStaticDOMTranslations();

  // Subscribe to language changes for static elements
  i18n.subscribe(() => {
    updateStaticDOMTranslations();
    updateLanguageSelectorActiveState();
  });

  // Global smooth scroll helper
  window.scrollToSection = function(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  console.log('✓ FarmWise MVP Fully Active. Current Language:', i18n.getLanguage());
});

function initNavDrawer() {
  const btnNavMenu = document.getElementById('btn-nav-menu');
  const btnCloseDrawer = document.getElementById('btn-close-nav-drawer');
  const drawer = document.getElementById('nav-drawer');
  const backdrop = document.getElementById('nav-drawer-backdrop');
  const drawerNavItems = document.querySelectorAll('.drawer-nav-item[data-target]');
  const btnDrawerSettings = document.getElementById('btn-drawer-settings');

  function openDrawer() {
    drawer?.classList.add('active');
    backdrop?.classList.add('active');
    btnNavMenu?.setAttribute('aria-expanded', 'true');
    drawer?.setAttribute('aria-hidden', 'false');
    backdrop?.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    drawer?.classList.remove('active');
    backdrop?.classList.remove('active');
    btnNavMenu?.setAttribute('aria-expanded', 'false');
    drawer?.setAttribute('aria-hidden', 'true');
    backdrop?.setAttribute('aria-hidden', 'true');
  }

  btnNavMenu?.addEventListener('click', openDrawer);
  btnCloseDrawer?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('active')) {
      closeDrawer();
    }
  });

  drawerNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');
      if (targetId) {
        window.scrollToSection(targetId);
        drawerNavItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
      closeDrawer();
    });
  });

  btnDrawerSettings?.addEventListener('click', () => {
    closeDrawer();
    window.openSettingsModal?.();
  });

  // Scrollspy to highlight active section in drawer
  const observedSections = [
    'journey-banner-section',
    'section-profile',
    'section-recommendation',
    'section-alternatives',
    'section-whatif',
    'section-cropscan',
    'section-assistant',
    'section-library',
    'section-regional',
    'section-weather',
    'section-iot'
  ];

  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 120;
    for (let i = observedSections.length - 1; i >= 0; i--) {
      const sectionId = observedSections[i];
      const secEl = document.getElementById(sectionId);
      if (secEl && secEl.offsetTop <= scrollPos) {
        drawerNavItems.forEach(item => {
          if (item.getAttribute('data-target') === sectionId) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
        break;
      }
    }
  }, { passive: true });
}

function initLanguageSelector() {
  const container = document.getElementById('lang-selector-group');
  if (!container) return;

  const buttons = container.querySelectorAll('.lang-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang) {
        i18n.setLanguage(lang);
      }
    });
  });

  updateLanguageSelectorActiveState();
}

function updateLanguageSelectorActiveState() {
  const container = document.getElementById('lang-selector-group');
  if (!container) return;

  const currentLang = i18n.getLanguage();
  const buttons = container.querySelectorAll('.lang-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-lang') === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.documentElement.lang = currentLang;
}

function updateStaticDOMTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });

  // Update Page Title
  const titlePrefix = t('app.title');
  const titleSub = t('app.subtitle');
  document.title = `${titlePrefix} - ${titleSub}`;
}

