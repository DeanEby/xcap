(function () {

  window.extension_settings = {};
  let effected_elements = new Set([]);

  chrome.storage.sync.get(["negativity_filtering", "ellipses_removal", "exclam_removal", "lowercasing", "blocklist", "blocked_words", "lockdown_mode"], (result) => {
    window.extension_settings = result;
    initiateObserverAndObserve();
  });

  document.addEventListener("yt-navigate-finish", function (event) {
    initiateObserverAndObserve();
  });

  var config = {
    childList: true,
    attributes: true,
    subtree: true,
    characterData: true,
  };

  function initiateObserverAndObserve() {
    const lockdown_mode = window.extension_settings.lockdown_mode;
    var observer = new MutationObserver(function (mutations) {
      setTimeout(findAndChangeTitles, 200);
      if (lockdown_mode){
        setTimeout(removeAllRecommendations, 200);
      }
    });
    observer.observe(document.body, config);
  }

  function changeTitleText(title_element) {
    const { negativity_filtering, ellipses_removal, exclam_removal, lowercasing, blocklist, blocked_words } = window.extension_settings;
    if (!title_element) {
    return;
    }
    let title_text = title_element.textContent;

    let title_text_sentiment = window.winkSentiment(title_text).score;
    if (lowercasing) {
      title_element.textContent = title_element.textContent.toLowerCase();
    }

    if (exclam_removal) {
      title_element.textContent = title_element.textContent.replace(/!/g, "");
    }

    if (ellipses_removal) {
      title_element.textContent = title_element.textContent.replace(/\.{3}/g, "");
    }

    if (negativity_filtering) {
      if (title_text_sentiment < 0) {
        title_element.textContent = "likely clickbait [declickbait]";
      }
    }
    if (blocklist) {
      const blockedList = blocked_words.split(/[\n,]/).map(w => w.trim().toLowerCase()).filter(Boolean);
      const lowerTitle = title_text.toLowerCase();

      if (blockedList.some(word => word && lowerTitle.includes(word))){
        title_element.textContent = "blocked content [declickbait]";
      }
    }
  }

  function removeAllRecommendations() {
    let selectors = [
      "#items > ytd-item-section-renderer",
      "#content > yt-lockup-view-model > div",
      "#content > ytm-shorts-lockup-view-model-v2",
      "#secondary"
    ]
    let elements = [];
    selectors.forEach(function (selector) {
      elements = elements.concat(
        Array.from(document.querySelectorAll(selector))
      );
    });

    for (let i = 0; i < elements.length; i++) {
      if (!effected_elements.has(elements[i])){
        elements[i].remove();
      }
    }
  }
  

  function findAndChangeTitles() {
    let selectors = [
      "#video-title",
      "#items > ytm-shorts-lockup-view-model-v2 > ytm-shorts-lockup-view-model > div > div > h3 > a > span",
      "#content > ytm-shorts-lockup-view-model-v2 > ytm-shorts-lockup-view-model > div > div > h3 > a > span",
      "#contents > yt-lockup-view-model > div > div > yt-lockup-metadata-view-model > div.yt-lockup-metadata-view-model__text-container > h3 > a > span",
      "#content > yt-lockup-view-model > div > div > yt-lockup-metadata-view-model > div.yt-lockup-metadata-view-model__text-container > h3 > a > span",
    ];

    let elements = [];
    selectors.forEach(function (selector) {
      elements = elements.concat(
        Array.from(document.querySelectorAll(selector))
      );
    });

    for (let i = 0; i < elements.length; i++) {
      if (!effected_elements.has(elements[i])){
        changeTitleText(elements[i]);
        effected_elements.add(elements[i]);
      }
      
    }
  }
})();
