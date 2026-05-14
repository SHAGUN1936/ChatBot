(function () {
  // Prevent duplicate widget
  if (window.AI_WIDGET_LOADED) return;
  window.AI_WIDGET_LOADED = true;

  // Create floating button
  const button = document.createElement("div");

  button.innerHTML = "💬";

  Object.assign(button.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: "999999",
    fontSize: "28px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  });

  document.body.appendChild(button);

  // Create iframe
  const iframe = document.createElement("iframe");

  iframe.src = "http://localhost:5173";

  Object.assign(iframe.style, {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "380px",
    height: "600px",
    border: "none",
    borderRadius: "20px",
    overflow: "hidden",
    zIndex: "999999",
    display: "none",
    boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
  });

  document.body.appendChild(iframe);

  // Toggle iframe
  let isOpen = false;

  button.onclick = () => {
    isOpen = !isOpen;

    iframe.style.display = isOpen
      ? "block"
      : "none";
  };

  window.addEventListener("message", (event) => {
  if (
    event.data.type === "CLOSE_CHATBOT"
  ) {
    isOpen = false;
    iframe.style.display = "none";
  }
});
})();