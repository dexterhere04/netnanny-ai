document.addEventListener('DOMContentLoaded', function () {
    const parentalLoginButton = document.getElementById('parental_login');

    if (parentalLoginButton) {
        console.log("Button found! Adding event listener...");
        parentalLoginButton.addEventListener('click', function () {
            console.log("Button clicked! Opening new tab...");
            chrome.tabs.create({ url: 'http://localhost:3000' });
        });
    } else {
        console.error("Button with ID 'parental_login' not found.");
    }
});

