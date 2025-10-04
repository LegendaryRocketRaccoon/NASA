
document.addEventListener("DOMContentLoaded", () => {
  const chatContainer = document.getElementById("chat-container");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const status = document.getElementById("status");
  const voiceBtn = document.getElementById("voice-toggle-btn");

  let voiceEnabled = true;
  const synth = window.speechSynthesis;

  const speak = (text) => {
    if (voiceEnabled && synth) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.volume = 1;
      const voices = synth.getVoices();
      utterance.voice = voices.find(voice => voice.lang === 'pt-BR') || null;
      synth.speak(utterance);
    }
  };

  const addMessage = (text, sender) => {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerHTML = text;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  const showTyping = () => {
    const typing = document.createElement("div");
    typing.classList.add("message", "bot", "typing");
    typing.textContent = "Digitando...";
    chatContainer.appendChild(typing);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return typing;
  };

  const respostasUrbanas = {
    saudacoes: [
      "Olá. Como posso ajudar no planejamento da sua cidade.",
      "Bem-vindo ao assistente urbano Deimos. Pergunte sobre clima, meio ambiente ou estratégias urbanas."
    ],
    clima: [
      "Você pode acessar dados de clima e qualidade do ar em breve nesta plataforma.",
      "Em breve, trarei dados reais da NASA sobre clima e meio ambiente para sua cidade."
    ],
    estrategias: [
      "Para reduzir ilhas de calor, plante árvores e aumente áreas verdes.",
      "Cidades inteligentes usam dados para planejar mobilidade, energia e sustentabilidade."
    ],
    padrao: [
      "Desculpe, não entendi. Pergunte sobre clima, meio ambiente ou planejamento urbano."
    ]
  };

  const gerarResposta = (input) => {
    const texto = input.toLowerCase();
    if (/ol[áa]|oi|bom dia|boa tarde|boa noite/.test(texto)) {
      return escolher(respostasUrbanas.saudacoes);
    } else if (/clima|tempo|chuva|temperatura|ar/.test(texto)) {
      return escolher(respostasUrbanas.clima);
    } else if (/ilha de calor|área verde|sustentabilidade|estratégia|planejamento/.test(texto)) {
      return escolher(respostasUrbanas.estrategias);
    } else {
      return escolher(respostasUrbanas.padrao);
    }
  };

  const escolher = (lista) => lista[Math.floor(Math.random() * lista.length)];

  sendBtn.addEventListener("click", () => {
    const input = userInput.value.trim();
    if (input) {
      addMessage(input, "user");
      userInput.value = "";
      const typingEl = showTyping();
      setTimeout(() => {
        typingEl.remove();
        const resposta = gerarResposta(input);
        addMessage(resposta, "bot");
        speak(resposta);
      }, 800);
    }
  });

  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });

  voiceBtn.addEventListener("click", () => {
    voiceEnabled = !voiceEnabled;
    status.textContent = voiceEnabled ? "Voz ativada. Pronto para conversar!" : "Voz desativada.";
    voiceBtn.textContent = voiceEnabled ? "Silenciar" : "Ativar Voz";
  });

  // Mensagem inicial
  addMessage("Olá. Sou Deimos, seu assistente urbano. Pergunte sobre clima, meio ambiente ou planejamento de cidades.", "bot");
});
