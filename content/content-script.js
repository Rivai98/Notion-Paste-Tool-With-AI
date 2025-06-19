// Content script for AI Content Writer extension
// Runs on Notion pages to provide AI content generation functionality

(function() {
  'use strict';
  
  let floatingButton = null;
  let isButtonVisible = false;
  let extensionSettings = {};
  
  // Initialize the content script
  function init() {
    console.log('AI Content Writer: Content script loaded on Notion page');
    
    // Load settings
    loadSettings();
    
    // Create floating button
    createFloatingButton();
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(handleMessage);
    
    // Listen for page changes (Notion is a SPA)
    observePageChanges();
    
    // Listen for keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
  }
  
  // Load extension settings
  async function loadSettings() {
    try {
      const response = await sendMessageToBackground('getSettings');
      if (response.success) {
        extensionSettings = response.settings;
        updateUIBasedOnSettings();
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }
  
  // Create the floating AI button
  function createFloatingButton() {
    if (floatingButton) {
      floatingButton.remove();
    }
    
    floatingButton = document.createElement('div');
    floatingButton.id = 'ai-content-writer-button';
    floatingButton.className = 'ai-content-writer-floating-btn';
    floatingButton.innerHTML = `
      <div class="ai-btn-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
          <path d="M19 15L19.91 18.74L24 19L19.91 19.26L19 23L18.09 19.26L14 19L18.09 18.74L19 15Z" fill="currentColor"/>
          <path d="M5 15L5.91 18.74L10 19L5.91 19.26L5 23L4.09 19.26L0 19L4.09 18.74L5 15Z" fill="currentColor"/>
        </svg>
      </div>
      <div class="ai-btn-text">AI</div>
    `;
    
    floatingButton.title = 'Generate AI Content (Ctrl+Shift+A)';
    floatingButton.addEventListener('click', openContentGenerator);
    
    // Position the button
    const position = extensionSettings.buttonPosition || 'bottom-right';
    positionFloatingButton(position);
    
    document.body.appendChild(floatingButton);
    
    // Show button with animation
    setTimeout(() => {
      floatingButton.classList.add('visible');
      isButtonVisible = true;
    }, 500);
  }
  
  // Position the floating button based on settings
  function positionFloatingButton(position) {
    floatingButton.classList.remove('bottom-right', 'bottom-left', 'top-right', 'top-left');
    floatingButton.classList.add(position);
  }
  
  // Open the content generator popup
  function openContentGenerator() {
    // Check if API key is configured
    if (!extensionSettings.geminiApiKey || !extensionSettings.geminiApiKey.trim()) {
      showInPageNotification('Please configure your Gemini API key in the extension settings', 'warning');
      return;
    }
    
    // Create and show the content generator modal
    createContentGeneratorModal();
  }
  
  // Create the content generator modal
  function createContentGeneratorModal() {
    // Remove existing modal if any
    const existingModal = document.getElementById('ai-content-generator-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'ai-content-generator-modal';
    modal.className = 'ai-content-modal';
    
    modal.innerHTML = `
      <div class="ai-modal-backdrop"></div>
      <div class="ai-modal-content">
        <div class="ai-modal-header">
          <h3>Generate AI Content</h3>
          <button class="ai-modal-close" title="Close">&times;</button>
        </div>
        <div class="ai-modal-body">
          <div class="ai-form-group">
            <label for="ai-prompt-input">What would you like to create?</label>
            <textarea 
              id="ai-prompt-input" 
              placeholder="Enter your prompt here... (e.g., 'Write a blog post about productivity tips')"
              rows="4"
            ></textarea>
          </div>
          
          <div class="ai-templates">
            <label>Quick Templates:</label>
            <div class="ai-template-buttons">
              <button class="ai-template-btn" data-template="blog">Blog Post</button>
              <button class="ai-template-btn" data-template="summary">Summary</button>
              <button class="ai-template-btn" data-template="list">List</button>
              <button class="ai-template-btn" data-template="email">Email</button>
            </div>
          </div>
          
          <div class="ai-settings-row">
            <div class="ai-setting">
              <label for="ai-model-select">Model:</label>
              <select id="ai-model-select">
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              </select>
            </div>
            <div class="ai-setting">
              <label for="ai-max-tokens">Max Length:</label>
              <select id="ai-max-tokens">
                <option value="500">Short (500)</option>
                <option value="1000">Medium (1000)</option>
                <option value="2000">Long (2000)</option>
              </select>
            </div>
          </div>
          
          <div class="ai-generated-content" id="ai-generated-content" style="display: none;">
            <label>Generated Content:</label>
            <div class="ai-content-preview" id="ai-content-preview"></div>
          </div>
        </div>
        <div class="ai-modal-footer">
          <button id="ai-generate-btn" class="ai-btn ai-btn-primary">
            <span class="ai-btn-text">Generate Content</span>
            <span class="ai-loading-spinner" style="display: none;">⟳</span>
          </button>
          <button id="ai-paste-btn" class="ai-btn ai-btn-success" style="display: none;">
            Paste to Notion
          </button>
          <button id="ai-cancel-btn" class="ai-btn ai-btn-secondary">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Initialize modal functionality
    initializeModal(modal);
    
    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('visible');
    }, 10);
    
    // Focus on prompt input
    const promptInput = modal.querySelector('#ai-prompt-input');
    promptInput.focus();
  }
  
  // Initialize modal functionality
  function initializeModal(modal) {
    const promptInput = modal.querySelector('#ai-prompt-input');
    const generateBtn = modal.querySelector('#ai-generate-btn');
    const pasteBtn = modal.querySelector('#ai-paste-btn');
    const cancelBtn = modal.querySelector('#ai-cancel-btn');
    const closeBtn = modal.querySelector('.ai-modal-close');
    const templateBtns = modal.querySelectorAll('.ai-template-btn');
    const modelSelect = modal.querySelector('#ai-model-select');
    const maxTokensSelect = modal.querySelector('#ai-max-tokens');
    const backdrop = modal.querySelector('.ai-modal-backdrop');
    
    let generatedContent = '';
    
    // Load current settings
    if (extensionSettings.aiModel) {
      modelSelect.value = extensionSettings.aiModel || 'gemini-2.0-flash';
    }
    if (extensionSettings.maxTokens) {
      maxTokensSelect.value = extensionSettings.maxTokens || 1500;
    }
    
    // Template button handlers
    templateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const template = btn.dataset.template;
        const templatePrompts = {
          blog: 'Write a comprehensive blog post about: ',
          summary: 'Create a concise summary of: ',
          list: 'Create a well-organized list about: ',
          email: 'Write a professional email about: '
        };
        
        const currentText = promptInput.value.trim();
        if (!currentText) {
          promptInput.value = templatePrompts[template];
        } else {
          promptInput.value = templatePrompts[template] + currentText;
        }
        promptInput.focus();
        
        // Update cursor position to end
        promptInput.setSelectionRange(promptInput.value.length, promptInput.value.length);
      });
    });
    
    // Generate button handler
    generateBtn.addEventListener('click', async () => {
      const prompt = promptInput.value.trim();
      if (!prompt) {
        showInPageNotification('Please enter a prompt', 'warning');
        return;
      }
      
      // Show loading state
      generateBtn.disabled = true;
      generateBtn.querySelector('.ai-btn-text').style.display = 'none';
      generateBtn.querySelector('.ai-loading-spinner').style.display = 'inline';
      
      try {
        const response = await sendMessageToBackground('generateContent', {
          prompt: prompt,
          model: modelSelect.value,
          maxTokens: parseInt(maxTokensSelect.value)
        });
        
        if (response.success) {
          generatedContent = response.content;
          displayGeneratedContent(generatedContent);
          pasteBtn.style.display = 'inline-block';
          showInPageNotification('Content generated successfully!', 'success');
        } else {
          throw new Error(response.error || 'Failed to generate content');
        }
        
      } catch (error) {
        console.error('Generation error:', error);
        showInPageNotification(`Error: ${error.message}`, 'error');
      } finally {
        // Reset loading state
        generateBtn.disabled = false;
        generateBtn.querySelector('.ai-btn-text').style.display = 'inline';
        generateBtn.querySelector('.ai-loading-spinner').style.display = 'none';
      }
    });
    
    // Paste button handler
    pasteBtn.addEventListener('click', async () => {
      if (!generatedContent) {
        showInPageNotification('No content to paste', 'warning');
        return;
      }
      
      // Show loading state
      pasteBtn.disabled = true;
      pasteBtn.textContent = 'Pasting...';
      
      try {
        // Close modal but keep content reference
        const contentToPaste = generatedContent;
        
        // Close modal first
        closeModal(modal);
        
        // Wait for modal to close
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Now paste content
        await pasteContentToNotionPage(contentToPaste);
        showInPageNotification('Content pasted successfully!', 'success');
        
      } catch (error) {
        console.error('Paste error:', error);
        showInPageNotification(`Error: ${error.message}`, 'error');
        
        // Re-open modal on error
        setTimeout(() => {
          createContentGeneratorModal();
        }, 1000);
      } finally {
        pasteBtn.disabled = false;
        pasteBtn.textContent = 'Paste to Notion';
      }
    });
    
    // Close handlers
    const closeModal = (modal) => {
      modal.classList.remove('visible');
      setTimeout(() => {
        modal.remove();
        
        // Try to restore focus to Notion
        const notionEditor = document.querySelector('[data-block-id] [contenteditable="true"]');
        if (notionEditor) {
          notionEditor.focus();
        }
      }, 100);
    };
    
    closeBtn.addEventListener('click', () => closeModal(modal));
    cancelBtn.addEventListener('click', () => closeModal(modal));
    backdrop.addEventListener('click', () => closeModal(modal));
    
    // Escape key handler
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Display generated content
    function displayGeneratedContent(content) {
      const contentContainer = modal.querySelector('#ai-generated-content');
      const contentPreview = modal.querySelector('#ai-content-preview');
      
      contentPreview.textContent = content;
      contentContainer.style.display = 'block';
      
      // Scroll to show the generated content
      contentContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  
  // Paste content to Notion page
  async function pasteContentToNotionPage(content) {
    // Wait for any modal animations to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find the best target element using multiple strategies
    let targetElement = null;
    
    // Strategy 1: Find currently focused element
    const activeElement = document.activeElement;
    if (activeElement && isValidNotionEditor(activeElement)) {
      targetElement = activeElement;
    }
    
    // Strategy 2: Look for main content area
    if (!targetElement) {
      const selectors = [
        '[data-block-id] [contenteditable="true"]',
        '.notion-page-content [contenteditable="true"]',
        '[role="textbox"][contenteditable="true"]',
        '.notranslate[contenteditable="true"]',
        '[data-content-editable-leaf="true"]'
      ];
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          if (isValidNotionEditor(element) && isElementVisible(element)) {
            targetElement = element;
            break;
          }
        }
        if (targetElement) break;
      }
    }
    
    // Strategy 3: Find the main page content if nothing else works
    if (!targetElement) {
      const pageContent = document.querySelector('.notion-page-content');
      if (pageContent) {
        // Create a new block by clicking
        pageContent.click();
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Try to find the editor again
        const newEditor = document.querySelector('[data-block-id] [contenteditable="true"]');
        if (newEditor) {
          targetElement = newEditor;
        }
      }
    }
    
    if (!targetElement) {
      throw new Error('Could not find a suitable Notion editor. Please click in a text block first.');
    }
    
    // Focus and paste content
    return await pasteToTarget(targetElement, content);
  }

  function isValidNotionEditor(element) {
    // Check if element is a valid Notion editor
    return element.contentEditable === 'true' && 
           !element.disabled && 
           !element.readOnly &&
           element.offsetParent !== null; // Not hidden
  }

  function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && 
           window.getComputedStyle(element).visibility !== 'hidden';
  }

  async function pasteToTarget(targetElement, content) {
    // Method 1: Try modern Clipboard API first
    try {
      await targetElement.focus();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use Clipboard API if available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
        
        // Simulate Ctrl+V
        targetElement.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'v',
          code: 'KeyV',
          ctrlKey: true,
          bubbles: true
        }));
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (hasContentChanged(targetElement, content)) {
          return; // Success!
        }
      }
    } catch (error) {
      console.log('Clipboard API method failed, trying alternative:', error);
    }
    
    // Method 2: Direct content insertion
    try {
      await insertContentDirectly(targetElement, content);
    } catch (error) {
      console.log('Direct insertion failed, trying document.execCommand:', error);
      
      // Method 3: Legacy execCommand (fallback)
      await legacyPasteMethod(targetElement, content);
    }
  }

  async function insertContentDirectly(targetElement, content) {
    targetElement.focus();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Clear existing content if it's empty
    if (targetElement.textContent.trim() === '') {
      targetElement.textContent = '';
    }
    
    // Insert content paragraph by paragraph
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].trim();
      
      if (i > 0) {
        // Create new block for subsequent paragraphs
        await createNewNotionBlock();
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Find the new editor
        const newEditor = document.activeElement || targetElement;
        if (newEditor && newEditor.contentEditable === 'true') {
          targetElement = newEditor;
        }
      }
      
      // Insert text for this paragraph
      await insertTextInEditor(targetElement, paragraph);
    }
  }

  async function insertTextInEditor(editor, text) {
    editor.focus();
    
    // Method 1: Try input event
    editor.textContent = text;
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    editor.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Method 2: Character by character if needed
    if (!hasContentChanged(editor, text)) {
      editor.textContent = '';
      for (const char of text) {
        editor.textContent += char;
        editor.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
  }

  async function createNewNotionBlock() {
    // Press Enter to create new block
    const activeElement = document.activeElement;
    if (activeElement) {
      activeElement.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true
      }));
      
      activeElement.dispatchEvent(new KeyboardEvent('keyup', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true
      }));
    }
  }

  function hasContentChanged(element, expectedContent) {
    // Check if content was actually inserted
    const actualContent = element.textContent.trim();
    return actualContent.length > 0 && actualContent.includes(expectedContent.substring(0, 50));
  }

  async function legacyPasteMethod(targetElement, content) {
    targetElement.focus();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Use legacy execCommand
    if (document.execCommand) {
      document.execCommand('insertText', false, content);
    } else {
      // Absolute fallback
      targetElement.innerText = content;
      targetElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
  
  // Show in-page notification
  function showInPageNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `ai-notification ai-notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
      notification.classList.add('visible');
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 4000);
  }
  
  // Handle messages from background script
  function handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case 'ping':
        sendResponse({ success: true, status: 'Content script loaded' });
        break;
        
      case 'pasteContent':
        pasteContentToNotionPage(request.content)
          .then(() => {
            showInPageNotification('Content pasted!', 'success');
            sendResponse({ success: true });
          })
          .catch(error => {
            showInPageNotification(`Error: ${error.message}`, 'error');
            sendResponse({ success: false, error: error.message });
          });
        return true;
        
      case 'openGenerator':
        openContentGenerator();
        sendResponse({ success: true });
        break;
        
      case 'updateSettings':
        extensionSettings = request.settings;
        updateUIBasedOnSettings();
        sendResponse({ success: true });
        break;
    }
  }
  
  // Update UI based on settings
  function updateUIBasedOnSettings() {
    if (floatingButton && extensionSettings.buttonPosition) {
      positionFloatingButton(extensionSettings.buttonPosition || 'bottom-right');
    }
  }
  
  // Handle keyboard shortcuts
  function handleKeyboardShortcuts(event) {
    // Ctrl+Shift+A (or Cmd+Shift+A on Mac) - Open content generator
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
      event.preventDefault();
      openContentGenerator();
    }
    
    // Ctrl+Shift+P (or Cmd+Shift+P on Mac) - Paste last content
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
      event.preventDefault();
      if (extensionSettings.lastGeneratedContent) {
        pasteContentToNotionPage(extensionSettings.lastGeneratedContent)
          .then(() => showInPageNotification('Last content pasted!', 'success'))
          .catch(error => showInPageNotification(`Error: ${error.message}`, 'error'));
      } else {
        showInPageNotification('No previous content to paste', 'warning');
      }
    }
  }
  
  // Observe page changes for SPA navigation
  function observePageChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if the floating button is still present
          if (!document.contains(floatingButton) && isButtonVisible) {
            createFloatingButton();
          }
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Send message to background script
  function sendMessageToBackground(action, data = null) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { action, data },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        }
      );
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})(); 