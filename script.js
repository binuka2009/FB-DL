document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', processVideo);
    }
});

async function processVideo() {
    const urlInput = document.getElementById('fbUrl');
    const alertBox = document.getElementById('alertBox');
    const loadingBox = document.getElementById('loadingBox');
    const previewCard = document.getElementById('previewCard');
    const qualityButtons = document.getElementById('qualityButtons');

    if (!urlInput || !alertBox || !loadingBox || !previewCard || !qualityButtons) return;

    const urlValue = urlInput.value.trim();
    alertBox.style.display = 'none';
    previewCard.style.display = 'none';

    const fbRegex = /(facebook\.com|fb\.watch|fb\.me)/i;
    if (!urlValue || !fbRegex.test(urlValue)) {
        alertBox.innerText = "Invalid Facebook Link! කරුණාකර නිවැරදි Facebook වීඩියෝ Link එකක් ඇතුළත් කරන්න.";
        alertBox.style.display = 'block';
        return;
    }

    loadingBox.style.display = 'block';

    try {
        // මෙතනට ඔබ Render.com වල deploy කරන Backend එකේ Live URL එක දමන්න
        // උදාහරණයක් ලෙස: https://my-fb-backend.onrender.com/api/get-video-info
        const API_URL = 'https://curly-broccoli-976prwwvwqw9cxqx5-5000.app.github.dev/';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlValue })
        });

        const result = await response.json();
        loadingBox.style.display = 'none';

        if (result.success) {
            const data = result.data;
            document.getElementById('videoTitle').innerText = data.title;
            document.getElementById('thumbImg').src = data.thumbnail;

            qualityButtons.innerHTML = '';
            data.formats.forEach(f => {
                if (f.url) {
                    const a = document.createElement('a');
                    a.href = f.url;
                    a.target = '_blank';
                    a.download = true;
                    
                    const isMp3 = f.quality.includes('MP3');
                    a.className = isMp3 ? 'download-btn mp3' : 'download-btn';
                    a.innerHTML = isMp3 
                        ? `<i class="fa-solid fa-music"></i> Download ${f.quality}`
                        : `<i class="fa-solid fa-file-video"></i> Download ${f.quality}`;
                    
                    qualityButtons.appendChild(a);
                }
            });

            previewCard.style.display = 'block';
        } else {
            alertBox.innerText = result.error || "වීඩියෝ දත්ත ලබා ගැනීමට නොහැකි විය.";
            alertBox.style.display = 'block';
        }

    } catch (err) {
        loadingBox.style.display = 'none';
        alertBox.innerText = "Server එක සමඟ සම්බන්ධ විය නොහැකි විය!";
        alertBox.style.display = 'block';
    }
}