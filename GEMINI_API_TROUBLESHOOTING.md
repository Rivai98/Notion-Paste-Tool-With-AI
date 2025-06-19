# 🔧 **GEMINI API TROUBLESHOOTING GUIDE**

## 🚨 **Common Error Types & Solutions**

### **1. Rate Limiting Errors**
**Error:** `429 Too Many Requests` or Rate limit exceeded

**Solutions:**
- **Implement Exponential Backoff**: Use progressive delays between retry attempts
- **Request Timeout Setting**: Set reasonable timeouts (30-60 seconds)
- **Batch Requests**: Avoid rapid successive API calls
- **Monitor Usage**: Check quota limits in Google AI Studio

```javascript
// Exponential Backoff Example
async function callGeminiWithRetry(prompt, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await callGeminiAPI(prompt);
      return response;
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

### **2. API Key Issues**
**Error:** `400 Bad Request` - Invalid API key

**Solutions:**
- ✅ **Verify API Key Format**: Should start with `AIzaSy...`
- ✅ **Check Google AI Studio**: Ensure key is active
- ✅ **Regenerate Key**: Create new key if current one is invalid
- ✅ **Environment Variables**: Store securely, don't hardcode

### **3. Request Format Errors**
**Error:** `400 Bad Request` - Invalid request format

**Common Issues:**
- **Incorrect Content Structure**: Must use `contents` array format
- **Missing Required Fields**: `parts` array with `text` property
- **Invalid Model Name**: Use correct Gemini model names

**Correct Format:**
```javascript
const requestBody = {
  contents: [{
    parts: [{
      text: "Your prompt here"
    }]
  }],
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1500
  }
};
```

### **4. Network/Connection Errors**
**Error:** `TypeError: fetch failed` or Connection timeout

**Solutions:**
- **Check Internet Connection**: Ensure stable network
- **Firewall/Proxy**: Verify access to `generativelanguage.googleapis.com`
- **Retry Logic**: Implement automatic retries for network failures
- **Timeout Configuration**: Set appropriate request timeouts

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000);

try {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
    signal: controller.signal
  });
} catch (error) {
  if (error.name === 'AbortError') {
    throw new Error('Request timeout - please try again');
  }
  throw error;
} finally {
  clearTimeout(timeoutId);
}
```

---

## ⚡ **Best Practices for Gemini API**

### **1. Error Handling**
```javascript
async function handleGeminiRequest(prompt) {
  try {
    const response = await fetch(apiUrl, requestConfig);
    
    if (!response.ok) {
      const errorData = await response.json();
      
      switch (response.status) {
        case 400:
          throw new Error(`Invalid request: ${errorData.error?.message}`);
        case 401:
          throw new Error('Invalid API key - please check your configuration');
        case 403:
          throw new Error('API access forbidden - check billing and quotas');
        case 429:
          throw new Error('Rate limit exceeded - please wait and try again');
        case 500:
          throw new Error('Internal server error - please try again later');
        default:
          throw new Error(`API error ${response.status}: ${errorData.error?.message}`);
      }
    }
    
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text;
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Re-throw with user-friendly message
    if (error.message.includes('fetch failed')) {
      throw new Error('Network error - please check your internet connection');
    }
    throw error;
  }
}
```

### **2. Content Safety Handling**
```javascript
const safetySettings = [
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
];
```

### **3. Model Selection Guide**
- **`gemini-2.0-flash`**: ⚡ Latest, fastest, best overall performance
- **`gemini-1.5-pro`**: 🎯 Higher quality, complex reasoning tasks
- **`gemini-1.5-flash`**: ⚖️ Balance of speed and quality

### **4. Optimal Configuration**
```javascript
const optimalConfig = {
  temperature: 0.7,        // Good creativity balance
  topK: 40,               // Reasonable diversity
  topP: 0.95,             // High quality threshold
  maxOutputTokens: 1500,  // Reasonable length
  stopSequences: [],      // Optional stopping conditions
};
```

---

## 🛠 **Chrome Extension Specific Issues**

### **1. Content Script Communication**
**Problem**: `Could not establish connection. Receiving end does not exist.`

**Solution**:
```javascript
// Always check if content script is loaded
try {
  const response = await chrome.tabs.sendMessage(tabId, { action: 'ping' });
  // Content script is loaded, proceed
} catch (error) {
  // Inject content script if not loaded
  await chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['content/content-script.js']
  });
  
  // Wait for initialization and retry
  setTimeout(async () => {
    await chrome.tabs.sendMessage(tabId, { action: 'yourAction' });
  }, 1000);
}
```

### **2. API Key Storage**
```javascript
// Secure storage in background script
chrome.storage.local.set({
  geminiApiKey: 'AIzaSy...',  // Your actual key
  encryptionKey: 'optional'   // For additional security
});

// Validation before use
function isValidGeminiKey(key) {
  return key && key.startsWith('AIzaSy') && key.length > 30;
}
```

---

## 🔍 **Debugging Tips**

### **1. Enable Debug Mode**
```javascript
const DEBUG = true; // Set to true for debugging

function debugLog(message, data) {
  if (DEBUG) {
    console.log(`[Gemini API Debug] ${message}`, data);
  }
}

// Use in API calls
debugLog('Sending request to Gemini:', requestBody);
debugLog('Received response:', responseData);
```

### **2. Response Validation**
```javascript
function validateGeminiResponse(response) {
  if (!response) {
    throw new Error('Empty response from Gemini API');
  }
  
  if (!response.candidates || response.candidates.length === 0) {
    throw new Error('No candidates in response - content may have been filtered');
  }
  
  const content = response.candidates[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error('No text content in response');
  }
  
  return content;
}
```

### **3. Monitor Usage**
```javascript
function logUsageMetrics(response) {
  if (response.usageMetadata) {
    console.log('Token usage:', {
      promptTokens: response.usageMetadata.promptTokenCount,
      candidatesTokens: response.usageMetadata.candidatesTokenCount,
      totalTokens: response.usageMetadata.totalTokenCount
    });
  }
}
```

---

## 📋 **Quick Checklist for Issues**

### ✅ **Before Reporting Issues:**

1. **API Key Verification:**
   - [ ] Key starts with `AIzaSy`
   - [ ] Key is active in Google AI Studio
   - [ ] No extra spaces or characters

2. **Request Format:**
   - [ ] Using correct Gemini API endpoint
   - [ ] `contents` array with `parts` structure
   - [ ] Valid model name (gemini-2.0-flash, etc.)

3. **Network & Environment:**
   - [ ] Internet connection stable
   - [ ] No firewall blocking Google APIs
   - [ ] Browser allows HTTPS requests

4. **Extension Specific:**
   - [ ] Content script loaded on target page
   - [ ] Permissions granted in manifest.json
   - [ ] Background script running properly

### 🆘 **Common Quick Fixes:**

1. **Reload Extension**: Go to `chrome://extensions/` and click reload
2. **Clear Storage**: Reset settings to defaults
3. **Regenerate API Key**: Create new key in Google AI Studio
4. **Check Browser Console**: Look for specific error messages
5. **Test on Simple Notion Page**: Verify basic functionality

---

## 📚 **Useful Resources**

- **Google AI Studio**: https://makersuite.google.com/app/apikey
- **Gemini API Documentation**: https://ai.google.dev/gemini-api/docs
- **Model Capabilities**: https://ai.google.dev/gemini-api/docs/models/gemini
- **Safety Settings**: https://ai.google.dev/gemini-api/docs/safety-settings
- **Rate Limits**: https://ai.google.dev/gemini-api/docs/rate-limits

---

## 🎯 **Your Current Configuration**

- **API Key**: `AIzaSyALcryunSpz4q3DQTewbSkr3Y0xOtnamh8` ✅
- **Default Model**: `gemini-2.0-flash` ⚡
- **Max Tokens**: 1500 📝
- **Temperature**: 0.7 🎨

**Status**: ✅ **All syntax errors fixed, extension ready for testing!** 