chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url && changeInfo.url.includes('https://www.google.com/maps')) {
    console.log('Google Maps has been opened');
    
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        const div = document.createElement("div")
        div.innerHTML = "This is my div"
        document.body.appendChild(div)
      }
    })
  }
});