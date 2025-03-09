const blocklistSources = [
  'https://blocklistproject.github.io/Lists/adult.txt',
  'https://blocklistproject.github.io/Lists/gambling.txt'
];

// Max number of dynamic rules allowed in Manifest V3 (5000+ for declarativeNetRequest)
const MAX_RULES = 5000;

async function fetchBlocklists() {
  let blockedDomains = [];

  for (let url of blocklistSources) {
    try {
      const response = await fetch(url);
      const text = await response.text();

      const domains = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));

      blockedDomains.push(...domains);
    } catch (err) {
      console.error(`Error fetching blocklist from ${url}:`, err);
    }
  }

  console.log(`Fetched ${blockedDomains.length} blocked domains`);

  // Limit to max rules allowed
  if (blockedDomains.length > MAX_RULES) {
    blockedDomains = blockedDomains.slice(0, MAX_RULES);
  }

  // Convert blocked domains to declarativeNetRequest rules
  const rules = blockedDomains.map((domain, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: "block"
    },
    condition: {
      domains: [domain.replace(/^www\./, '')],
      resourceTypes: ["main_frame"]
    }
  }));

  // Clear old dynamic rules & add new ones
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(rule => rule.id),
    addRules: rules
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error updating dynamic rules:", chrome.runtime.lastError.message);
    } else {
      console.log(`Applied ${rules.length} dynamic blocking rules`);
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  fetchBlocklists();
});

chrome.runtime.onStartup.addListener(() => {
  fetchBlocklists();
});

// Optional: Refresh blocklists every 6 hours
setInterval(fetchBlocklists, 6 * 60 * 60 * 1000);
