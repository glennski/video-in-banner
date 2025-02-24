/**
 * Initializes a canvas-based video player
 * @param {HTMLCanvasElement} canvas - The canvas element to draw video on
 * @param {string|Object} videoConfig - Either a video URL string or breakpoint configuration object
 * @param {string} placeholderImage - URL of the placeholder image
 */
function initVideoCanvas(canvas, videoConfig, placeholderImage) {
    const ctx = canvas.getContext('2d');
    let currentVideo = null;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    function getVideoSourceForViewport() {
        const width = window.innerWidth;
        if (typeof videoConfig === 'string') {
            return videoConfig; // Legacy support for single video URL
        }

        // Sort breakpoints in descending order
        const breakpoints = Object.keys(videoConfig)
            .map(Number)
            .sort((a, b) => b - a);

        // Find the first breakpoint that matches current viewport
        for (const breakpoint of breakpoints) {
            if (width >= breakpoint) {
                return videoConfig[breakpoint];
            }
        }

        // Return default (mobile) video if no breakpoint matches
        return videoConfig.default;
    }

    function drawPlaceholder() {
        if (!placeholderImage) return;
        
        const img = new Image();
        img.onload = () => {
            // Calculate dimensions to maintain aspect ratio
            const imgRatio = img.width / img.height;
            const canvasRatio = canvas.width / canvas.height;
            let drawWidth = canvas.width;
            let drawHeight = canvas.height;
            let offsetX = 0;
            let offsetY = 0;

            if (imgRatio > canvasRatio) {
                drawWidth = canvas.height * imgRatio;
                offsetX = -(drawWidth - canvas.width) / 2;
            } else {
                drawHeight = canvas.width / imgRatio;
                offsetY = -(drawHeight - canvas.height) / 2;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };
        img.src = placeholderImage;
    }

    function loadVideo() {
        const videoSource = getVideoSourceForViewport();
        
        // If we already have a video with this source, don't reload
        if (currentVideo && currentVideo.src.endsWith(videoSource)) return;

        // Draw placeholder immediately
        drawPlaceholder();

        const tempVideo = document.createElement('video');
        tempVideo.muted = true;
        tempVideo.loop = true;
        tempVideo.playsinline = true;
        tempVideo.setAttribute('webkit-playsinline', 'true'); // iOS Safari support
        tempVideo.setAttribute('playsinline', 'true');        // iOS Safari support
        tempVideo.src = videoSource;
        tempVideo.load(); // Explicitly load for iOS

        // Stop previous video if exists
        if (currentVideo) {
            currentVideo.pause();
        }
        
        currentVideo = tempVideo;

        const playVideo = async () => {
            try {
                await tempVideo.play();
            } catch (err) {
                console.log('Playback failed, waiting for user interaction');
            }
        };

        tempVideo.addEventListener('loadedmetadata', () => {
            resizeCanvas();
            playVideo();
            
            // Only start drawing video frames once the video is actually playing
            tempVideo.addEventListener('playing', function() {
                function drawFrame() {
                    if (!tempVideo.paused && !tempVideo.ended) {
                        // Calculate dimensions to maintain aspect ratio
                        const videoRatio = tempVideo.videoWidth / tempVideo.videoHeight;
                        const canvasRatio = canvas.width / canvas.height;
                        let drawWidth = canvas.width;
                        let drawHeight = canvas.height;
                        let offsetX = 0;
                        let offsetY = 0;

                        if (videoRatio > canvasRatio) {
                            drawWidth = canvas.height * videoRatio;
                            offsetX = -(drawWidth - canvas.width) / 2;
                        } else {
                            drawHeight = canvas.width / videoRatio;
                            offsetY = -(drawHeight - canvas.height) / 2;
                        }

                        ctx.drawImage(tempVideo, offsetX, offsetY, drawWidth, drawHeight);
                    }
                    requestAnimationFrame(drawFrame);
                }
                drawFrame();
            }, { once: true });
        });

        // Handle iOS autoplay
        const startPlayback = () => {
            playVideo();
            document.removeEventListener('touchstart', startPlayback);
            document.removeEventListener('click', startPlayback);
        };

        document.addEventListener('touchstart', startPlayback);
        document.addEventListener('click', startPlayback);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        loadVideo(); // Check if we need to switch video source
    });
    
    resizeCanvas();
    loadVideo();
}
