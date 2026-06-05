import { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    fetch("http://localhost:5000/")
      .then(res => res.text())
      .then(data => {
        console.log("API Response:", data);
      })
      .catch(err => {
        console.log("API Error:", err);
      });
  }, [])

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🎉 Zaalima Project Running</h1>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>Welcome to your SaaS application</p>
      <p>Check your browser console to see the API response.</p>
    </div>
  )
}

export default App
