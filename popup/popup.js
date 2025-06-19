// Popup functionality for AI Content Generator Extension

class PopupManager {
  constructor() {
    this.settings = {};
    this.currentTab = null;
    this.isNotionPage = false;
    this.init();
  }

  async init() {
    try {
      await this.loadSettings();
      await this.getCurrentTab();
      this.setupEventListeners();
      this.updateUI();
    } catch (error) {
      console.error('Error initializing popup:', error);
      this.showError('Failed to initialize extension');
    }
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.local.get([
        'geminiApiKey',
        'aiModel',
        'notionIntegration',
        'defaultInsertMode',
        'autoSaveContent',
        'buttonPosition',
        'theme',
        'lastGeneratedContent'
      ]);
      
      this.settings = {
        geminiApiKey: result.geminiApiKey || '',
        aiModel: result.aiModel || 'gemini-2.0-flash',
        notionIntegration: result.notionIntegration !== false,
        defaultInsertMode: result.defaultInsertMode || 'append',
        autoSaveContent: result.autoSaveContent !== false,
        buttonPosition: result.buttonPosition || 'bottom-right',
        theme: result.theme || 'light',
        lastGeneratedContent: result.lastGeneratedContent || null
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      this.settings = {
        geminiApiKey: '',
        aiModel: 'gemini-2.0-flash',
        notionIntegration: true,
        defaultInsertMode: 'append',
        autoSaveContent: true,
        buttonPosition: 'bottom-right',
        theme: 'light',
        lastGeneratedContent: null
      };
    }
  }

  async getCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTab = tab;
      this.isNotionPage = tab?.url?.includes('notion.so') || tab?.url?.includes('notion.site');
    } catch (error) {
      console.error('Error getting current tab:', error);
      this.isNotionPage = false;
    }
  }

  setupEventListeners() {
    // Settings button
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.openSettings());
    }

    // Generate button
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.openContentGenerator());
    }

    // Paste last button
    const pasteLastBtn = document.getElementById('pasteLastBtn');
    if (pasteLastBtn) {
      pasteLastBtn.addEventListener('click', () => this.pasteLastContent());
    }

    // Setup button
    const setupBtn = document.getElementById('setupBtn');
    if (setupBtn) {
      setupBtn.addEventListener('click', () => this.openSettings());
    }

    // Template buttons
    const templateBtns = document.querySelectorAll('.template-btn');
    templateBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const template = btn.dataset.template;
        this.openContentGeneratorWithTemplate(template);
      });
    });

    // Recent paste button
    const recentPasteBtn = document.getElementById('recentPasteBtn');
    if (recentPasteBtn) {
      recentPasteBtn.addEventListener('click', () => this.pasteLastContent());
    }
  }

  updateUI() {
    this.updateStatus();
    this.updateSections();
    this.updatePasteButton();
  }

  updateStatus() {
    const apiStatus = document.getElementById('apiStatus');
    const pageStatus = document.getElementById('pageStatus');

    // Update API Status
    if (apiStatus) {
      if (this.settings.geminiApiKey && this.settings.geminiApiKey.trim()) {
        apiStatus.textContent = 'Connected';
        apiStatus.className = 'status-value connected';
      } else {
        apiStatus.textContent = 'Not configured';
        apiStatus.className = 'status-value error';
      }
    }

    // Update Page Status
    if (pageStatus) {
      if (this.isNotionPage) {
        pageStatus.textContent = 'Notion page detected';
        pageStatus.className = 'status-value connected';
      } else {
        pageStatus.textContent = 'Not on Notion';
        pageStatus.className = 'status-value warning';
      }
    }
  }

  updateSections() {
    const quickActions = document.getElementById('quickActions');
    const setupSection = document.getElementById('setupSection');
    const notNotionSection = document.getElementById('notNotionSection');
    const templatesSection = document.getElementById('templatesSection');
    const recentSection = document.getElementById('recentSection');

    // Hide all sections first
    [quickActions, setupSection, notNotionSection, templatesSection, recentSection].forEach(section => {
      if (section) section.style.display = 'none';
    });

    // Show appropriate sections
    if (!this.settings.geminiApiKey || !this.settings.geminiApiKey.trim()) {
      // No API key configured
      if (setupSection) setupSection.style.display = 'block';
    } else if (!this.isNotionPage) {
      // Not on Notion page
      if (notNotionSection) notNotionSection.style.display = 'block';
    } else {
      // Ready to use
      if (quickActions) quickActions.style.display = 'block';
      if (templatesSection) templatesSection.style.display = 'block';
      if (recentSection && this.settings.lastGeneratedContent) {
        recentSection.style.display = 'block';
        this.updateRecentContent();
      }
    }
  }

  updatePasteButton() {
    const pasteLastBtn = document.getElementById('pasteLastBtn');
    if (pasteLastBtn) {
      pasteLastBtn.disabled = !this.settings.lastGeneratedContent;
    }
  }

  updateRecentContent() {
    const recentContent = document.getElementById('recentContent');
    const recentPasteBtn = document.getElementById('recentPasteBtn');
    
    if (recentContent && this.settings.lastGeneratedContent) {
      const preview = this.settings.lastGeneratedContent.substring(0, 100) + '...';
      const recentText = recentContent.querySelector('.recent-text');
      if (recentText) {
        recentText.textContent = preview;
      }
      if (recentPasteBtn) recentPasteBtn.style.display = 'inline-block';
    }
  }

  async openContentGenerator() {
    if (!this.isNotionPage) {
      this.showError('Please navigate to a Notion page first');
      return;
    }

    if (!this.settings.geminiApiKey || !this.settings.geminiApiKey.trim()) {
      this.showError('Please configure your Gemini API key in settings first');
      return;
    }

    try {
      // Send message to content script to open the generator
      await chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'openGenerator'
      });
      window.close();
    } catch (error) {
      console.error('Error opening content generator:', error);
      this.showError('Failed to open content generator. Please refresh the page and try again.');
    }
  }

  async openContentGeneratorWithTemplate(template) {
    if (!this.isNotionPage) {
      this.showError('Please navigate to a Notion page first');
      return;
    }

    if (!this.settings.geminiApiKey || !this.settings.geminiApiKey.trim()) {
      this.showError('Please configure your Gemini API key in settings first');
      return;
    }

    try {
      // First check if content script is loaded
      const response = await chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'ping'
      });
      
      // If we get here, content script is loaded, now send the actual message
      await chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'openGenerator',
        template: template
      });
      window.close();
    } catch (error) {
      console.error('Error opening content generator with template:', error);
      // Try to inject the content script if it's not loaded
      try {
        await chrome.scripting.executeScript({
          target: { tabId: this.currentTab.id },
          files: ['content/content-script.js']
        });
        
        // Wait a bit for the script to initialize
        setTimeout(async () => {
          try {
            await chrome.tabs.sendMessage(this.currentTab.id, {
              action: 'openGenerator',
              template: template
            });
            window.close();
          } catch (retryError) {
            console.error('Retry failed:', retryError);
            this.showError('Content script failed to load. Please refresh the Notion page and try again.');
          }
        }, 1000);
      } catch (injectError) {
        console.error('Failed to inject content script:', injectError);
        this.showError('Failed to load content script. Please refresh the Notion page and try again.');
      }
    }
  }

  async pasteLastContent() {
    if (!this.isNotionPage) {
      this.showError('Please navigate to a Notion page first');
      return;
    }

    if (!this.settings.lastGeneratedContent) {
      this.showError('No content available to paste');
      return;
    }

    try {
      // Send message to content script to paste content
      await chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'pasteContent',
        content: this.settings.lastGeneratedContent
      });
      
      this.showSuccess('Content pasted successfully!');
      window.close();
    } catch (error) {
      console.error('Error pasting content:', error);
      this.showError('Failed to paste content. Please refresh the page and try again.');
    }
  }

  openSettings() {
    chrome.runtime.openOptionsPage();
    window.close();
  }

  showError(message) {
    console.error('Popup Error:', message);
    
    // Update status to show error
    const apiStatus = document.getElementById('apiStatus');
    if (apiStatus) {
      apiStatus.textContent = 'Error: ' + message;
      apiStatus.className = 'status-value error';
    }
  }

  showSuccess(message) {
    console.log('Popup Success:', message);
    
    // Update status to show success
    const pageStatus = document.getElementById('pageStatus');
    if (pageStatus) {
      pageStatus.textContent = message;
      pageStatus.className = 'status-value connected';
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    new PopupManager();
  } catch (error) {
    console.error('Failed to initialize popup:', error);
  }
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.close();
  }
}); 