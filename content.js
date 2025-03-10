// Helper function to save data to local storage
function saveContent(data) {
  try {
    chrome.storage.local.get({ history: [] }, function (result) {
      if (chrome.runtime.lastError) {
        console.error('Storage Get Error:', chrome.runtime.lastError.message);
        return;
      }

      let history = result.history || [];
      history.push(data);

      chrome.storage.local.set({ history: history }, () => {
        if (chrome.runtime.lastError) {
          console.error('Storage Set Error:', chrome.runtime.lastError.message);
        } else {
          console.log('Content saved:', data);
        }
      });
    });
  } catch (error) {
    console.error('saveContent error:', error);
  }
}

// YouTube Monitoring
function scanYouTube() {
  console.log('Running scanYouTube...');

  const titleElement = document.querySelector('h1.ytd-watch-metadata');
  if (!titleElement) {
    console.log('YouTube video title not found');
    return;
  }

  const videoTitle = titleElement.textContent.trim();
  const url = window.location.href;

  const historyItem = {
    type: 'YouTube',
    title: videoTitle,
    url: url,
    time: Date.now()
  };

  saveContent(historyItem);
}

// Generic Article Monitoring
function scanArticles() {
  const articleTitle = document.title;
  const articleText = document.body.innerText.substring(0, 500); // first 500 chars

  const contentData = {
    type: "Article",
    title: articleTitle,
    url: window.location.href,
    snippet: articleText,
    time: new Date().toISOString()
  };

  saveContent(contentData);
}

setInterval(() => {
  try {
    if (window.location.hostname.includes('youtube.com')) {
      scanYouTube();
    } else {
      scanArticles();
    }

    chrome.storage.local.get('history', (result) => {
      if (chrome.runtime.lastError) {
        console.error('Storage Get Error:', chrome.runtime.lastError.message);
      } else {
        console.log('History:', result.history);
      }
    });

  } catch (error) {
    console.error('Interval error:', error);
  }

}, 10000); // Runs every 10 seconds
