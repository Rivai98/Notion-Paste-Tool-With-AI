# AI Content Writer & Notion Paste - Installation Guide

## Quick Installation

### Method 1: Manual Installation (Developer Mode)

1. **Download the Extension**
   - Download or clone this repository to your computer
   - Extract the files if downloaded as a ZIP

2. **Enable Developer Mode in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Toggle "Developer mode" ON in the top right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Select the extension folder (containing `manifest.json`)
   - The extension will appear in your extensions list

4. **Pin to Toolbar (Optional)**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "AI Content Writer & Notion Paste"
   - Click the pin icon to keep it visible

## Setup & Configuration

### 1. Get Your OpenAI API Key

1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account (create one if needed)
3. Click "Create new secret key"
4. Give it a name (e.g., "Chrome Extension")
5. Copy the generated API key (starts with `sk-`)

⚠️ **Important**: Keep your API key secure and never share it publicly.

### 2. Configure the Extension

1. Click the extension icon in your Chrome toolbar
2. Click "Settings" or right-click the icon → "Options"
3. Paste your OpenAI API key in the "API Key" field
4. Choose your preferred AI model:
   - **GPT-3.5 Turbo**: Faster, cheaper, good quality
   - **GPT-4**: Higher quality, slower, more expensive
5. Adjust other settings as needed
6. Click "Save Settings"

### 3. Test the Installation

1. Navigate to any Notion page
2. You should see a floating AI button appear
3. Click it to open the content generator
4. Try generating some test content

## Troubleshooting

### Extension Not Loading
- **Check folder structure**: Make sure `manifest.json` is in the root folder
- **Check Chrome version**: Requires Chrome 88+ for Manifest V3 support
- **Reload extension**: Go to `chrome://extensions/` and click the reload icon

### API Key Issues
- **Invalid key format**: Must start with `sk-` and be 51+ characters
- **Insufficient credits**: Check your OpenAI account billing
- **Rate limits**: Wait a few minutes between requests if you hit limits

### Notion Integration Issues
- **Page not detected**: Refresh the Notion page
- **Content not inserting**: Click in a text block first
- **Floating button missing**: Check if the page fully loaded

### Permission Issues
- **Extension blocked**: Check Chrome security settings
- **CORS errors**: Make sure you're on a real Notion page (not localhost)

## Features Overview

### ✨ What You Can Do

- **Generate AI Content**: Create blog posts, summaries, lists, emails
- **Direct Notion Integration**: Paste content directly into Notion pages
- **Multiple Templates**: Quick-start templates for common content types
- **Keyboard Shortcuts**: 
  - `Ctrl+Shift+A`: Open content generator
  - `Ctrl+Shift+P`: Paste last generated content
- **Customizable Settings**: Adjust AI model, creativity, button position
- **Content History**: Access recently generated content
- **Privacy-First**: All data stored locally, no external tracking

### 🎯 Best Use Cases

- **Content Creation**: Blog posts, articles, documentation
- **Note Taking**: Meeting summaries, research notes
- **Communication**: Professional emails, social posts
- **Planning**: Project outlines, task lists, brainstorming
- **Learning**: Explanations, study guides, concept breakdowns

## Usage Tips

### For Best Results:
1. **Be specific**: Instead of "write about dogs", try "write a beginner's guide to training puppies"
2. **Set context**: Include relevant background information in your prompts
3. **Use templates**: Start with built-in templates and customize as needed
4. **Iterate**: Generate multiple versions and pick the best parts
5. **Edit after**: AI content is a starting point - always review and refine

### Notion-Specific Tips:
1. **Click first**: Click in the Notion block where you want content inserted
2. **Use headers**: AI-generated content works well with Notion's header blocks
3. **Break it up**: Generate shorter sections rather than entire long documents
4. **Format after**: Use Notion's formatting tools to style the generated content

## API Costs

### Understanding OpenAI Pricing:
- **GPT-3.5 Turbo**: ~$0.002 per 1K tokens (~750 words)
- **GPT-4**: ~$0.03 per 1K tokens (~750 words)
- **Typical usage**: 10-50 cents per day for regular use

### Cost Control:
- Set max token limits in settings
- Use GPT-3.5 for simpler tasks
- Monitor usage in OpenAI dashboard
- The extension shows estimated token usage

## Security & Privacy

### Data Handling:
- ✅ API key stored locally only
- ✅ No data sent to third-party servers
- ✅ Direct communication with OpenAI
- ✅ No usage tracking or analytics
- ✅ Content history stored locally

### Permissions Explained:
- **activeTab**: To interact with current Notion page
- **storage**: To save your settings locally
- **scripting**: To insert content into pages
- **notion.so access**: To work with Notion websites only

## Support

### Need Help?
- 📖 Check the [README.md](README.md) for detailed information
- 🐛 Report bugs on [GitHub Issues](https://github.com/yourusername/ai-content-generator/issues)
- 💡 Request features via GitHub Issues
- 📧 Contact: [your-email@example.com]

### Common Solutions:
- **Refresh pages** if something isn't working
- **Check API credits** in your OpenAI account
- **Clear browser cache** if experiencing loading issues
- **Update Chrome** to the latest version

---

**Happy content creating! 🚀**

*This extension is not affiliated with OpenAI or Notion. It's an independent tool designed to enhance your productivity.* 