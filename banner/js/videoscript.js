function initVideoCanvas(canvas, videoUrl) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    function loadVideo() {
        const tempVideo = document.createElement('video');
        tempVideo.muted = true;
        tempVideo.loop = true;
        tempVideo.playsinline = true;
        tempVideo.src = videoUrl;

        tempVideo.addEventListener('loadedmetadata', () => {
            resizeCanvas();
            tempVideo.play();
            
            function drawFrame() {
                if (!tempVideo.paused && !tempVideo.ended) {
                    ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
                }
                requestAnimationFrame(drawFrame);
            }
            drawFrame();
        });

        // Handle mobile autoplay
        document.addEventListener('click', () => {
            tempVideo.play();
        });
    }

    window.addEventListener('resize', resizeCanvas);
    loadVideo();
}
