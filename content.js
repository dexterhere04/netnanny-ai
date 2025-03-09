// Helper function to save data to local storage
function saveContent(data) {
    chrome.storage.local.get({ history: [] }, function (result) {
      let history = result.history;
      history.push(data);
      chrome.storage.local.set({ history: history });
    });
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
  
    chrome.storage.local.get({ history: [] }, function (result) {
      const history = result.history;
      history.push(historyItem);
      chrome.storage.local.set({ history: history });
      console.log('YouTube video added to history:', historyItem);
    });
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
    if (window.location.hostname.includes('youtube.com')) {
      scanYouTube();
    } else {
      scanArticles();
    }
    chrome.storage.local.get('history', console.log);

  }, 10000); // Runs every 10 seconds
  