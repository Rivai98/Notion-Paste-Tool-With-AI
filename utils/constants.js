// Constants for AI Content Generator Extension

// API Configuration
export const API_CONFIG = {
  OPENAI_BASE_URL: 'https://api.openai.com/v1',
  DEFAULT_MODEL: 'gpt-3.5-turbo',
  DEFAULT_MAX_TOKENS: 1500,
  DEFAULT_TEMPERATURE: 0.7,
  REQUEST_TIMEOUT: 30000,
  MAX_RETRIES: 3
};

// Extension Settings
export const EXTENSION_CONFIG = {
  NAME: 'AI Content Generator',
  VERSION: '1.0.0',
  DESCRIPTION: 'Generate AI content and paste directly into Notion pages',
  STORAGE_KEYS: {
    SETTINGS: 'ai_content_settings',
    RECENT_CONTENT: 'recent_content',
    CONTENT_HISTORY: 'content_history',
    USER_PREFERENCES: 'user_preferences'
  }
};

// UI Configuration
export const UI_CONFIG = {
  BUTTON_POSITIONS: {
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' }
  },
  ANIMATION_DURATION: 300,
  NOTIFICATION_TIMEOUT: 3000,
  MODAL_Z_INDEX: 10000,
  BUTTON_Z_INDEX: 9999
};

// Content Templates
export const CONTENT_TEMPLATES = {
  blog: {
    name: 'Blog Post',
    icon: '📝',
    prompt: 'Write a comprehensive blog post about: {topic}. Include an engaging introduction, well-structured content with subheadings, and a compelling conclusion.',
    placeholder: 'Enter blog post topic...',
    maxTokens: 2000
  },
  summary: {
    name: 'Summary',
    icon: '📋',
    prompt: 'Create a concise summary of the following content: {content}. Focus on the key points and main ideas.',
    placeholder: 'Enter content to summarize...',
    maxTokens: 800
  },
  list: {
    name: 'List',
    icon: '📋',
    prompt: 'Create a well-organized list about: {topic}. Format as bullet points with clear, actionable items.',
    placeholder: 'Enter list topic...',
    maxTokens: 1000
  },
  email: {
    name: 'Email',
    icon: '✉️',
    prompt: 'Write a professional email about: {topic}. Include appropriate greeting, clear body content, and professional closing.',
    placeholder: 'Enter email purpose...',
    maxTokens: 800
  },
  explanation: {
    name: 'Explanation',
    icon: '💡',
    prompt: 'Provide a clear, detailed explanation of: {topic}. Make it easy to understand with examples where helpful.',
    placeholder: 'Enter concept to explain...',
    maxTokens: 1500
  },
  outline: {
    name: 'Outline',
    icon: '📊',
    prompt: 'Create a detailed outline for: {topic}. Include main sections, subsections, and key points to cover.',
    placeholder: 'Enter outline topic...',
    maxTokens: 1000
  }
};

// Writing Styles
export const WRITING_STYLES = {
  professional: {
    name: 'Professional',
    description: 'Formal, clear, and business-appropriate tone',
    modifier: 'Write in a professional, formal tone suitable for business communication.'
  },
  casual: {
    name: 'Casual',
    description: 'Relaxed, conversational, and friendly tone',
    modifier: 'Write in a casual, conversational tone that feels friendly and approachable.'
  },
  creative: {
    name: 'Creative',
    description: 'Imaginative, engaging, and artistic expression',
    modifier: 'Write creatively with engaging language, vivid descriptions, and imaginative elements.'
  },
  academic: {
    name: 'Academic',
    description: 'Scholarly, precise, and research-oriented',
    modifier: 'Write in an academic style with precise language, proper citations, and scholarly tone.'
  },
  technical: {
    name: 'Technical',
    description: 'Clear, precise, and detail-oriented',
    modifier: 'Write technically with precise terminology, clear explanations, and detailed accuracy.'
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'OpenAI API key is required. Please add it in the extension settings.',
  API_KEY_INVALID: 'Invalid API key format. Please check your OpenAI API key.',
  API_REQUEST_FAILED: 'Failed to generate content. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please wait before making another request.',
  NOTION_NOT_DETECTED: 'Please navigate to a Notion page to use this feature.',
  CONTENT_TOO_LONG: 'Content is too long. Please try with shorter input.',
  GENERATION_TIMEOUT: 'Content generation timed out. Please try again.',
  PERMISSION_DENIED: 'Permission denied. Please check extension permissions.',
  STORAGE_ERROR: 'Error saving data. Please try again.',
  INVALID_RESPONSE: 'Invalid response from AI service. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CONTENT_GENERATED: 'Content generated successfully!',
  CONTENT_INSERTED: 'Content inserted into Notion page.',
  SETTINGS_SAVED: 'Settings saved successfully.',
  CONTENT_COPIED: 'Content copied to clipboard.',
  TEMPLATE_APPLIED: 'Template applied successfully.',
  HISTORY_CLEARED: 'Content history cleared.',
  EXPORT_COMPLETE: 'Settings exported successfully.'
};

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  OPEN_GENERATOR: 'Ctrl+Shift+A',
  PASTE_LAST: 'Ctrl+Shift+P',
  COPY_CONTENT: 'Ctrl+C',
  CLOSE_MODAL: 'Escape',
  SUBMIT_FORM: 'Ctrl+Enter'
};

// Notion Page Detection
export const NOTION_SELECTORS = {
  CONTENT_EDITABLE: '[contenteditable="true"]',
  TEXT_BLOCK: '[data-block-id]',
  EDITOR_CONTAINER: '.notion-page-content',
  ACTIVE_BLOCK: '.notion-selectable.notion-collection_view_page-block',
  INSERT_POINTS: [
    '[contenteditable="true"]:focus',
    '.notion-text-block',
    '.notion-page-content',
    '[data-block-id]'
  ]
};

// Content Limits
export const CONTENT_LIMITS = {
  MAX_PROMPT_LENGTH: 4000,
  MAX_RESPONSE_TOKENS: 4000,
  MAX_HISTORY_ITEMS: 100,
  MAX_TEMPLATE_LENGTH: 2000,
  MIN_CONTENT_LENGTH: 10
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Theme Configuration
export const THEMES = {
  light: {
    name: 'Light',
    primaryColor: '#667eea',
    backgroundColor: '#ffffff',
    textColor: '#374151',
    borderColor: '#e5e7eb'
  },
  dark: {
    name: 'Dark',
    primaryColor: '#818cf8',
    backgroundColor: '#1f2937',
    textColor: '#f9fafb',
    borderColor: '#374151'
  },
  auto: {
    name: 'Auto (System)',
    useSystemPreference: true
  }
};

// Default Settings
export const DEFAULT_SETTINGS = {
  openaiApiKey: '',
  aiModel: API_CONFIG.DEFAULT_MODEL,
  maxTokens: API_CONFIG.DEFAULT_MAX_TOKENS,
  temperature: API_CONFIG.DEFAULT_TEMPERATURE,
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

// Regular Expressions
export const REGEX_PATTERNS = {
  API_KEY: /^sk-[a-zA-Z0-9]{48,}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
  PERSONAL_INFO: /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
};

// URL Patterns
export const URL_PATTERNS = {
  NOTION_DOMAINS: [
    '*://*.notion.so/*',
    '*://*.notion.site/*',
    '*://notion.so/*',
    '*://www.notion.so/*'
  ],
  OPENAI_API: 'https://api.openai.com/*'
}; 