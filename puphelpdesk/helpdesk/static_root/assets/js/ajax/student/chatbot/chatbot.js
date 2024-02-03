const typebotInitScript = document.createElement("script");
typebotInitScript.type = "module";
typebotInitScript.innerHTML = `import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.2/dist/web.js'

Typebot.initBubble({
  typebot: "pupqc-help-desk-skl970s",
  previewMessage: {
    message: "Hey! Do you need help?",
    autoShowDelay: 3000,
    avatarUrl:
      "https://s3.typebot.io/public/workspaces/clgna7vhp0005l60fgi1nyu4e/typebots/clrwz5p7300253ih9lskl970s/hostAvatar?v=1706718644324",
  },
  theme: { button: { backgroundColor: "#800000" } },
});
`;
document.body.append(typebotInitScript);