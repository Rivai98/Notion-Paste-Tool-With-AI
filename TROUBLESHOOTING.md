# Troubleshooting Guide

## Extension Loading Issues

### "Failed to load extension" Error

If you're getting a "Failed to load extension" error when trying to load the extension in Chrome, follow these steps:

#### 1. Check File Structure
Make sure your folder structure matches exactly:

```
ai-content-notion-extension/
├── manifest.json              ✅ Must be in root folder
├── background.js             ✅ Must be in root folder
├── options.html              ✅ Must be in root folder
├── options.css               ✅ Must be in root folder
├── options.js                ✅ Must be in root folder
├── content/
│   ├── content-script.js     ✅ Must be in content/ folder
│   └── content-styles.css    ✅ Must be in content/ folder
├── popup/
│   ├── popup.html           ✅ Must be in popup/ folder
│   ├── popup.js             ✅ Must be in popup/ folder
│   └── popup.css            ✅ Must be in popup/ folder
├── icons/
│   ├── icon-16.svg          ✅ Must be in icons/ folder
│   ├── icon-32.svg          ✅ Must be in icons/ folder
│   ├── icon-48.svg          ✅ Must be in icons/ folder
│   └── icon-128.svg         ✅ Must be in icons/ folder
└── utils/
    ├── constants.js         ✅ Must be in utils/ folder
    └── helpers.js           ✅ Must be in utils/ folder
```

#### 2. Verify manifest.json
Open `manifest.json` and check that:
- ✅ File paths match your actual file structure
- ✅ No syntax errors (missing commas, brackets, etc.)
- ✅ All referenced files exist

#### 3. Loading Steps
1. **Open Chrome Extensions Page**
   - Go to `chrome://extensions/`
   - Or Chrome menu → More tools → Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" ON (top right)

3. **Load Extension**
   - Click "Load unpacked"
   - Select the **ROOT FOLDER** containing `manifest.json`
   - NOT any subfolder!

4. **Check for Errors**
   - If errors appear, click "Errors" to see details
   - Common issues and fixes below

### Common Error Fixes

#### "Could not load options page 'options/options.html'"
**Problem**: manifest.json points to wrong path
**Fix**: Make sure `options.html` is in the root folder and manifest.json has:
```json
"options_page": "options.html"
```

#### "Could not load manifest"
**Problem**: Syntax error in manifest.json
**Fix**: Check for:
- Missing commas between sections
- Unmatched brackets `{` `}`
- Invalid JSON syntax
- Use an online JSON validator

#### "Service worker registration failed"
**Problem**: background.js file missing or has errors
**Fix**: 
- Ensure `background.js` exists in root folder
- Check console for JavaScript errors
- Verify file permissions

#### "Failed to load content script"
**Problem**: Content script files missing
**Fix**: Ensure these files exist:
- `content/content-script.js`
- `content/content-styles.css`

### Quick Diagnostic Checklist

Run through this checklist if extension won't load:

- [ ] `manifest.json` exists in the root folder
- [ ] All folders exist: `content/`, `popup/`, `icons/`, `utils/`
- [ ] All files referenced in manifest.json exist
- [ ] No syntax errors in manifest.json (validate with JSON linter)
- [ ] Chrome Developer mode is enabled
- [ ] Loading the correct root folder (not a subfolder)
- [ ] Chrome version is 88+ (for Manifest V3 support)

### Still Having Issues?

1. **Clear Chrome Cache**
   - Settings → Privacy and security → Clear browsing data
   - Select "All time" and clear everything

2. **Restart Chrome**
   - Close all Chrome windows
   - Restart Chrome completely

3. **Try Incognito Mode**
   - Load extension in incognito window
   - Helps isolate extension conflicts

4. **Check Chrome Version**
   - Chrome menu → Help → About Google Chrome
   - Ensure version 88 or higher

5. **Validate Files**
   - Run JSON validator on manifest.json
   - Check for hidden characters or encoding issues

### Manual File Check

If still having issues, manually verify these key files exist:

```bash
# These files MUST exist at these exact paths:
./manifest.json
./background.js
./options.html
./popup/popup.html
./content/content-script.js
./icons/icon-16.svg
```

### Getting Help

If none of these solutions work:

1. Take a screenshot of the exact error message
2. List your Chrome version
3. Describe your folder structure
4. Check the [Issues](https://github.com/yourusername/ai-content-generator/issues) page
5. Create a new issue with detailed information

### Development Tips

- Use Chrome DevTools to debug JavaScript errors
- Check the Extensions page for detailed error messages
- Test in a fresh Chrome profile to avoid conflicts
- Keep browser console open while loading extension 