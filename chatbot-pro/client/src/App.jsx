// client/src/App.jsx
import { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setChat([...chat, { type: 'user', text: userMsg }]);
    setInput('');

    const res = await fetch('http://localhost:3001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg }),
    });

    const data = await res.json();
    setChat(prev => [...prev, { type: 'bot', text: data.reply }]);
  };

  return (
    <div className="app">
      <h1>Chat with GPT</h1>
      <div className="chat-box">
        {chat.map((msg, i) => (
          <div key={i} className={msg.type}>{msg.text}</div>
        ))}
      </div>
      <div className="input-row">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
