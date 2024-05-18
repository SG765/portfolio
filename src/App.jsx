import { useState, useEffect } from 'react'
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {Button} from 'antd'
import About from './pages/About';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Navigation from './components/Navigation';
import { auth, db } from './firebase'
import {onAuthStateChanged  } from "firebase/auth";

function App() { 
  const [loggedIn, setLoggedIn]= useState(false);

  useEffect(() => {
    const createConfetti = (side) => {
      const confettiContainer = document.getElementById('confetti-container');
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = getRandomColor();
      confetti.style.bottom = `${-20 + Math.random() * 10}vh`; // Start below the viewport
      confetti.style.animationDelay = '0s';
      confetti.style.margin = '5px';
      confetti.style.animationDelay = `${Math.random() * 4}s`;

      if (side === 'left') {
        confetti.style.left = `${Math.random() * 10}vw`;
      } else {
        confetti.style.right = `${Math.random() * 10}vw`;
      }

      confettiContainer.appendChild(confetti);

      // Add event listener for animation end
      confetti.addEventListener('animationend', () => {
        confetti.remove(); // Remove the confetti piece after animation ends
        createConfetti(side); // Create a new confetti piece on the same side
      });
    };

    const getRandomColor = () => {
      const r = Math.floor(Math.random() * 156);
      const g = Math.floor(Math.random() * 200);
      const b = Math.floor(200+ Math.random() * 256);
      return `rgb(${r}, ${g}, ${b})`;
    };

    // Initial creation of confetti pieces
    for (let i = 0; i < 3; i++) {
      createConfetti('left');
      createConfetti('right');
    }
  }, []);

   //useEffect hook to determine if user logged in
   useEffect(() => {

    const handleLoginChange = onAuthStateChanged(auth, async (user) => {
      if (user) {
          setLoggedIn(true);
          console.log(loggedIn)
      } else {
          // User is signed out.
          setLoggedIn(false);
      }
  });
    return () => handleLoginChange();
  }, []);

  return (
    <div className="app-bg">
      <div id="confetti-container" />
      <BrowserRouter>
        <Navigation loggedIn={loggedIn}/>
        <div className="content">
          <Routes>
            <Route path="/" element={<Projects loggedIn={loggedIn}/>} />
            <Route path="/projects" element={<Projects loggedIn={loggedIn} />} />
            <Route path="/about" element={<About loggedIn={loggedIn}/>} />
            <Route path="/login" element={<Login loggedIn={loggedIn}/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
