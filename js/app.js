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

  // Setup Multi-Page Active Navigation Highlighting
  initActiveNavigation();

  // Setup Collapsible Navigation Menu Drawer
  initNavDrawer();

  // Setup Live Home Dashboard Status Bar
  initHomeStatusStrip();

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
    initActiveNavigation();
    updateHomeStatusStrip();
  });

  // Subscribe to farmStore changes to update live Home status banner
  farmStore.subscribe(() => {
    updateHomeStatusStrip();
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

function initActiveNavigation() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.drawer-nav-item[href], .header-nav-link[href]');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('#')[0];
    const isCurrent = cleanHref === currentPath || (currentPath === '' && cleanHref === 'index.html');
    if (isCurrent) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initNavDrawer() {
  const btnNavMenu = document.getElementById('btn-nav-menu');
  const btnCloseDrawer = document.getElementById('btn-close-nav-drawer');
  const drawer = document.getElementById('nav-drawer');
  const backdrop = document.getElementById('nav-drawer-backdrop');
  const drawerNavItems = document.querySelectorAll('.drawer-nav-item');
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
      const targetId = item.getAttribute('data-target');
      if (targetId && document.getElementById(targetId)) {
        e.preventDefault();
        window.scrollToSection(targetId);
        drawerNavItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        closeDrawer();
      } else {
        closeDrawer();
      }
    });
  });

  btnDrawerSettings?.addEventListener('click', () => {
    closeDrawer();
    window.openSettingsModal?.();
  });
}

function initHomeStatusStrip() {
  updateHomeStatusStrip();
}

function updateHomeStatusStrip() {
  const container = document.getElementById('home-status-strip');
  if (!container) return;

  const ctx = farmStore.getContext();
  const farmer = ctx.farmer || {};
  const weather = ctx.weather || {};

  const name = farmer.farmerName || 'Farmer';
  const crop = i18n.translateCrop ? i18n.translateCrop(farmer.crop) : farmer.crop;
  const stage = i18n.translateStage ? i18n.translateStage(farmer.cropStage) : farmer.cropStage;
  const location = `${farmer.district || ''}, ${farmer.state || ''}`.trim().replace(/^,\s*|,\s*$/g, '');
  const budget = farmer.budget ? `₹${farmer.budget.toLocaleString('en-IN')}` : '₹0';
  const risk = i18n.translateRisk ? i18n.translateRisk(ctx.cropHealthRisk) : ctx.cropHealthRisk;

  container.innerHTML = `
    <div class="home-status-item">
      <span class="home-status-label">${t('profile.farmerName')}:</span>
      <span class="home-status-val">${name}</span>
    </div>
    <span class="home-status-divider">•</span>
    <div class="home-status-item">
      <span class="home-status-label">${t('profile.crop')}:</span>
      <span class="home-status-val">${crop} (${stage})</span>
    </div>
    <span class="home-status-divider">•</span>
    <div class="home-status-item">
      <span class="home-status-label">${t('profile.district')}:</span>
      <span class="home-status-val">${location}</span>
    </div>
    <span class="home-status-divider">•</span>
    <div class="home-status-item">
      <span class="home-status-label">${t('profile.budget')}:</span>
      <span class="home-status-val">${budget}</span>
    </div>
    <span class="home-status-divider">•</span>
    <div class="home-status-item">
      <span class="home-status-label">${t('context.cropHealthRisk')}:</span>
      <span class="home-status-val">${risk}</span>
    </div>
  `;
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

