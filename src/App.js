import React, { useState, useEffect, useRef } from "react";
import { Send, Brain, Sparkles, Youtube, FileText } from "lucide-react";

const SmartMentorChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [session, setSession] = useState({
    topic: "",
    awaitingTopic: true,
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 5,
    minScore: 70,
  });

  const messagesEndRef = useRef(null);
  const hasWelcomed = useRef(false);

  // scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // motivational pools
  const correctMessages = [
    "🎉 Absolutely brilliant! You're crushing it!",
    "✨ Perfect! You've got this concept locked down!",
    "🌟 Outstanding work! That's exactly right!",
    "💯 Wow! You nailed that one perfectly!",
    "🚀 Fantastic! Your understanding is crystal clear!",
    "⭐ Superb! You're on fire today!",
    "🎯 Bullseye! That's the perfect answer!",
    "💪 Incredible! You really know your stuff!",
    "🏆 Excellent! You're mastering this topic!",
    "✅ Spot on! Your hard work is paying off!",
    "🌈 Amazing! You've got the right mindset!",
    "🎊 Phenomenal! Keep up this excellent work!"
  ];
  const wrongMessages = [
    "💭 Hmm, not quite, but I love that you're trying! The correct answer is:",
    "🤔 Close attempt! Let me help you understand - the answer is:",
    "📚 That's a learning moment! The right answer is:",
    "🌱 Every mistake is growth! The correct option is:",
    "💡 Not this time, but you're learning! It's actually:",
    "🎓 Great effort! Here's the correct answer:",
    "🌟 Keep going! The right choice is:",
    "🔍 Let's learn together! The answer is:",
    "💪 You're building knowledge! The correct answer is:",
    "🎯 Nice try! The accurate answer is:",
    "📖 Learning is a journey! It should be:",
    "✨ Don't worry, this helps you grow! The answer is:"
  ];
  const encouragementMessages = [
    "Remember, every expert was once a beginner! 🌱",
    "You're doing great - mistakes are just learning opportunities! 💫",
    "This will help you remember it better next time! 🧠",
    "Your effort is what matters most! Keep it up! 💪",
    "Learning is a process, and you're right in it! 🎓",
    "This is how we build real understanding! 🏗️",
    "You're getting closer with each question! 🎯",
    "Challenges make us stronger! You've got this! 💎"
  ];

  // ----------------------------------------------------
  // TOPIC DATABASE
  // ----------------------------------------------------
  const topics = {
    cell: {
      keywords: ["cell", "biology", "organelle", "nucleus", "mitochondria", "membrane", "ribosome", "golgi"],
      questions: [
        { q: "What is known as the 'powerhouse of the cell'?", options: ["Nucleus", "Mitochondria", "Ribosome", "Cell membrane"], correct: 1 },
        { q: "Which organelle controls all the activities of the cell?", options: ["Mitochondria", "Nucleus", "Cytoplasm", "Golgi body"], correct: 1 },
        { q: "Which organelle is responsible for protein synthesis?", options: ["Nucleus", "Mitochondria", "Ribosome", "Vacuole"], correct: 2 },
        { q: "What gives plant cells their rigid structure?", options: ["Cell membrane", "Cell wall", "Cytoplasm", "Nucleus"], correct: 1 },
        { q: "Which organelle packages and distributes proteins?", options: ["Golgi apparatus", "Lysosome", "Chloroplast", "Endoplasmic reticulum"], correct: 0 },
      ],
      resources: [
        { title: "Cell Structure and Function - Complete Guide", url: "https://www.youtube.com/results?search_query=cell+structure+and+function", type: "video" },
        { title: "Khan Academy - Introduction to Cells", url: "https://www.khanacademy.org/science/biology/structure-of-a-cell", type: "article" },
        { title: "Cell Organelles Explained Simply", url: "https://www.youtube.com/results?search_query=cell+organelles+explained", type: "video" },
      ],
    },

    algebra: {
      keywords: ["algebra", "equation", "variable", "solve", "expression", "mathematics"],
      questions: [
        { q: "What is a variable in algebra?", options: ["A fixed number", "A letter representing an unknown value", "An operation", "A constant"], correct: 1 },
        { q: "Solve: x + 5 = 12. What is x?", options: ["5", "7", "17", "12"], correct: 1 },
        { q: "What does 3x mean?", options: ["x + 3", "3 multiplied by x", "x ÷ 3", "3 − x"], correct: 1 },
        { q: "Solve: 2x − 4 = 10. What is x?", options: ["3", "5", "7", "6"], correct: 2 },
        { q: "Simplify: 4x + 3x", options: ["7x", "12x", "7", "x"], correct: 0 },
      ],
      resources: [
        { title: "Khan Academy - Introduction to Algebra", url: "https://www.khanacademy.org/math/algebra", type: "article" },
        { title: "Algebra Basics - Learn in 30 Minutes", url: "https://www.youtube.com/results?search_query=algebra+basics+tutorial", type: "video" },
        { title: "Solving Equations Made Easy", url: "https://www.youtube.com/results?search_query=solving+equations+made+easy", type: "video" },
      ],
    },

    microorganisms: {
      keywords: ["microorganisms", "microbes", "bacteria", "virus", "fungi", "protozoa", "algae", "microbe", "pathogen"],
      questions: [
        { q: "Microorganisms are also called ________ because they cannot be seen with the unaided eye.", options: ["miniorganisms", "microbes", "viruses", "insects"], correct: 1 },
        { q: "Which of the following is NOT a microorganism group?", options: ["Bacteria", "Fungi", "Protozoa", "Reptiles"], correct: 3 },
        { q: "Viruses differ from other microorganisms because they:", options: ["can grow without a host", "reproduce only inside living cells", "are multicellular organisms", "cause only plant diseases"], correct: 1 },
        { q: "Which bacterium converts milk into curd?", options: ["Lactobacillus", "Rhizobium", "Penicillium", "E. coli"], correct: 0 },
        { q: "Microorganisms like Rhizobium help plants by:", options: ["fixing nitrogen in the soil", "absorbing carbon dioxide", "producing alcohol", "causing diseases"], correct: 0 },
      ],
      resources: [
        { title: "Microorganisms: Friend and Foe - Class 8 Science", url: "https://www.youtube.com/results?search_query=microorganisms+friend+and+foe+class+8", type: "video" },
        { title: "NCERT Explanation - Microorganisms and Their Uses", url: "https://www.youtube.com/results?search_query=microorganisms+class+8+ncert+explanation", type: "video" },
        { title: "Khan Academy - Microbes and Their Roles", url: "https://www.khanacademy.org/science/biology/microbiology", type: "article" },
      ],
    },
  };
  // ----------------------------------------------------

  const getTopic = (userInput) => {
    const input = userInput.toLowerCase();
    for (const [key, data] of Object.entries(topics)) {
      if (data.keywords.some((k) => input.includes(k))) return key;
    }
    return null;
  };

  const addMessage = (sender, text, meta = {}) => {
    setMessages((prev) => [...prev, { sender, text, ...meta }]);
  };

  const simulateTyping = (cb, delay = 900) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      cb();
    }, delay);
  };

  const askQuestion = (topic, index) => {
    const all = topics[topic].questions;
    if (index >= session.totalQuestions || index >= all.length) {
      showResults();
      return;
    }
    const q = all[index];
    simulateTyping(() => {
      addMessage(
        "bot",
        `🧠 **Question ${index + 1}/${Math.min(session.totalQuestions, all.length)}:** ${q.q}`,
        { options: q.options }
      );
    });
  };

  const handleOptionClick = (selectedIdx) => {
    const { topic, currentQuestionIndex, score } = session;
    const q = topics[topic].questions[currentQuestionIndex];
    const isCorrect = selectedIdx === q.correct;

    addMessage("user", `👉 ${String.fromCharCode(65 + selectedIdx)}) ${q.options[selectedIdx]}`);

    simulateTyping(() => {
      if (isCorrect) {
        addMessage("bot", getRandom(correctMessages));
      } else {
        addMessage(
          "bot",
          `${getRandom(wrongMessages)} **${q.options[q.correct]}**\n\n${getRandom(encouragementMessages)}`
        );
      }

      const nextIdx = currentQuestionIndex + 1;
      const newScore = isCorrect ? score + 1 : score;

      if (nextIdx < Math.min(session.totalQuestions, topics[topic].questions.length)) {
        setSession((prev) => ({ ...prev, currentQuestionIndex: nextIdx, score: newScore }));
        setTimeout(() => askQuestion(topic, nextIdx), 1200);
      } else {
        setSession((prev) => ({ ...prev, score: newScore }));
        setTimeout(showResults, 1200);
      }
    });
  };

  const showResources = (topic) => {
    const res = topics[topic]?.resources || [];
    if (!res.length) return;
    simulateTyping(() => {
      addMessage("bot", "📚 **No stress! These will make it crystal clear:**");
      res.forEach((r, idx) => {
        setTimeout(() => {
          addMessage("bot", "", { type: "resource", resource: r });
        }, idx * 300);
      });
      setTimeout(() => {
        addMessage("bot", "✨ When you're ready, type **retry** to try the quiz again. You've got this! 💪");
      }, res.length * 300 + 400);
    }, 700);
  };

  const showResults = () => {
    const total = Math.min(session.totalQuestions, topics[session.topic].questions.length);
    const percent = Math.round((session.score / total) * 100);
    const passed = percent >= session.minScore;

    simulateTyping(() => {
      addMessage(
        "bot",
        `🎯 **Assessment complete!**\n\nScore: **${percent}%** (${session.score}/${total})\nRequired: **${session.minScore}%**`
      );

      if (passed) {
        const passBoosters = [
          `🎊 **OUTSTANDING!** You rocked **${session.topic}**! Ready for the next module? 🚀`,
          `🌟 **Amazing!** You've mastered **${session.topic}**. Keep the momentum going!`,
          `🏆 **Champion!** Your grasp on **${session.topic}** is solid. Onward!`
        ];
        addMessage("bot", getRandom(passBoosters));
        setSession({
          topic: "",
          awaitingTopic: true,
          currentQuestionIndex: 0,
          score: 0,
          totalQuestions: 5,
          minScore: 70,
        });
        setTimeout(() => {
          addMessage("bot", "✨ Which topic do you want to take on next? (e.g., *Cell*, *Algebra*, *Microorganisms*)");
        }, 800);
      } else {
        const nudge = [
          `💙 **Hey, it's okay!** Progress over perfection. Let's review **${session.topic}** a bit and try again.`,
          `🌈 **You’re getting there!** A quick review of **${session.topic}** will lock it in.`,
          `✨ **So close!** A little refresh on **${session.topic}** and you'll smash it next time.`
        ];
        addMessage("bot", getRandom(nudge));
        showResources(session.topic);
      }
    });
  };

  const startTopicFlow = (topicKey) => {
    setSession({
      topic: topicKey,
      awaitingTopic: false,
      currentQuestionIndex: 0,
      score: 0,
      totalQuestions: 5,
      minScore: 70,
    });

    simulateTyping(() => {
      addMessage("bot", `✨ Awesome! You just finished **${topicKey}**. Let's quickly check your understanding! 💪`);
      setTimeout(() => askQuestion(topicKey, 0), 1100);
    });
  };

  const resetForRetry = () => {
    if (!session.topic) return;
    setSession((prev) => ({ ...prev, currentQuestionIndex: 0, score: 0 }));
    simulateTyping(() => {
      addMessage("bot", "🔁 **Round 2!** Fresh start — let's do this! 🚀");
      setTimeout(() => askQuestion(session.topic, 0), 1000);
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    addMessage("user", text);
    setInput("");

    if (text.toLowerCase().includes("retry")) {
      resetForRetry();
      return;
    }

    if (session.awaitingTopic) {
      const detected = getTopic(text);
      if (detected) startTopicFlow(detected);
      else simulateTyping(() => addMessage("bot", "🤔 I couldn't match that topic. Try **Cell**, **Algebra**, or **Microorganisms**."));
    } else {
      simulateTyping(() => addMessage("bot", "💡 Choose an answer by clicking one of the options above!"));
    }
  };

  useEffect(() => {
    if (hasWelcomed.current) return;
    hasWelcomed.current = true;
    simulateTyping(() => {
      addMessage("bot", "👋 Hey superstar! I'm your AI Mentor — here to keep you sharp and confident! 🌈");
      setTimeout(() => {
        addMessage("bot", "Tell me which topic you just finished (e.g., **Cell**, **Algebra**, **Microorganisms**) and I’ll pop a quick 5-question quiz to lock it in. 🚀");
      }, 900);
    });
  }, []);

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-4 shadow-xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                AI Mentor Chatbot <Sparkles className="w-5 h-5" />
              </h1>
              <p className="text-sm text-purple-100">Your Personal Learning Companion</p>
            </div>
          </div>
          {session.topic && (
            <div className="text-right bg-white/10 px-4 py-2 rounded-lg">
              <div className="text-sm font-medium capitalize">{session.topic}</div>
              <div className="text-xs text-purple-100 mt-0.5">
                {session.currentQuestionIndex + 1 <= Math.min(session.totalQuestions, topics[session.topic].questions.length)
                  ? `${session.currentQuestionIndex + 1}/${Math.min(session.totalQuestions, topics[session.topic].questions.length)}`
                  : `${Math.min(session.totalQuestions, topics[session.topic].questions.length)}/${Math.min(session.totalQuestions, topics[session.topic].questions.length)}`
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${m.sender === "user" ? "order-2" : "order-1"}`}>
                {m.sender === "bot" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">AI</div>
                    <span className="text-xs text-gray-600 font-semibold">Your Mentor</span>
                  </div>
                )}

                {m.type === "resource" && m.resource ? (
                  <a
                    href={m.resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white border-2 border-purple-300 rounded-xl p-4 hover:border-purple-500 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      {m.resource.type === "video" ? (
                        <div className="bg-red-100 p-3 rounded-xl shadow-md">
                          <Youtube className="w-6 h-6 text-red-600" />
                        </div>
                      ) : (
                        <div className="bg-blue-100 p-3 rounded-xl shadow-md">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-bold text-gray-800">{m.resource.title}</div>
                        <div className="text-xs text-gray-500 capitalize mt-1">📚 {m.resource.type}</div>
                      </div>
                      <div className="text-purple-600 font-bold text-sm bg-purple-100 px-3 py-1 rounded-full">Open →</div>
                    </div>
                  </a>
                ) : (
                  <div
                    className={`rounded-2xl p-4 shadow-lg ${
                      m.sender === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-white border-2 border-gray-200"
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-medium leading-relaxed">{m.text}</div>
                    {m.options && (
                      <div className="grid grid-cols-1 gap-2 mt-3">
                        {m.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOptionClick(idx)}
                            className="bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-gray-800 py-2 px-3 rounded-lg text-left font-medium transition-all duration-150"
                          >
                            {String.fromCharCode(65 + idx)}) {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-200">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">AI</div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t-2 border-purple-300 p-4 shadow-xl">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              session.awaitingTopic
                ? "✨ Type a topic (e.g., Cell, Algebra, Microorganisms)..."
                : "💬 Choose an option above or type 'retry' to try again"
            }
            className="flex-1 px-5 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all font-medium placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartMentorChatbot;
