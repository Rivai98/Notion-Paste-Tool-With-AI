// Background service worker for AI Content Writer & Notion Paste extension

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('AI Content Writer extension installed');
  
  // Set default settings if they don't exist
  const settings = await chrome.storage.local.get(['geminiApiKey', 'aiModel', 'notionIntegration', 'buttonPosition']);
  
  if (!settings.geminiApiKey) {
    await chrome.storage.local.set({
      geminiApiKey: 'AIzaSyALcryunSpz4q3DQTewbSkr3Y0xOtnamh8',
      aiModel: 'gemini-2.0-flash',
      maxTokens: 1500,
      temperature: 0.7,
      notionIntegration: true,
      defaultInsertMode: 'append',
      autoSaveContent: true,
      buttonPosition: 'bottom-right',
      theme: 'light'
    });
  }
  
  // Set initial action badge
  chrome.action.setBadgeText({
    text: 'AI'
  });
  
  chrome.action.setBadgeBackgroundColor({
    color: '#4285f4'
  });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'generateContent':
      handleContentGeneration(request.data, sendResponse);
      return true; // Keep response channel open for async response
      
    case 'saveSettings':
      handleSaveSettings(request.data, sendResponse);
      return true;
      
    case 'getSettings':
      handleGetSettings(sendResponse);
      return true;
      
    case 'pasteContent':
      handlePasteContent(request.data, sender.tab.id, sendResponse);
      return true;
      
    case 'showNotification':
      showNotification(request.title, request.message, request.type);
      break;
      
    case 'logError':
      console.error('Extension Error:', request.error);
      break;
      
    default:
      console.warn('Unknown action:', request.action);
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !isNotionPage(tab.url)) {
    return;
  }
  
  switch (command) {
    case '_execute_action':
      // This is handled by the default popup behavior
      break;
      
    case 'paste_last_content':
      const lastContent = await chrome.storage.local.get(['lastGeneratedContent']);
      if (lastContent.lastGeneratedContent) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'pasteContent',
          content: lastContent.lastGeneratedContent
        });
      }
      break;
  }
});

// Handle content generation with Gemini API
async function handleContentGeneration(data, sendResponse) {
  try {
    const settings = await chrome.storage.local.get(['geminiApiKey', 'aiModel', 'maxTokens', 'temperature']);
    
    if (!settings.geminiApiKey || !settings.geminiApiKey.trim()) {
      sendResponse({ success: false, error: 'Gemini API key not configured' });
      return;
    }
    
    const model = settings.aiModel || 'gemini-2.0-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.geminiApiKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a helpful AI assistant that generates high-quality content based on user prompts. Format your responses appropriately for the requested content type.\n\nUser prompt: ${data.prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: settings.temperature || 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: settings.maxTokens || 1500,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }
    
    const result = await response.json();
    const generatedContent = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (generatedContent) {
      // Save the last generated content
      await chrome.storage.local.set({ lastGeneratedContent: generatedContent });
      
      sendResponse({ 
        success: true, 
        content: generatedContent,
        usage: result.usageMetadata
      });
    } else {
      throw new Error('No content generated');
    }
    
  } catch (error) {
    console.error('Content generation error:', error);
    sendResponse({ 
      success: false, 
      error: error.message || 'Failed to generate content'
    });
  }
}

// Handle saving settings
async function handleSaveSettings(data, sendResponse) {
  try {
    await chrome.storage.local.set(data);
    sendResponse({ success: true });
  } catch (error) {
    console.error('Settings save error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle getting settings
async function handleGetSettings(sendResponse) {
  try {
    const settings = await chrome.storage.local.get([
      'geminiApiKey',
      'aiModel', 
      'maxTokens',
      'temperature',
      'notionIntegration',
      'defaultInsertMode',
      'autoSaveContent',
      'buttonPosition',
      'theme',
      'lastGeneratedContent'
    ]);
    sendResponse({ success: true, settings });
  } catch (error) {
    console.error('Settings get error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle content pasting
async function handlePasteContent(data, tabId, sendResponse) {
  try {
    await chrome.tabs.sendMessage(tabId, {
      action: 'insertContent',
      content: data.content,
      options: data.options || {}
    });
    sendResponse({ success: true });
  } catch (error) {
    console.error('Paste content error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Show notification
function showNotification(title, message, type = 'basic') {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-48.svg',
    title: title || 'AI Content Writer',
    message: message
  });
}

// Check if URL is a Notion page
function isNotionPage(url) {
  return url && (url.includes('notion.so') || url.includes('notion.site'));
}

// Handle extension updates
chrome.runtime.onUpdateAvailable.addListener(() => {
  console.log('Extension update available');
});

// Clean up old data periodically
chrome.runtime.onStartup.addListener(async () => {
  try {
    // Clean up old generated content older than 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const data = await chrome.storage.local.get(['contentHistory']);
    
    if (data.contentHistory) {
      const filteredHistory = data.contentHistory.filter(item => 
        item.timestamp > sevenDaysAgo
      );
      
      await chrome.storage.local.set({ contentHistory: filteredHistory });
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}); 