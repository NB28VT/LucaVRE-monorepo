import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState<string>('Connecting to Rails...');

  useEffect(() => {
    // Hardcoded to port 3000 for this quick initial connection test
    axios.get('http://localhost:3000/welcome/hello', {
      // withCredentials: true 
    })
      .then(res => setMessage(res.data.message))
      .catch(() => setMessage('Failed to connect'));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>LucaVRE Integration Baseline</h1>
      <p style={{ fontWeight: 'bold', color: 'green' }}>{message}</p>
    </div>
  );
}

export default App;
