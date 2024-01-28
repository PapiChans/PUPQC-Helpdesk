const typebotScript = document.createElement("script");
typebotScript.type = "module";
typebotScript.innerHTML = `
  import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.2/dist/web.js'

  Typebot.initBubble({
    typebot: "pupqc-help-desk-skl970s",
    theme: {
      button: { backgroundColor: "#0042DA" },
      chatWindow: { backgroundColor: "#fff" },
    },
  });
`;

// Append the script to the document
document.body.appendChild(typebotScript);

// Function to remove the script
function removeTypebotScript() {
  const scriptElement = document.querySelector('script[type="module"][src^="https://cdn.jsdelivr.net/npm/@typebot.io/js"]');
  if (scriptElement) {
    scriptElement.remove();
  }
}

// Call the function to remove the script after a certain condition or event
// For example, remove after 5 seconds
setTimeout(removeTypebotScript, 5000);