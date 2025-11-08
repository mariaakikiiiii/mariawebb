document.addEventListener("DOMContentLoaded", () => {
  const events = [
    { name: "click", category: "Mouse", description: "Fires when the user clicks on an element.", tags: "All elements", link: "https://www.w3schools.com/jsref/event_onclick.asp" },
    { name: "mouseover", category: "Mouse", description: "Fires when the pointer is moved onto an element.", tags: "All elements", link: "https://www.w3schools.com/jsref/event_onmouseover.asp" },
    { name: "keydown", category: "Keyboard", description: "Fires when a key is pressed down.", tags: "input, textarea", link: "https://www.w3schools.com/jsref/event_onkeydown.asp" },
    { name: "keyup", category: "Keyboard", description: "Fires when a key is released.", tags: "input, textarea", link: "https://www.w3schools.com/jsref/event_onkeyup.asp" },
    { name: "submit", category: "Form", description: "Occurs when a form is submitted.", tags: "form", link: "https://www.w3schools.com/jsref/event_onsubmit.asp" },
    { name: "change", category: "Form", description: "Occurs when the value of an element has been changed.", tags: "input, select, textarea", link: "https://www.w3schools.com/jsref/event_onchange.asp" },
    { name: "focus", category: "Focus", description: "Occurs when an element gets focus.", tags: "input, select, textarea", link: "https://www.w3schools.com/jsref/event_onfocus.asp" },
    { name: "blur", category: "Focus", description: "Occurs when an element loses focus.", tags: "input, select, textarea", link: "https://www.w3schools.com/jsref/event_onblur.asp" },
    { name: "load", category: "Window", description: "Fires when the whole page has loaded.", tags: "body, img, link", link: "https://www.w3schools.com/jsref/event_onload.asp" },
    { name: "DOMContentLoaded", category: "DOM", description: "Fires when the initial HTML document is loaded and parsed.", tags: "document", link: "https://www.w3schools.com/jsref/event_domcontentloaded.asp" },
    { name: "play", category: "Media", description: "Fires when media playback has been started.", tags: "audio, video", link: "https://www.w3schools.com/jsref/event_onplay.asp" }
  ];

  const tbody = document.querySelector("#eventsTable tbody");
  const searchInput = document.querySelector("#search");
  const categorySelect = document.querySelector("#category");

  function renderEvents(filteredEvents) {
    tbody.innerHTML = "";
    filteredEvents.forEach(ev => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${ev.name}</td>
        <td>${ev.category}</td>
        <td>${ev.description}</td>
        <td>${ev.tags}</td>
        <td><a href="${ev.link}" target="_blank">W3Schools</a></td>
      `;
      tbody.appendChild(row);
    });
  }

  function filterEvents() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;
    const filtered = events.filter(ev => 
      (selectedCategory === "all" || ev.category === selectedCategory) &&
      (ev.name.toLowerCase().includes(searchTerm) || ev.description.toLowerCase().includes(searchTerm))
    );
    renderEvents(filtered);
  }

  searchInput.addEventListener("input", filterEvents);
  categorySelect.addEventListener("change", filterEvents);

  renderEvents(events); // show all at first
});
