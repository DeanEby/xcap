const saveOptions = () => {
  const negativity_filtering = document.getElementById(
    "negativity_filtering"
  ).checked;
  const ellipses_removal = document.getElementById("ellipses_removal").checked;
  const exclam_removal = document.getElementById("exclam_removal").checked;
  const lowercasing = document.getElementById("lowercasing").checked;
  const blocked_words = document.getElementById("blocked_words").value;
  const blocklist = document.getElementById("blocklist").checked;
  const lockdown_mode = document.getElementById("lockdown_mode").checked;

  chrome.storage.sync.set(
    {
      negativity_filtering: negativity_filtering,
      ellipses_removal: ellipses_removal,
      exclam_removal: exclam_removal,
      lowercasing: lowercasing,
      blocked_words: blocked_words,
      blocklist: blocklist,
      lockdown_mode: lockdown_mode
    },
    () => {
      const status = document.getElementById("status");
      status.textContent =
        "Options saved. Refresh your youtube page for options to take effect.";
      setTimeout(() => {
        status.textContent = "";
      }, 750);
    }
  );
};

const restoreOptions = () => {
  chrome.storage.sync.get(
    {
      negativity_filtering: true,
      ellipses_removal: false,
      exclam_removal: false,
      lowercasing: true,
      blocked_words: "",
      blocklist: false,
      lockdown_mode: false
    },
    (items) => {
      document.getElementById("negativity_filtering").checked =
        items.negativity_filtering;
      document.getElementById("ellipses_removal").checked =
        items.ellipses_removal;
      document.getElementById("exclam_removal").checked = items.exclam_removal;
      document.getElementById("lowercasing").checked = items.lowercasing;
      document.getElementById("blocked_words").value = items.blocked_words;
      document.getElementById("blocklist").checked = items.blocklist;
      document.getElementById("lockdown_mode").checked = items.lockdown_mode;
    }
  );
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
