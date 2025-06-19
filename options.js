// Options page functionality for AI Content Generator Extension

class OptionsManager {
  constructor() {
    this.settings = {};
            this.defaultSettings = {      geminiApiKey: 'AIzaSyALcryunSpz4q3DQTewbSkr3Y0xOtnamh8',      aiModel: 'gemini-2.0-flash',
      maxTokens: 1500,
      temperature: 0.7,
      notionIntegration: true,
      defaultInsertMode: 'append',
      autoSaveContent: true,
      buttonPosition: 'bottom-right',
      theme: 'light',
      showKeyboardShortcuts: true,
      compactMode: false,
      defaultPromptStyle: 'professional',
      customStyle: '',
      includeContext: true,
      historyLimit: 25,
      anonymizeData: true,
      requestTimeout: 30,
      enableDebugMode: false
    };
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.populateForm();
    this.updateUI();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.local.get(Object.keys(this.defaultSettings));
      this.settings = { ...this.defaultSettings, ...result };
    } catch (error) {
      console.error('Error loading settings:', error);
      this.settings = { ...this.defaultSettings };
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.local.set(this.settings);
      this.showNotification('Settings saved successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showNotification('Error saving settings. Please try again.', 'error');
      return false;
    }
  }

  setupEventListeners() {
        // Form inputs    document.getElementById('apiKey').addEventListener('input', (e) => {      this.settings.geminiApiKey = e.target.value.trim();    });

    document.getElementById('aiModel').addEventListener('change', (e) => {
      this.settings.aiModel = e.target.value;
    });

    document.getElementById('maxTokens').addEventListener('input', (e) => {
      this.settings.maxTokens = parseInt(e.target.value);
      document.getElementById('maxTokensValue').textContent = e.target.value;
    });

    document.getElementById('temperature').addEventListener('input', (e) => {
      this.settings.temperature = parseFloat(e.target.value);
      document.getElementById('temperatureValue').textContent = e.target.value;
    });

    document.getElementById('notionIntegration').addEventListener('change', (e) => {
      this.settings.notionIntegration = e.target.checked;
    });

    document.getElementById('defaultInsertMode').addEventListener('change', (e) => {
      this.settings.defaultInsertMode = e.target.value;
    });

    document.getElementById('autoSaveContent').addEventListener('change', (e) => {
      this.settings.autoSaveContent = e.target.checked;
    });

    document.getElementById('buttonPosition').addEventListener('change', (e) => {
      this.settings.buttonPosition = e.target.value;
    });

    document.getElementById('theme').addEventListener('change', (e) => {
      this.settings.theme = e.target.value;
    });

    document.getElementById('showKeyboardShortcuts').addEventListener('change', (e) => {
      this.settings.showKeyboardShortcuts = e.target.checked;
    });

    document.getElementById('compactMode').addEventListener('change', (e) => {
      this.settings.compactMode = e.target.checked;
    });

    document.getElementById('defaultPromptStyle').addEventListener('change', (e) => {
      this.settings.defaultPromptStyle = e.target.value;
      this.toggleCustomStyleGroup(e.target.value === 'custom');
    });

    document.getElementById('customStyle').addEventListener('input', (e) => {
      this.settings.customStyle = e.target.value;
    });

    document.getElementById('includeContext').addEventListener('change', (e) => {
      this.settings.includeContext = e.target.checked;
    });

    document.getElementById('historyLimit').addEventListener('change', (e) => {
      this.settings.historyLimit = parseInt(e.target.value);
    });

    document.getElementById('anonymizeData').addEventListener('change', (e) => {
      this.settings.anonymizeData = e.target.checked;
    });

    document.getElementById('requestTimeout').addEventListener('input', (e) => {
      this.settings.requestTimeout = parseInt(e.target.value);
    });

    document.getElementById('enableDebugMode').addEventListener('change', (e) => {
      this.settings.enableDebugMode = e.target.checked;
    });

    // Action buttons
    document.getElementById('saveBtn').addEventListener('click', () => {
      this.saveSettings();
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      this.resetToDefaults();
    });

    document.getElementById('toggleApiKey').addEventListener('click', () => {
      this.toggleApiKeyVisibility();
    });

    document.getElementById('clearHistoryBtn').addEventListener('click', () => {
      this.clearHistory();
    });

    document.getElementById('exportSettingsBtn').addEventListener('click', () => {
      this.exportSettings();
    });

    document.getElementById('importSettingsBtn').addEventListener('click', () => {
      document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', (e) => {
      this.importSettings(e.target.files[0]);
    });

    // Notification close
    document.getElementById('notificationClose').addEventListener('click', () => {
      this.hideNotification();
    });

    // Footer links
    document.getElementById('helpLink').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://github.com/yourusername/ai-content-generator#readme' });
    });

    document.getElementById('feedbackLink').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://github.com/yourusername/ai-content-generator/issues' });
    });

    document.getElementById('privacyLink').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://github.com/yourusername/ai-content-generator/blob/main/PRIVACY.md' });
    });

    // Auto-save on changes (debounced)
    this.setupAutoSave();
  }

  setupAutoSave() {
    let saveTimeout;
    const autoSave = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        this.saveSettings();
      }, 1000);
    };

    // Add auto-save to all form elements
    document.querySelectorAll('input, select, textarea').forEach(element => {
      element.addEventListener('input', autoSave);
      element.addEventListener('change', autoSave);
    });
  }

    populateForm() {    document.getElementById('apiKey').value = this.settings.geminiApiKey;
    document.getElementById('aiModel').value = this.settings.aiModel;
    document.getElementById('maxTokens').value = this.settings.maxTokens;
    document.getElementById('maxTokensValue').textContent = this.settings.maxTokens;
    document.getElementById('temperature').value = this.settings.temperature;
    document.getElementById('temperatureValue').textContent = this.settings.temperature;
    document.getElementById('notionIntegration').checked = this.settings.notionIntegration;
    document.getElementById('defaultInsertMode').value = this.settings.defaultInsertMode;
    document.getElementById('autoSaveContent').checked = this.settings.autoSaveContent;
    document.getElementById('buttonPosition').value = this.settings.buttonPosition;
    document.getElementById('theme').value = this.settings.theme;
    document.getElementById('showKeyboardShortcuts').checked = this.settings.showKeyboardShortcuts;
    document.getElementById('compactMode').checked = this.settings.compactMode;
    document.getElementById('defaultPromptStyle').value = this.settings.defaultPromptStyle;
    document.getElementById('customStyle').value = this.settings.customStyle;
    document.getElementById('includeContext').checked = this.settings.includeContext;
    document.getElementById('historyLimit').value = this.settings.historyLimit;
    document.getElementById('anonymizeData').checked = this.settings.anonymizeData;
    document.getElementById('requestTimeout').value = this.settings.requestTimeout;
    document.getElementById('enableDebugMode').checked = this.settings.enableDebugMode;
  }

  updateUI() {
    this.toggleCustomStyleGroup(this.settings.defaultPromptStyle === 'custom');
  }

  toggleCustomStyleGroup(show) {
    const customStyleGroup = document.getElementById('customStyleGroup');
    customStyleGroup.style.display = show ? 'block' : 'none';
  }

  toggleApiKeyVisibility() {
    const apiKeyInput = document.getElementById('apiKey');
    const toggleBtn = document.getElementById('toggleApiKey');
    const eyeIcon = toggleBtn.querySelector('.eye-icon');
    
    if (apiKeyInput.type === 'password') {
      apiKeyInput.type = 'text';
      eyeIcon.textContent = '🙈';
    } else {
      apiKeyInput.type = 'password';
      eyeIcon.textContent = '👁️';
    }
  }

  async resetToDefaults() {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      this.settings = { ...this.defaultSettings };
      this.populateForm();
      this.updateUI();
      await this.saveSettings();
      this.showNotification('Settings reset to defaults.', 'success');
    }
  }

  async clearHistory() {
    if (confirm('Are you sure you want to clear all content history? This cannot be undone.')) {
      try {
        await chrome.storage.local.remove(['recentContent', 'contentHistory']);
        this.showNotification('Content history cleared successfully.', 'success');
      } catch (error) {
        console.error('Error clearing history:', error);
        this.showNotification('Error clearing history. Please try again.', 'error');
      }
    }
  }

  exportSettings() {
    const settingsData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      settings: this.settings
    };

    const blob = new Blob([JSON.stringify(settingsData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-content-generator-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification('Settings exported successfully.', 'success');
  }

  async importSettings(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.settings) {
        throw new Error('Invalid settings file format.');
      }

      // Validate and merge settings
      const importedSettings = {};
      for (const [key, value] of Object.entries(data.settings)) {
        if (key in this.defaultSettings) {
          importedSettings[key] = value;
        }
      }

      this.settings = { ...this.defaultSettings, ...importedSettings };
      this.populateForm();
      this.updateUI();
      await this.saveSettings();

      this.showNotification('Settings imported successfully.', 'success');
    } catch (error) {
      console.error('Error importing settings:', error);
      this.showNotification('Error importing settings. Please check the file format.', 'error');
    }

    // Clear the file input
    document.getElementById('importFile').value = '';
  }

  showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  hideNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'none';
  }

  // Utility method to validate API key format
  isValidApiKey(key) {
    return key && key.startsWith('sk-') && key.length > 20;
  }

  // Method to test API connection
  async testApiConnection() {
    if (!this.isValidApiKey(this.settings.openaiApiKey)) {
      this.showNotification('Please enter a valid OpenAI API key.', 'warning');
      return false;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.settings.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        this.showNotification('API connection successful!', 'success');
        return true;
      } else {
        this.showNotification('API connection failed. Please check your key.', 'error');
        return false;
      }
    } catch (error) {
      console.error('API test error:', error);
      this.showNotification('Network error. Please check your connection.', 'error');
      return false;
    }
  }
}

// Initialize options page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 's':
        e.preventDefault();
        document.getElementById('saveBtn').click();
        break;
      case 'r':
        e.preventDefault();
        document.getElementById('resetBtn').click();
        break;
    }
  }
}); 