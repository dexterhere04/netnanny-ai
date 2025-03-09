// Blocklist URLs
const blocklistSources = [
    'https://blocklistproject.github.io/Lists/adult.txt',
    'https://blocklistproject.github.io/Lists/gambling.txt'
  ];
  
  let blockedDomains = [];
  
  // Fetch blocklists from external sources
  async function fetchBlocklists() {
    blockedDomains = []; // Reset before fetching
    for (let url of blocklistSources) {
      try {
        const response = await fetch(url);
        const text = await response.text();
  
        const domains = text
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#')); // Ignore comments and empty lines
  
        blockedDomains.push(...domains);
      } catch (err) {
        console.error(`Error fetching blocklist from ${url}:`, err);
      }
    }
  
    // Save in chrome.storage (optional, useful for popup/dashboard)
    chrome.storage.local.set({ blockedDomains });
  
    console.log(`Blocklists loaded. Total blocked domains: ${blockedDomains.length}`);
  }
  
  // Call fetchBlocklists on install/update and periodically
  chrome.runtime.onInstalled.addListener(() => {
    fetchBlocklists();
  });
  chrome.runtime.onStartup.addListener(() => {
    fetchBlocklists();
  });
  
  // OPTIONAL: Refresh blocklists every X hours (6 hours here)
  setInterval(fetchBlocklists, 6 * 60 * 60 * 1000);
  
  // Block requests to blacklisted domains
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      const url = new URL(details.url);
      const domain = url.hostname.replace(/^www\./, '').toLowerCase();
  
      if (blockedDomains.includes(domain)) {
        console.log(`Blocked: ${domain}`);
        return { cancel: true };
      }
  
      return { cancel: false };
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
  