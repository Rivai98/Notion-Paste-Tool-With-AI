# AI Content Writer & Notion Paste Chrome Extension

## Overview

This Chrome extension enables users to generate content using AI (OpenAI GPT) and seamlessly paste it into Notion pages. The extension provides a streamlined workflow for content creation with AI assistance, specifically designed to work with Notion's interface.

## Features

### 🤖 AI Content Generation
- **OpenAI Integration**: Uses your personal OpenAI API key for content generation
- **Multiple AI Models**: Support for GPT-3.5-turbo and GPT-4
- **Custom Prompts**: Create and save custom prompts for different content types
- **Content Templates**: Pre-built templates for common content types (blog posts, summaries, etc.)
- **Real-time Generation**: Generate content with live preview

### 📝 Notion Integration
- **Auto-detect Notion Pages**: Automatically detects when you're on a Notion page
- **Smart Content Insertion**: Intelligently places generated content in the right location
- **Formatting Preservation**: Maintains text formatting when pasting to Notion
- **Block-type Support**: Works with various Notion block types (text, headers, lists, etc.)

### ⚙️ User Interface
- **Floating Action Button**: Non-intrusive floating button on Notion pages
- **Popup Interface**: Clean, intuitive popup for content generation
- **Settings Page**: Comprehensive settings for API keys and preferences
- **Dark/Light Mode**: Automatic theme detection and manual toggle

### 🔐 Privacy & Security
- **Local Storage**: All API keys and settings stored locally
- **No Data Collection**: Extension doesn't collect or transmit personal data
- **Secure API Calls**: Direct communication with OpenAI API
- **Permission Management**: Minimal required permissions

## Installation

### From Chrome Web Store (Recommended)
1. Visit the Chrome Web Store
2. Search for "AI Content Writer & Notion Paste"
3. Click "Add to Chrome"
4. Follow the installation prompts

### Manual Installation (Development)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension will appear in your browser toolbar

## Setup

### 1. Get Your OpenAI API Key
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Log in to your OpenAI account
3. Click "Create new secret key"
4. Copy the generated API key

### 2. Configure the Extension
1. Click the extension icon in your browser toolbar
2. Click "Settings" or go to the options page
3. Paste your OpenAI API key
4. Select your preferred AI model (GPT-3.5-turbo or GPT-4)
5. Configure other preferences as needed

### 3. Set Up Notion Integration (Optional)
1. If using Notion API features, get your Notion integration token
2. Visit [Notion Integrations](https://www.notion.com/integrations)
3. Create a new integration and copy the token
4. Add the token to the extension settings

## Usage

### Basic Content Generation
1. Navigate to any Notion page
2. Click the floating AI button that appears on the page
3. Enter your content prompt in the popup
4. Choose a template or write a custom prompt
5. Click "Generate" and wait for the AI response
6. Review the generated content
7. Click "Paste to Notion" to insert the content

### Advanced Features

#### Custom Prompts
1. Go to extension settings
2. Navigate to "Custom Prompts" section
3. Add new prompts with:
   - Name/Title
   - Prompt template
   - Target content type
   - Default parameters

#### Content Templates
- **Blog Post**: Generate structured blog posts with introduction, body, and conclusion
- **Summary**: Create concise summaries of topics or existing content
- **List**: Generate organized lists (bullet points, numbered lists, etc.)
- **Email**: Draft professional emails with proper formatting
- **Social Media**: Create posts optimized for different social platforms

#### Keyboard Shortcuts
- `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (Mac): Open AI content generator
- `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac): Paste last generated content

## Configuration Options

### AI Settings
- **API Key**: Your OpenAI API key
- **Model**: Choose between GPT-3.5-turbo, GPT-4, etc.
- **Max Tokens**: Set maximum response length
- **Temperature**: Control creativity level (0-1)
- **Top P**: Control randomness in responses

### Notion Settings
- **Integration Token**: Notion API token (if using API features)
- **Auto-paste**: Automatically paste generated content
- **Paste Location**: Choose where to insert content (cursor position, end of page, etc.)
- **Format Preservation**: Maintain text formatting when pasting

### Interface Settings
- **Theme**: Light/Dark/Auto
- **Button Position**: Customize floating button location
- **Popup Size**: Adjust popup dimensions
- **Keyboard Shortcuts**: Customize keyboard shortcuts

## Permissions Explained

This extension requires the following permissions:

- **activeTab**: To interact with the current Notion page
- **storage**: To save your settings and API keys locally
- **scripting**: To inject content into Notion pages
- **https://\*.notion.so/\***: To work specifically with Notion websites

## Privacy Policy

### Data Collection
- **No Data Collection**: This extension does not collect, store, or transmit any personal data
- **Local Storage Only**: All settings and API keys are stored locally on your device
- **No Analytics**: No usage analytics or tracking

### API Communication
- **Direct OpenAI API**: Communications go directly to OpenAI's servers
- **Your API Key**: You use your own OpenAI API key and are billed directly by OpenAI
- **No Intermediary**: No data passes through our servers

### Notion Integration
- **Read-Only by Default**: Extension only reads page content when explicitly triggered
- **Write Only on Command**: Only writes content when you explicitly request it
- **No Background Access**: No background access to your Notion data

## Troubleshooting

### Common Issues

#### Extension Not Working
1. Refresh the Notion page
2. Check if the extension is enabled in `chrome://extensions/`
3. Verify you're on a Notion page (notion.so domain)

#### API Key Issues
1. Verify your OpenAI API key is correct
2. Check if you have sufficient API credits
3. Ensure the API key has the right permissions

#### Content Not Pasting
1. Make sure you're clicking in a text area in Notion
2. Try refreshing the page and generating content again
3. Check if Notion's interface has changed (we'll update accordingly)

### Error Messages

#### "Invalid API Key"
- Double-check your OpenAI API key in settings
- Ensure the key hasn't expired
- Verify you have API access enabled in your OpenAI account

#### "Rate Limit Exceeded"
- You've hit OpenAI's rate limits
- Wait a few minutes and try again
- Consider upgrading your OpenAI plan

#### "Failed to Insert Content"
- Notion page may not be fully loaded
- Try clicking in a text block first
- Refresh the page and try again

## Development

### Tech Stack
- **Manifest V3**: Latest Chrome extension framework
- **Vanilla JavaScript**: No external dependencies for core functionality
- **OpenAI API**: For AI content generation
- **Notion API**: For advanced Notion integration (optional)

### Project Structure
```
ai-content-notion-extension/
├── manifest.json              # Extension manifest
├── background.js             # Service worker
├── content/
│   ├── content-script.js     # Content script for Notion pages
│   └── content-styles.css    # Styles for injected UI
├── popup/
│   ├── popup.html           # Extension popup interface
│   ├── popup.js             # Popup functionality
│   └── popup.css            # Popup styles
├── options/
│   ├── options.html         # Settings page
│   ├── options.js           # Settings functionality
│   └── options.css          # Settings styles
├── assets/
│   ├── icons/              # Extension icons
│   └── images/             # UI images
├── utils/
│   ├── api.js              # API communication utilities
│   ├── storage.js          # Local storage management
│   └── helpers.js          # General helper functions
└── README.md               # This file
```

### Building from Source
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-content-notion-extension
   ```

2. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project directory

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## API Usage & Costs

### OpenAI API Costs
- You pay OpenAI directly for API usage
- Costs depend on the model and token usage
- GPT-3.5-turbo: ~$0.002 per 1K tokens
- GPT-4: ~$0.03 per 1K tokens

### Token Management
- The extension shows estimated token usage
- You can set maximum token limits
- Monitor your usage in the OpenAI dashboard

## Version History

### v1.0.0 (Initial Release)
- Basic AI content generation
- Notion page integration
- Simple popup interface
- OpenAI API integration

### v1.1.0 (Planned)
- Custom prompt templates
- Advanced formatting options
- Keyboard shortcuts
- Improved error handling

### v1.2.0 (Planned)
- Notion API integration
- Batch content generation
- Content history
- Team collaboration features

## Support

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this README for detailed information
- **Community**: Join our Discord server for community support

### Reporting Issues
When reporting issues, please include:
- Chrome version
- Extension version
- Steps to reproduce
- Error messages (if any)
- Screenshots (if helpful)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the GPT API
- Notion for their excellent platform and API
- Chrome Extensions team for the development framework
- Contributors and beta testers

## Disclaimer

This extension is not officially affiliated with Notion or OpenAI. It's an independent project designed to enhance productivity when using these services together. 