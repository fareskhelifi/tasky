document.addEventListener("DOMContentLoaded", function () {
  const chatMessages = document.getElementById("chatMessages");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const resetBtn = document.getElementById("resetBtn");
  const userForm = document.getElementById("userForm");

  function addMessage(text, isUser) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.classList.add(isUser ? "user-message" : "bot-message");
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("typing-indicator");
    typingDiv.id = "typingIndicator";
    typingDiv.innerHTML = `
      <div class="typing-dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  async function processUserQuery(query) {
    hideTypingIndicator();
    addMessage(query, true);
    showTypingIndicator();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query }),
      });

      const result = await response.json();
      hideTypingIndicator();

      for (const [fieldId, value] of Object.entries(result.fields || {})) {
        const field = document.getElementById(fieldId);
        if (field) {
          field.value = value;
        }
      }

      addMessage(result.message, false);
    } catch (error) {
      hideTypingIndicator();
      addMessage("il server non è riuscito a elaborare quel messaggio.", false);
      console.error(error);
    }
  }

  sendBtn.addEventListener("click", function () {
    const query = userInput.value.trim();
    if (query) {
      processUserQuery(query);
      userInput.value = "";
    }
  });

  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendBtn.click();
    }
  });

  resetBtn.addEventListener("click", function () {
    userForm.reset();
    addMessage("The form has been reset.", false);
  });

  userForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addMessage("Form submitted successfully!", false);
  });

  setTimeout(() => {
    addMessage(
      "Prova: 'metti quantita 5', 'scrivi codice 20', oppure 'riempi prezzo 12'.",
      false,
    );
  }, 2000);
});
