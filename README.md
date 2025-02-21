# Video Banner Proof of Concept

A lightweight and performant solution for displaying video backgrounds in web banners, particularly useful for advertising banners and hero sections.

## How It Works

This implementation uses HTML5 Canvas to display video content instead of traditional video elements. Here's why:

- Better performance across browsers
- No HTML5 video player controls
- Works well in iframes
- Mobile-friendly
- No SEO impact (perfect for ad banners)

## Project Structure

```
video-in-banner/
├── banner/
│   ├── assets/          # Your video files go here
│   ├── js/
│   │   └── videoscript.js
│   └── index.html
```

## Quick Start

1. Place your video file in the `banner/assets/` folder
2. Update the video path in `index.html`:
   ```javascript
   initVideoCanvas(canvas, 'assets/your-video.mp4');
   ```

## Configuration Options

The video banner supports responsive video sources and configuration options:

```javascript
// Simple usage with single video
initVideoCanvas(canvas, 'assets/video.mp4');

// Responsive videos for different breakpoints
initVideoCanvas(canvas, {
    1920: 'assets/video-large.mp4',
    1280: 'assets/video-medium.mp4',
    768: 'assets/video-small.mp4',
    default: 'assets/video-mobile.mp4'
});
```

Available configuration options:
- Use breakpoints to serve different video files based on viewport width
- Videos automatically switch when viewport size changes
- Maintains aspect ratio while covering canvas
- Handles mobile autoplay restrictions automatically

## Important Notes

- The banner needs to be served from a web server (not directly from filesystem)
- Use compressed video files for better performance
- Video is automatically muted and loops continuously
- Works on mobile devices (handles autoplay restrictions)

## Testing Locally

You can use any of these methods to test:
- VS Code's "Live Server" extension
- Python's built-in server: `python -m http.server`
- Node's http-server: `npx http-server`

## Browser Support

Works in all modern browsers that support HTML5 Canvas:
- Chrome 4+
- Firefox 3.6+
- Safari 4+
- Edge (all versions)
- Mobile browsers (iOS 3.2+, Android 3+)

## Performance Considerations

- Video file size should be kept under 2MB for optimal loading
- Recommended video dimensions: 1280x720 or 1920x1080
- Target video duration: 10-30 seconds
- Use video compression tools like HandBrake or FFmpeg

## Video Format Recommendations

Recommended video formats and settings:
- Format: MP4 (H.264 codec)
- Audio: AAC or no audio
- Framerate: 24-30 fps
- Bitrate: 1000-2000 kbps
- Resolution: Adapt to banner size

## Releases

To create a new release:
1. Create and push a new tag: `git tag v1.0.0 && git push --tags`
2. GitHub Actions will automatically:
   - Create a new release
   - Generate ZIP files for `/banner` and `/preview-webpage`
   - Attach the ZIP files to the release

Downloads are available on the [Releases page](../../releases).
