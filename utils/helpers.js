// Helper utilities for AI Content Generator Extension

/**
 * DOM Utilities
 */
export const DOM = {
  /**
   * Create element with attributes and content
   */
  createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else {
        element.setAttribute(key, value);
      }
    });
    
    if (content) {
      if (typeof content === 'string') {
        element.innerHTML = content;
      } else {
        element.appendChild(content);
      }
    }
    
    return element;
  },

  /**
   * Find element by selector with optional parent
   */
  find(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * Find all elements by selector with optional parent
   */
  findAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  /**
   * Wait for element to appear in DOM
   */
  waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  },

  /**
   * Check if element is visible
   */
  isVisible(element) {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  },

  /**
   * Get element position relative to viewport
   */
  getPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height
    };
  }
};

/**
 * Text Processing Utilities
 */
export const Text = {
  /**
   * Truncate text to specified length
   */
  truncate(text, length = 100, suffix = '...') {
    if (!text || text.length <= length) return text;
    return text.substring(0, length - suffix.length) + suffix;
  },

  /**
   * Clean and sanitize text
   */
  sanitize(text) {
    if (!text) return '';
    return text
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  },

  /**
   * Remove personal information from text
   */
  anonymize(text) {
    if (!text) return '';
    return text
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
      .replace(/\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g, '[PHONE]')
      .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD]');
  },

  /**
   * Count words in text
   */
  wordCount(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  },

  /**
   * Estimate tokens from text (rough approximation)
   */
  estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(text.length / 4); // Rough estimation: 1 token ≈ 4 characters
  },

  /**
   * Format text for display
   */
  formatForDisplay(text, maxLength = 200) {
    if (!text) return '';
    const sanitized = this.sanitize(text);
    return this.truncate(sanitized, maxLength);
  },

  /**
   * Extract key phrases from text
   */
  extractKeyPhrases(text, count = 5) {
    if (!text) return [];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([word]) => word);
  }
};

/**
 * Validation Utilities
 */
export const Validator = {
  /**
   * Validate OpenAI API key format
   */
  isValidApiKey(key) {
    return /^sk-[a-zA-Z0-9]{48,}$/.test(key);
  },

  /**
   * Validate email format
   */
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  /**
   * Check if URL is valid
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Check if text content is valid for processing
   */
  isValidContent(content, minLength = 1, maxLength = 10000) {
    if (!content || typeof content !== 'string') return false;
    const trimmed = content.trim();
    return trimmed.length >= minLength && trimmed.length <= maxLength;
  },

  /**
   * Validate settings object
   */
  validateSettings(settings, requiredKeys = []) {
    if (!settings || typeof settings !== 'object') return false;
    return requiredKeys.every(key => key in settings);
  }
};

/**
 * Storage Utilities
 */
export const Storage = {
  /**
   * Get value from chrome storage with fallback
   */
  async get(key, fallback = null) {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key] !== undefined ? result[key] : fallback;
    } catch (error) {
      console.error('Storage get error:', error);
      return fallback;
    }
  },

  /**
   * Set value in chrome storage
   */
  async set(key, value) {
    try {
      await chrome.storage.local.set({ [key]: value });
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },

  /**
   * Remove key from storage
   */
  async remove(key) {
    try {
      await chrome.storage.local.remove(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  /**
   * Clear all storage
   */
  async clear() {
    try {
      await chrome.storage.local.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },

  /**
   * Get storage usage info
   */
  async getUsage() {
    try {
      const items = await chrome.storage.local.get(null);
      const size = JSON.stringify(items).length;
      return {
        itemCount: Object.keys(items).length,
        estimatedSize: size,
        formattedSize: this.formatBytes(size)
      };
    } catch (error) {
      console.error('Storage usage error:', error);
      return null;
    }
  },

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

/**
 * Time Utilities
 */
export const Time = {
  /**
   * Format timestamp to relative time
   */
  formatRelative(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return time.toLocaleDateString();
  },

  /**
   * Create debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Create throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Sleep for specified milliseconds
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

/**
 * Event Utilities
 */
export const Events = {
  /**
   * Add event listener with automatic cleanup
   */
  listen(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
  },

  /**
   * Emit custom event
   */
  emit(element, eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    element.dispatchEvent(event);
  },

  /**
   * Wait for event to occur
   */
  waitFor(element, eventName, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const handler = (event) => {
        element.removeEventListener(eventName, handler);
        resolve(event);
      };
      
      element.addEventListener(eventName, handler);
      
      setTimeout(() => {
        element.removeEventListener(eventName, handler);
        reject(new Error(`Event ${eventName} timeout after ${timeout}ms`));
      }, timeout);
    });
  }
};

/**
 * Notion Integration Utilities
 */
export const Notion = {
  /**
   * Check if current page is a Notion page
   */
  isNotionPage() {
    const hostname = window.location.hostname;
    return hostname.includes('notion.so') || hostname.includes('notion.site');
  },

  /**
   * Find active text block for content insertion
   */
  findActiveBlock() {
    // Try to find focused editable element first
    const focused = document.activeElement;
    if (focused && focused.contentEditable === 'true') {
      return focused;
    }

    // Look for common Notion selectors
    const selectors = [
      '[contenteditable="true"]:focus',
      '.notion-text-block [contenteditable="true"]',
      '[data-block-id] [contenteditable="true"]',
      '.notion-page-content [contenteditable="true"]'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }

    return null;
  },

  /**
   * Insert content into Notion block
   */
  insertContent(content, mode = 'append') {
    const activeBlock = this.findActiveBlock();
    if (!activeBlock) {
      throw new Error('No active text block found');
    }

    switch (mode) {
      case 'replace':
        activeBlock.innerHTML = content;
        break;
      case 'prepend':
        activeBlock.innerHTML = content + activeBlock.innerHTML;
        break;
      case 'append':
      default:
        activeBlock.innerHTML += content;
        break;
    }

    // Trigger input event to notify Notion of changes
    const event = new Event('input', { bubbles: true });
    activeBlock.dispatchEvent(event);

    return true;
  },

  /**
   * Get context from surrounding Notion content
   */
  getPageContext(maxLength = 1000) {
    const contentSelectors = [
      '.notion-page-content',
      '[data-block-id]',
      '.notion-text-block'
    ];

    let context = '';
    for (const selector of contentSelectors) {
      const elements = document.querySelectorAll(selector);
      const texts = Array.from(elements)
        .map(el => el.textContent?.trim())
        .filter(text => text && text.length > 10);
      
      context = texts.join(' ').substring(0, maxLength);
      if (context.length > 100) break;
    }

    return context;
  }
};

/**
 * Error Handling Utilities
 */
export const ErrorHandler = {
  /**
   * Create user-friendly error message
   */
  getUserMessage(error) {
    if (typeof error === 'string') return error;
    
    const message = error.message || 'An unknown error occurred';
    
    // Map common errors to user-friendly messages
    if (message.includes('fetch')) return 'Network error. Please check your connection.';
    if (message.includes('API key')) return 'Invalid API key. Please check your settings.';
    if (message.includes('rate limit')) return 'Too many requests. Please wait before trying again.';
    if (message.includes('timeout')) return 'Request timed out. Please try again.';
    
    return message;
  },

  /**
   * Log error with context
   */
  log(error, context = '') {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${context}:`, error);
  },

  /**
   * Create error report object
   */
  createReport(error, context = {}) {
    return {
      timestamp: new Date().toISOString(),
      message: error.message || error,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
  }
};

/**
 * Animation Utilities
 */
export const Animation = {
  /**
   * Fade in element
   */
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = (timestamp - start) / duration;
      
      element.style.opacity = Math.min(progress, 1);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  },

  /**
   * Fade out element
   */
  fadeOut(element, duration = 300) {
    let start = null;
    const initialOpacity = parseFloat(element.style.opacity) || 1;
    
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = (timestamp - start) / duration;
      
      element.style.opacity = initialOpacity * (1 - Math.min(progress, 1));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
      }
    }
    
    requestAnimationFrame(animate);
  },

  /**
   * Slide in element
   */
  slideIn(element, direction = 'up', duration = 300) {
    const transforms = {
      up: 'translateY(20px)',
      down: 'translateY(-20px)',
      left: 'translateX(20px)',
      right: 'translateX(-20px)'
    };
    
    element.style.transform = transforms[direction];
    element.style.opacity = '0';
    element.style.display = 'block';
    
    setTimeout(() => {
      element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
      element.style.transform = 'translate(0)';
      element.style.opacity = '1';
    }, 10);
  }
}; 