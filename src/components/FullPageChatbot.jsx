import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./fullPageChatbot.css";
import { useLanguage } from "./languageContext";

// URL de l'API backend
// En prod (Vercel), laissez REACT_APP_API_URL vide pour utiliser les rewrites
const API_BASE_URL = process.env.REACT_APP_API_URL || "";
const apiUrl = (path) => (API_BASE_URL ? `${API_BASE_URL}${path}` : path);

// Questions/réponses prédéfinies (fallback si pas d'API OpenAI)
const predefinedQA = [
  {
    question: "hello, hi",
    answer: " Hello! How can I assist you?",
  },
  {
    question: "Who is he? the creator of this portfolio, Victor Wambersie",
    answer: " The creator is Victor Wambersie, a Backend & AI Developer specialized in LLM integration, RAG architectures, fine-tuning, and agentic systems.",
  },
  {
    question: "What does he do? Can you tell me about his projects? what has he done?",
    answer: " He has developed intelligent AI systems including a legal AI with RAG architecture for Fairval, building LLM-powered applications, and working on agentic AI systems.",
    hasButton: true,
  },
  {
    question: "What programming languages does he use? what technologies does he use?",
    answer: " He specializes in Python, FastAPI, Streamlit, PyTorch, Ollama, OpenAI API, FAISS, RAG architectures, fine-tuning, and prompt engineering.",
  },
  {
    question: "Where is he located? where does he live? where does he work?",
    answer: " He is located in the region of Antibes, Cannes, Nice (France).",
  },
  {
    question: "Is he looking for an internship, an alternance, or a job?",
    answer: " Yes, he's looking for an alternance or position in Backend development, AI engineering, or LLM systems development.",
  },
  {
    question: "How can I contact him, how to reach him, his email address?",
    answer: " You can contact him via his email address: victor.wambersie@gmail.com",
  },
  {
    question: "Does he have a GitHub?",
    answer: " Yes, here is his GitHub: https://github.com/bubom6755",
  },
  {
    question: "What are his skills? Can you tell me about his competencies?",
    answer: " His expertise includes Python, FastAPI, PyTorch, LLM integration (OpenAI, Ollama), RAG architectures, fine-tuning, FAISS vector databases, agentic systems, and prompt engineering.",
  },
  {
    question: "What are his passions and hobbies?",
    answer: " He is passionate about artificial intelligence, machine learning, LLM systems, and RAG architectures. His hobbies include basketball, rally racing, and video games.",
  },
  {
    question: "How does he define himself?",
    answer: " He loves discovering new things and pushing his limits.",
  },
  {
    question: "Can you tell me about his studies and experience?",
    answer: " He studied at MyDigitalSchool (2022-2024) in a general curriculum. Currently, he is studying at Ynov Campus (2024-2027). His experiences include creating a legal AI with RAG for Fairval using LLaMA 3, and developing advanced AI systems.",
  },
  {
    question: "What are his future projects?",
    answer: " He is working on advanced agentic AI systems, multi-agent architectures, and cutting-edge LLM applications.",
  },
];

// Fuzzy matching (simpliste) pour fallback
function getSimilarityScore(input, target) {
  const clean = (str) =>
    str
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .split(/\s+/);

  const inWords = clean(input);
  const tarWords = clean(target);

  let matches = 0;
  inWords.forEach((w) => {
    if (tarWords.includes(w)) {
      matches++;
    }
  });

  const totalWords = inWords.length + tarWords.length || 1;
  return (2 * matches) / totalWords;
}

async function getAIResponse(userMessage, conversationHistory) {
  try {
    // Construire l'historique des messages pour l'API
    const history = conversationHistory.map(msg => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text
    }));

    const response = await fetch(apiUrl(`/api/chat`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        history: history
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      return null;
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error calling backend API:", error);
    return null;
  }
}

const FullPageChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [typingText, setTypingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const typingIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);
  const inputRef = useRef(null);  // Référence pour l'input

  const navigate = useNavigate();
  const { language } = useLanguage();

  const translations = {
    en: {
      welcome: "Welcome 👋",
      subtitle: "Ask me questions about Victor Wambersie, his background and projects",
      placeholder: "Ask me a question...",
      back: "← Back",
      send: "Send",
      thinking: "Thinking...",
      unsure: "I'm not sure I understand. Please ask me something else.",
      error: "Sorry, I encountered an error. Please try again.",
      viewProjects: "View Projects →"
    },
    fr: {
      welcome: "Bienvenue 👋",
      subtitle: "Posez vos questions sur Victor Wambersie, son parcours et ses projets",
      placeholder: "Posez-moi une question...",
      back: "← Retour",
      send: "Envoyer",
      thinking: "Réflexion...",
      unsure: "Je ne comprends pas bien. Veuillez poser une autre question.",
      error: "Désolé, une erreur s'est produite. Veuillez réessayer.",
      viewProjects: "Voir les projets →"
    }
  };

  const typeResponse = (fullText, hasButton = false) => {
    typingIndexRef.current = 0;
    setTypingText("");

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      if (typingIndexRef.current < fullText.length) {
        typingIndexRef.current++;
        const currentText = fullText.substring(0, typingIndexRef.current);
        setTypingText(currentText);
      }

      if (typingIndexRef.current >= fullText.length) {
        clearInterval(typingIntervalRef.current);

        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: fullText, hasButton },
        ]);
        setTypingText("");
        
        // Auto-focus sur l'input après la réponse
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }, 25);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMsg = inputValue.trim();
    if (!userMsg) return;

    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Essayer d'abord l'API OpenAI
      const aiResponse = await getAIResponse(userMsg, messages);
      
      setIsLoading(false);
      
      if (aiResponse) {
        typeResponse(aiResponse, false);
      } else {
        // Fallback vers predefined QA
        const matchedAnswer = predefinedQA.find((qa) =>
          getSimilarityScore(userMsg, qa.question) > 0.3
        );

        if (matchedAnswer) {
          typeResponse(matchedAnswer.answer, matchedAnswer.hasButton);
        } else {
          typeResponse(translations[language].unsure);
        }
      }
    } catch (error) {
      console.error("Error handling message:", error);
      setIsLoading(false);
      typeResponse(translations[language].error);
    }
  };

  const handleRedirect = () => {
    navigate("/works");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleQuestionClick = async (question) => {
    // Ajouter la question comme message utilisateur et traiter la réponse
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(question, messages);
      setIsLoading(false);
      
      if (aiResponse) {
        typeResponse(aiResponse, false);
      } else {
        const matchedAnswer = predefinedQA.find((qa) =>
          getSimilarityScore(question, qa.question) > 0.3
        );

        if (matchedAnswer) {
          typeResponse(matchedAnswer.answer, matchedAnswer.hasButton);
        } else {
          typeResponse(translations[language].unsure);
        }
      }
    } catch (error) {
      console.error("Error handling question:", error);
      setIsLoading(false);
      typeResponse(translations[language].error);
    }
  };

  const suggestedQuestions = {
    en: [
      "Who is the creator of this portfolio?",
      "What technologies does he use?",
      "Where is he located?",
      "Is he looking for an internship?"
    ],
    fr: [
      "Qui est le créateur de ce portfolio ?",
      "Quelles technologies utilise-t-il ?",
      "Où est-il localisé ?",
      "Recherche-t-il une alternance ?"
    ]
  };

  return (
    <div className="fullpage-chatbot-container">
      <div className="sidebar-bar" onClick={handleGoBack}>
        <p className="sidebar-text">{translations[language].back}</p>
      </div>
      
      <div className="fullpage-chatbot-content">
        <div className="fullpage-chatbot-header">
          <h2>AI Assistant</h2>
        </div>

        <div className="fullpage-chatbot-messages">
          {messages.length === 0 && (
            <div className="fullpage-chatbot-placeholder">
              <h3>{translations[language].welcome}</h3>
              <p>{translations[language].subtitle}</p>
              <ul>
                {suggestedQuestions[language].map((question, idx) => (
                  <li key={idx} onClick={() => handleQuestionClick(question)}>
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`fullpage-chatbot-message ${
                msg.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              <div className="message-indicator">
                {msg.sender === "user" ? "°‿°" : "AI"}
              </div>
              <div className="message-content">
                {msg.text}
                {msg.hasButton && (
                  <button
                    className="fullpage-chatbot-redirect-btn"
                    onClick={handleRedirect}
                  >
                    {translations[language].viewProjects}
                  </button>
                )}
              </div>
            </div>
          ))}

          {typingText && (
            <div className="fullpage-chatbot-message bot-message">
              <div className="message-indicator">AI</div>
              <div className="message-content">{typingText}</div>
            </div>
          )}
          
          {isLoading && !typingText && (
            <div className="fullpage-chatbot-message bot-message">
              <div className="message-indicator">AI</div>
              <div className="message-content">
                <div className="loading-indicator">{translations[language].thinking}</div>
              </div>
            </div>
          )}
        </div>

        <form className="fullpage-chatbot-form" onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={translations[language].placeholder}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "..." : translations[language].send}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FullPageChatbot;
