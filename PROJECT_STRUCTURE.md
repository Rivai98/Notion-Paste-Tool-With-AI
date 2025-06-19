# Project Structure

## AI Content Writer & Notion Paste Chrome Extension

This document outlines the structure and purpose of each file and directory in the Chrome extension project.

```
ai-content-notion-extension/
├── 📄 manifest.json              # Extension configuration (Manifest V3)
├── 📄 background.js             # Service worker for API calls and background tasks
├── 📁 content/                  # Content scripts for Notion page integration
│   ├── 📄 content-script.js     # Main content script for Notion interaction
│   └── 📄 content-styles.css    # Styles for injected UI elements
├── 📁 popup/                    # Extension popup interface
│   ├── 📄 popup.html           # Popup HTML structure
│   ├── 📄 popup.js             # Popup functionality and event handling
│   └── 📄 popup.css            # Popup styling and responsive design
├── 📄 options.html             # Settings/options page
├── 📄 options.css              # Settings page styling
├── 📄 options.js               # Settings page functionality
├── 📁 utils/                   # Shared utilities and constants
│   ├── 📄 constants.js         # Application constants and configuration
│   └── 📄 helpers.js           # Utility functions and helpers
├── 📁 icons/                   # Extension icons (SVG format)
│   ├── 📄 icon-16.svg          # 16x16 icon for browser toolbar
│   ├── 📄 icon-32.svg          # 32x32 icon for various UI elements
│   ├── 📄 icon-48.svg          # 48x48 icon for extension management
│   └── 📄 icon-128.svg         # 128x128 icon for Chrome Web Store
├── 📄 README.md                # Main documentation and user guide
├── 📄 INSTALLATION.md          # Detailed installation instructions
├── 📄 CHANGELOG.md             # Version history and release notes
├── 📄 PRIVACY.md               # Privacy policy and data handling
└── 📄 PROJECT_STRUCTURE.md     # This file
```

## File Descriptions

### Core Extension Files

#### `manifest.json`
- **Purpose**: Extension configuration and metadata
- **Key Features**:
  - Manifest V3 compliance
  - Permission declarations (activeTab, storage, scripting)
  - Content script registration for Notion domains
  - Service worker configuration
  - Keyboard shortcut definitions

#### `background.js`
- **Purpose**: Service worker for background operations
- **Key Features**:
  - OpenAI API communication
  - Settings management
  - Message passing between components
  - Keyboard shortcut handling
  - Content injection coordination

### Content Scripts

#### `content/content-script.js`
- **Purpose**: Notion page integration and UI injection
- **Key Features**:
  - Floating AI button creation
  - Content generation modal
  - Smart content insertion
  - Notion page detection
  - In-page notifications

#### `content/content-styles.css`
- **Purpose**: Styling for injected UI elements
- **Key Features**:
  - Floating button design
  - Modal interface styling
  - Dark/light theme support
  - Responsive design
  - Accessibility features

### Popup Interface

#### `popup/popup.html`
- **Purpose**: Extension popup structure
- **Key Features**:
  - Status indicators
  - Quick action buttons
  - Template shortcuts
  - Settings access

#### `popup/popup.js`
- **Purpose**: Popup functionality
- **Key Features**:
  - Status checking
  - Quick actions
  - Recent content management
  - Settings loading

#### `popup/popup.css`
- **Purpose**: Popup styling
- **Key Features**:
  - Modern UI design
  - Responsive layout
  - Status indicators
  - Button styling

### Settings Page

#### `options.html`
- **Purpose**: Comprehensive settings interface
- **Key Features**:
  - API configuration
  - Notion integration settings
  - UI customization options
  - Privacy controls
  - Import/export functionality

#### `options.js`
- **Purpose**: Settings page functionality
- **Key Features**:
  - Form handling
  - Settings validation
  - Auto-save functionality
  - Import/export logic

#### `options.css`
- **Purpose**: Settings page styling
- **Key Features**:
  - Grid-based layout
  - Form styling
  - Dark theme support
  - Responsive design

### Utilities

#### `utils/constants.js`
- **Purpose**: Shared constants and configuration
- **Key Features**:
  - API configuration
  - Content templates
  - Error messages
  - UI constants

#### `utils/helpers.js`
- **Purpose**: Utility functions
- **Key Features**:
  - DOM manipulation
  - Text processing
  - Validation functions
  - Storage utilities
  - Notion integration helpers

### Icons

#### `icons/icon-*.svg`
- **Purpose**: Extension icons in various sizes
- **Design**: AI-themed sparkle/star design with gradient colors
- **Formats**: SVG for scalability and quality

### Documentation

#### `README.md`
- **Purpose**: Main project documentation
- **Content**: Features, setup, usage, troubleshooting

#### `INSTALLATION.md`
- **Purpose**: Step-by-step installation guide
- **Content**: Installation, configuration, testing

#### `CHANGELOG.md`
- **Purpose**: Version history and release notes
- **Content**: Features, fixes, improvements by version

#### `PRIVACY.md`
- **Purpose**: Privacy policy and data handling
- **Content**: Data collection, storage, user rights

## Architecture Overview

### Data Flow

1. **User Interaction** → Popup or Content Script
2. **Settings Request** → Background Script → Chrome Storage
3. **Content Generation** → Background Script → OpenAI API
4. **Content Insertion** → Content Script → Notion Page

### Communication Patterns

- **Popup ↔ Background**: Direct message passing
- **Content Script ↔ Background**: Runtime message API
- **Options Page ↔ Storage**: Direct Chrome storage API
- **Background ↔ OpenAI**: Fetch API calls

### Security Considerations

- **API Keys**: Stored in Chrome's secure local storage
- **Content Scripts**: Limited to Notion domains only
- **Permissions**: Minimal required permissions
- **Data Privacy**: All data stored locally

## Development Guidelines

### Code Organization
- **Modular Design**: Separate concerns by functionality
- **Shared Utilities**: Common functions in utils/
- **Event-Driven**: Message passing for component communication
- **Error Handling**: Comprehensive error management

### Styling Conventions
- **CSS Custom Properties**: For theming and consistency
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation
- **Dark Theme**: System preference detection

### Testing Considerations
- **Manual Testing**: Load unpacked extension for development
- **API Testing**: Test with actual OpenAI API keys
- **Cross-Browser**: Primary focus on Chrome
- **Error Scenarios**: Network failures, API errors, permission issues

## Deployment

### Chrome Web Store Preparation
1. **Icons**: All sizes provided in SVG format
2. **Manifest**: V3 compliance verified
3. **Permissions**: Minimal and justified
4. **Privacy**: Clear data handling documentation

### Local Development
1. **Load Unpacked**: Enable developer mode
2. **Reload**: Use extension reload during development
3. **Debug**: Use Chrome DevTools for debugging
4. **Test**: Verify on actual Notion pages

---

This structure provides a comprehensive, maintainable, and scalable foundation for the AI Content Writer & Notion Paste Chrome Extension. 