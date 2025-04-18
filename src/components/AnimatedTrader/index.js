import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const MESSAGES = ['LONG!', 'SHORT!', 'HOLD!'];
const EXPRESSIONS = ['happy', 'angry', 'confused', 'surprised'];

export default function AnimatedTrader({ logoSrc, width = 200 }) {
  const [message, setMessage] = useState('');
  const [expression, setExpression] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Initial animation delay
    const initialDelay = setTimeout(() => {
      triggerAnimation();
    }, 2000);

    return () => clearTimeout(initialDelay);
  }, []);

  const triggerAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Select random message and expression
    const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    const randomExpression = EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)];
    
    setMessage(randomMessage);
    setExpression(randomExpression);
    
    // Reset after animation completes
    setTimeout(() => {
      setMessage('');
      setIsAnimating(false);
      
      // Schedule next animation
      const nextAnimationDelay = 3000 + Math.random() * 5000; // Random delay between 3-8 seconds
      setTimeout(triggerAnimation, nextAnimationDelay);
    }, 2000);
  };

  return (
    <div 
      className={styles.animatedTrader} 
      style={{ width: `${width}px`, height: `${width}px` }}
      onClick={triggerAnimation}
    >
      {/* Base logo */}
      <img 
        src={logoSrc} 
        alt="WATA Logo" 
        className={styles.traderLogo}
      />
      
      {/* Animated eyes */}
      <div className={`${styles.eyes} ${expression ? styles[expression] : ''}`}>
        <div className={styles.eye}>
          <div className={styles.pupil}></div>
        </div>
        <div className={styles.eye}>
          <div className={styles.pupil}></div>
        </div>
      </div>
      
      {/* Animated mouth - only show when there's a message */}
      {message && (
        <div className={`${styles.mouth} ${expression ? styles[expression] : ''} ${styles.shouting}`}>
          <div className={styles.tongue}></div>
        </div>
      )}
      
      {/* Message bubble */}
      {message && (
        <div className={styles.messageBubble}>
          <div className={styles.message}>{message}</div>
        </div>
      )}
    </div>
  );
} 