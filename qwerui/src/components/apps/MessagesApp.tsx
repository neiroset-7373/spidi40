import { useState } from 'react';

interface Chat {
  id: number;
  name: string;
  color: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: number;
  text: string;
  mine: boolean;
  time: string;
}

const initialChats: Chat[] = [
  { id: 1, name: 'Spidi', color: '#667eea', lastMsg: 'Привет, как дела?', time: '14:32', unread: 2, online: true },
  { id: 2, name: 'Бро', color: '#11998e', lastMsg: 'Окей, завтра увидимся', time: '13:10', unread: 0, online: true },
  { id: 3, name: 'Мама', color: '#f093fb', lastMsg: 'Ты поел?', time: 'вчера', unread: 1, online: false },
  { id: 4, name: 'Работа', color: '#a8a8a8', lastMsg: 'Встреча в 15:00', time: 'пн', unread: 0, online: false },
];

const initialMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: 'Эй, ты видел новый Spidios?', mine: false, time: '14:28' },
    { id: 2, text: 'Да! Выглядит круто 🔥', mine: true, time: '14:29' },
    { id: 3, text: 'Android 16 просто огонь!', mine: false, time: '14:30' },
    { id: 4, text: 'Согласен, анимации 🤩', mine: true, time: '14:31' },
    { id: 5, text: 'Привет, как дела?', mine: false, time: '14:32' },
  ],
  2: [
    { id: 1, text: 'Завтра идёшь?', mine: true, time: '13:00' },
    { id: 2, text: 'Окей, завтра увидимся', mine: false, time: '13:10' },
  ],
  3: [
    { id: 1, text: 'Привет мам!', mine: true, time: 'вчера' },
    { id: 2, text: 'Ты поел?', mine: false, time: 'вчера' },
  ],
  4: [
    { id: 1, text: 'Встреча в 15:00', mine: false, time: 'пн' },
  ],
};

export default function MessagesApp() {
  const [chats] = useState<Chat[]>(initialChats);
  const [messages, setMessages] = useState<Record<number, Message[]>>(initialMessages);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim() || !selectedChat) return;
    const now = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = { id: Date.now(), text: input.trim(), mine: true, time: now };
    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg],
    }));
    setInput('');

    // Auto-reply
    setTimeout(() => {
      const replies = ['👍', 'Понял!', 'Окей!', '😄', 'Отлично!', 'Круто!'];
      const reply: Message = {
        id: Date.now() + 1,
        text: replies[Math.floor(Math.random() * replies.length)],
        mine: false,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), reply],
      }));
    }, 1200);
  };

  if (selectedChat) {
    const msgs = messages[selectedChat.id] || [];
    return (
      <div className="h-full flex flex-col" style={{ background: '#0f0f1a' }}>
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setSelectedChat(null)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            ‹
          </button>
          <div className="relative w-10 h-10 rounded-full flex-shrink-0"
            style={{ background: selectedChat.color }}>
            {selectedChat.online && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-900"
                style={{ background: '#38ef7d' }} />
            )}
          </div>
          <div>
            <div className="text-white font-semibold">{selectedChat.name}</div>
            <div className={`text-xs ${selectedChat.online ? 'text-green-400' : 'text-white/40'}`}>
              {selectedChat.online ? 'онлайн' : 'не в сети'}
            </div>
          </div>
          <div className="ml-auto flex gap-2">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.08)' }} />
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {msgs.map(msg => (
            <div key={msg.id} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm"
                style={{
                  background: msg.mine
                    ? 'linear-gradient(135deg, #667eea, #764ba2)'
                    : 'rgba(255,255,255,0.09)',
                  color: '#fff',
                  borderRadius: msg.mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  animationName: 'slideIn',
                  animationDuration: '0.25s',
                }}>
                {msg.text}
                <div className="text-[10px] mt-1 opacity-50 text-right">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Сообщение..."
            className="flex-1 px-4 py-2.5 rounded-full text-sm text-white outline-none"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              caretColor: '#764ba2',
            }}
          />
          <button onClick={sendMessage}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all active:scale-90"
            style={{
              background: input.trim() ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.08)',
            }}>
            →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#0f0f1a' }}>
      {/* Search */}
      <div className="px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span className="text-white/30 text-sm">Поиск в сообщениях...</span>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <button key={chat.id} onClick={() => setSelectedChat(chat)}
            className="w-full flex items-center gap-4 px-4 py-3.5 transition-all active:scale-[0.98]"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="relative w-14 h-14 rounded-full flex-shrink-0"
              style={{ background: chat.color }}>
              {chat.online && (
                <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-gray-950"
                  style={{ background: '#38ef7d' }} />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-white font-semibold">{chat.name}</span>
                <span className="text-white/30 text-xs">{chat.time}</span>
              </div>
              <div className="text-white/50 text-sm truncate">{chat.lastMsg}</div>
            </div>
            {chat.unread > 0 && (
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                {chat.unread}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* FAB */}
      <div className="absolute bottom-6 right-6">
        <button className="w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-xl transition-all active:scale-90"
          style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            boxShadow: '0 8px 24px rgba(102,126,234,0.5)',
          }}>
          +
        </button>
      </div>
    </div>
  );
}
