document.addEventListener('DOMContentLoaded', function () {
    const listElement = document.getElementById('history-list');
  
    chrome.storage.local.get('history', function (result) {
        const history = result.history || [];
        if (history.length === 0) {
            listElement.innerHTML = '<li>No browsing history available.</li>';
            return;
        }
  
        history.slice(-20).reverse().forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Type:</strong> ${item.type}<br/>
                <strong>Title:</strong> ${item.title}<br/>
                <strong>URL:</strong> <a href="${item.url}" target="_blank">${item.url}</a><br/>
                <strong>Time:</strong> ${new Date(item.time).toLocaleString()}<br/><hr/>
            `;
            listElement.appendChild(li);
        });
    });
  });
  