# 🎵 Audio Files for Courtroom Intro Experience

This directory contains audio files for the immersive courtroom intro experience.

## Required Files

### 1. gavel-hit.mp3
- **Purpose:** Plays when gavel hits in Scene 1
- **Duration:** 1-2 seconds
- **Sound:** Loud, authoritative gavel hit on wooden block
- **Volume:** High (impact sound)
- **Format:** MP3, 128kbps or higher

**Where to find:**
- Freesound.org: Search "gavel hit" or "judge gavel"
- AudioJungle: Courtroom sound effects packs
- Record your own with a wooden gavel

### 2. welcome-voice.mp3
- **Purpose:** Female voice welcomes users after signup
- **Duration:** 3-4 seconds
- **Script:** "Ladies and Gentlemen, welcome to the Peenk Courtroom"
- **Voice:** Female, warm, professional yet friendly
- **Format:** MP3, 128kbps or higher

**Recording tips:**
- Use a female voice actor
- Record in quiet environment
- Speak clearly and warmly
- Add slight reverb for courtroom feel
- Alternative: Use Web Speech API fallback (already implemented)

### 3. melodious-chime.mp3
- **Purpose:** Sweet chime plays when user submits signup form
- **Duration:** 1-2 seconds
- **Sound:** Sweet, melodious, welcoming chime/bell
- **Volume:** Medium (not jarring)
- **Format:** MP3, 128kbps or higher

**Where to find:**
- Freesound.org: Search "magic chime" or "welcome bell"
- Use wind chimes or crystal bells
- Avoid harsh metallic sounds

## Fallback Behavior

If audio files are missing:
- **gavel-hit.mp3:** Silent (visual animation still plays)
- **welcome-voice.mp3:** Web Speech API speaks the welcome message
- **melodious-chime.mp3:** Silent (form submission still works)

## File Size Guidelines

- Each file should be < 500KB
- Total audio < 1.5MB
- Use 128kbps MP3 for good quality/size balance

## Testing

After adding files:
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Verify audio plays in each scene
4. Check browser console for errors

## Browser Compatibility

Audio works in:
- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (full support)
- ✅ Mobile browsers (may require user interaction first)

Note: Some browsers block autoplay until first user interaction. The intro handles this by playing audio after user clicks.
