# 🔧 **NOTION PASTE TROUBLESHOOTING GUIDE**

## 🚨 **Common Notion Paste Issues & Solutions**

### **Problem 1: Content Not Pasting After Clicking Button**
**Symptoms:** Button shows "success" but no content appears in Notion

**Root Causes:**
1. **Content Script Focus Issues**: Editor loses focus when modal opens
2. **Timing Problems**: Script runs before Notion editor is ready
3. **Wrong Target Element**: Script finds wrong contentEditable element
4. **Selection State Lost**: Editor selection becomes null after focus loss

---

## ⚡ **IMMEDIATE FIXES TO TRY**

### **Fix 1: Enhanced Notion Element Detection**
Update your `pasteContentToNotionPage` function:

```javascript
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
```

### **Fix 2: Improved Paste Function with Multiple Methods**

```javascript
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
      
      if (hasContentChanged(targetElement)) {
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
  
  // Clear existing content if needed
  const shouldClear = targetElement.textContent.trim() === '' || 
                     confirm('Replace existing content?');
  
  if (shouldClear) {
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
  if (!hasContentChanged(editor)) {
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

function hasContentChanged(element) {
  // Check if content was actually inserted
  return element.textContent.trim().length > 0;
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
```

### **Fix 3: Better Modal Management**
Update your modal close handling:

```javascript
// In your modal initialization
const closeModal = (modal) => {
  // Don't remove focus immediately
  modal.classList.remove('visible');
  
  // Delay removal to allow paste operation to complete
  setTimeout(() => {
    modal.remove();
    
    // Try to restore focus to Notion
    const notionEditor = document.querySelector('[data-block-id] [contenteditable="true"]');
    if (notionEditor) {
      notionEditor.focus();
    }
  }, 100); // Reduced delay
};
```

### **Fix 4: Enhanced Paste Button Handler**

```javascript
// Updated paste button handler
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
```

---

## 🔍 **DEBUGGING CHECKLIST**

### **Test Each Step:**

1. **✅ Check Extension Loading**
   ```javascript
   // Run in console on Notion page
   console.log('Content script loaded:', !!window.ai_content_writer_loaded);
   ```

2. **✅ Test Element Detection**
   ```javascript
   // Run in console
   const editors = document.querySelectorAll('[contenteditable="true"]');
   console.log('Found editors:', editors.length);
   editors.forEach((el, i) => console.log(`Editor ${i}:`, el));
   ```

3. **✅ Test Focus and Selection**
   ```javascript
   // Click in a Notion block, then run:
   console.log('Active element:', document.activeElement);
   console.log('Selection:', window.getSelection().toString());
   ```

4. **✅ Test Paste Manually**
   - Copy some text normally
   - Paste in Notion with Ctrl+V
   - If this doesn't work, the issue is with Notion itself

---

## 🚀 **ALTERNATIVE SOLUTIONS**

### **Solution A: Clipboard-Based Approach**
```javascript
async function clipboardPasteMethod(content) {
  try {
    // Write to clipboard
    await navigator.clipboard.writeText(content);
    
    // Show instruction to user
    showInPageNotification('Content copied! Press Ctrl+V to paste in Notion', 'info');
    
    // Focus the likely target
    const target = document.querySelector('[data-block-id] [contenteditable="true"]');
    if (target) {
      target.focus();
    }
    
  } catch (error) {
    throw new Error('Could not copy to clipboard');
  }
}
```

### **Solution B: User-Guided Paste**
```javascript
function guidedPasteMethod(content) {
  // Create a temporary textarea for user to copy from
  const tempTextarea = document.createElement('textarea');
  tempTextarea.value = content;
  tempTextarea.style.position = 'fixed';
  tempTextarea.style.top = '50%';
  tempTextarea.style.left = '50%';
  tempTextarea.style.transform = 'translate(-50%, -50%)';
  tempTextarea.style.padding = '20px';
  tempTextarea.style.border = '2px solid #007acc';
  tempTextarea.style.borderRadius = '8px';
  tempTextarea.style.zIndex = '10000';
  tempTextarea.style.background = 'white';
  
  document.body.appendChild(tempTextarea);
  tempTextarea.select();
  tempTextarea.focus();
  
  showInPageNotification('Content selected! Copy with Ctrl+C, then paste in Notion', 'info');
  
  // Remove after 10 seconds
  setTimeout(() => {
    tempTextarea.remove();
  }, 10000);
}
```

---

## 📝 **TESTING INSTRUCTIONS**

1. **Open Notion page**
2. **Load the extension** (check for floating button)
3. **Click in a text block** in Notion
4. **Generate content** using the extension
5. **Click "Paste to Notion"**
6. **Check console for errors** (F12 → Console)

### **If Still Not Working:**

1. **Try the clipboard method** (copies to clipboard for manual paste)
2. **Check Notion page type** (some templates may be restricted)
3. **Test on a simple Notion page** first
4. **Reload extension** and try again

---

## 💡 **PREVENTION TIPS**

- **Always click in a Notion text block before using the extension**
- **Avoid using when Notion is loading or saving**
- **Test on simple text blocks before trying complex layouts**
- **Keep content under 2000 characters for best results**

---

## 🆘 **QUICK FIXES TO TRY NOW**

1. **Reload the extension** in `chrome://extensions/`
2. **Refresh the Notion page**
3. **Click in a simple text block first**
4. **Try the clipboard copy option** instead of direct paste
5. **Check if manual Ctrl+V works** in the same location

This should resolve your paste issues! The enhanced detection and multiple fallback methods will handle most Notion page scenarios. 