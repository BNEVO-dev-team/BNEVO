import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ChatbotHelper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: 'Bonjour ! Je suis l\'assistant BNEVO. Que puis-je faire pour vous aujourd\'hui ? (ex: comment choisir un créneau, créer une mission, etc.)',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const { currentUser } = useApp();

  useEffect(() => {
    const updateVisibility = () => {
      setIsHidden(document.body.classList.contains('hide-chatbot'));
    };

    updateVisibility();
    const observer = new MutationObserver(updateVisibility);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  if (isHidden) {
    return null;
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');

    // Responsive assistant reply
    setTimeout(() => {
      let botResponse = 'Je suis là pour vous aider ! Vous pouvez explorer les missions ouvertes ou consulter votre planning depuis votre espace.';
      const lower = userText.toLowerCase();

      if (lower.includes('inscri') || lower.includes('créneau') || lower.includes('creneau')) {
        botResponse = 'Pour vous inscrire à un créneau, rendez-vous dans l’Espace Bénévole > Catalogue des Missions, puis cliquez sur « Choisir un créneau » sur la mission de votre choix !';
      } else if (lower.includes('désist') || lower.includes('annul')) {
        botResponse = 'Vous pouvez vous désister à tout moment depuis « Mes Créneaux ». La place sera automatiquement remise à disposition pour d’autres bénévoles.';
      } else if (lower.includes('organisa') || lower.includes('créer') || lower.includes('asso')) {
        botResponse = 'Dans l’Espace Organisation, accédez à « Missions & Créneaux » et cliquez sur « Créer une Mission » pour définir vos tranches horaires et quotas.';
      } else if (lower.includes('déconnect') || lower.includes('quitter')) {
        botResponse = 'Le bouton rouge « Déconnexion » est toujours accessible en haut à droite de l’écran pour revenir à la page d’accueil.';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-emerald-200 overflow-hidden flex flex-col h-[420px] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-emerald-600 px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <div>
                <h3 className="text-xs font-bold font-display">Assistant BNEVO</h3>
                <p className="text-[10px] text-emerald-100">En ligne · Support instantané</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700 transition-colors"
              aria-label="Fermer le chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs bg-slate-50/60">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  { sender: 'user', text: 'Comment s\'inscrire ?' },
                  { sender: 'bot', text: 'Cliquez sur « Espace Bénévole », parcourez les missions et validez votre créneau en 1 clic !' },
                ]);
              }}
              className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-md whitespace-nowrap transition-colors"
            >
              Comment s'inscrire ?
            </button>
            <button
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  { sender: 'user', text: 'Où est mon planning ?' },
                  { sender: 'bot', text: 'Dans l’Espace Bénévole, l’onglet « Mes Créneaux » affiche toutes vos dates confirmées et les coordonnées des référents.' },
                ]);
              }}
              className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-md whitespace-nowrap transition-colors"
            >
              Mon planning
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Une question sur BNEVO..."
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex-shrink-0"
              aria-label="Envoyer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating launcher button matching screenshot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-13 h-13 rounded-2xl bg-white border-2 border-emerald-500 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
        aria-label="Ouvrir l'assistant BNEVO"
      >
        <img
          src="/images/MASCOTTE.png"
          alt=""
          className="h-8 w-8 object-contain"
        />

        {/* Green online badge in the top right corner */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></span>
      </button>
    </div>
  );
};
