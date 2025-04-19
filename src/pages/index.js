import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import React, { useState, useEffect } from 'react';
import AnimatedTrader from '@site/src/components/AnimatedTrader';

function FunkyText({children, className}) {
  const letters = children.split('');
  
  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <span 
          key={index} 
          className={styles.funkyLetter}
          style={{ 
            animationDelay: `${index * 0.1}s`,
            transform: `rotate(${Math.sin(index) * 10}deg)`,
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

function FloatingEmojis() {
  return (
    <div className={styles.floatingEmojis}>
      {['💰', '📈', '🚀', '💸', '✨', '🔥', '💯'].map((emoji, index) => (
        <div
          key={index}
          className={styles.floatingEmoji}
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.heroBackground}>
        <div className={styles.heroOverlay} />
      </div>
      <FloatingEmojis />
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <Heading as="h1" className={styles.heroTitle}>
              <FunkyText>{siteConfig.title}</FunkyText>
            </Heading>
            <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
            <div className={styles.buttons}>
              <Link
                className={clsx('button button--lg', styles.primaryButton)}
                to="/docs/intro">
                Get Started →
              </Link>
              <Link
                className={clsx('button button--outline button--lg', styles.secondaryButton)}
                to="https://github.com/ioiti/wata">
                View on GitHub
              </Link>
            </div>
          </div>
          <div className={styles.heroRight}>
            <AnimatedTrader 
              logoSrc="/wata-docs/img/wata_logo.svg"
              width={200}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function StatisticsSection() {
  const [visible, setVisible] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      });
    }, { threshold: 0.1 });
    
    const element = document.querySelector(`.${styles.statistics}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);
  
  const handleCardFlip = (index) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: true
    }));
  };
  
  const resetCards = (e) => {
    // Only reset if clicking directly on the section or container, not on cards
    if (e.target.className === styles.statistics || 
        e.target.className === 'container' ||
        e.target.className === styles.statGrid) {
      setFlippedCards({});
    }
  };
  
  const cards = [
    {
      front: "WATA Secret",
      back: {
        title: "No manual trade",
        description: "But you need a strategy"
      }
    },
    {
      front: "WATA Secret",
      back: {
        title: "0% FOMO TRADE",
        description: "WATA doesn't read Reddit tips"
      }
    },
    {
      front: "WATA Secret",
      back: {
        title: "99.9% Uptime",
        description: "Unlike your trading discipline"
      }
    },
    {
      front: "WATA Secret",
      back: {
        title: "Instant Trade Alerts",
        description: "Bad news delivered faster than ever"
      }
    },
    {
      front: "WATA Secret",
      back: {
        title: "Systematic Execution",
        description: "No 'just one more trade' syndrome"
      }
    },
    {
      front: "WATA Secret",
      back: {
        title: "Limited Diversification",
        description: "Because you'll probably just use one asset"
      }
    }
  ];
  
  return (
    <section className={clsx(styles.statistics, {[styles.visible]: visible})} onClick={resetCards}>
      <div className="container">
        <div className={styles.statGrid}>
          {cards.map((card, index) => (
            <div 
              key={index} 
              className={styles.flipCard}
              onMouseEnter={() => handleCardFlip(index)}
              tabIndex="0"
            >
              <div className={clsx(styles.flipCardInner, {[styles.flipped]: flippedCards[index]})}>
                <div className={styles.flipCardFront}>
                  <div className={styles.frontContent}>
                    <span>{card.front}</span>
                    <div className={styles.hoverHint}>Hover to reveal</div>
                  </div>
                </div>
                <div className={styles.flipCardBack}>
                  <div className={styles.statNumber}>{card.back.title}</div>
                  <div className={styles.statLabel}>---</div>
                  <div className={styles.statLabel}>{card.back.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GlitchText({text}) {
  return (
    <div className={styles.glitchWrapper}>
      <div className={styles.glitch} data-text={text}>{text}</div>
    </div>
  );
}

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaContent}>
          <Heading as="h2" className={styles.ctaTitle}>
            <GlitchText text="Ready to automate your trading?" />
          </Heading>
          <p className={styles.ctaDescription}>
            WATA provides an end-to-end solution for automated trading on Saxo Bank's platform, 
            allowing you to execute trades based on your signals without emotional bias.
          </p>
          <div className={styles.ctaButtons}>
            <Link
              className={clsx('button button--lg', styles.primaryButton)}
              to="/docs/intro">
              Start Now 🌅
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FluxSchemaSection() {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimate(true);
        }
      });
    }, { threshold: 0.2 });
    
    const element = document.querySelector(`.${styles.fluxSchema}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);
  
  return (
    <section className={styles.fluxSchema}>
      <div className="container">
        <Heading as="h2" className={styles.fluxTitle}>
          <GlitchText text="How WATA Works" />
        </Heading>
        
        <div className={styles.fluxContainer}>
          <div className={styles.fluxNode}>
            <div className={styles.fluxIcon}>
              <img src="/wata-docs/img/tradingview-logo.svg" alt="TradingView" />
              <div className={styles.fluxLabel}>Signal Source</div>
            </div>
          </div>
          
          <div className={clsx(styles.fluxPath, {[styles.animatePath]: animate})}>
            <div className={styles.fluxLight}></div>
            <div className={styles.fluxArrow}></div>
            <div className={styles.fluxConnectionLabel}>Webhook Signals</div>
          </div>
          
          <div className={styles.fluxNode}>
            <div className={styles.fluxIcon}>
              <img src="/wata-docs/img/wata_logo.svg" alt="WATA" />
              <div className={styles.fluxLabel}>WATA</div>
            </div>
          </div>
          
          <div className={clsx(styles.fluxPath, {[styles.animatePath]: animate})}>
            <div className={styles.fluxLight}></div>
            <div className={styles.fluxArrow}></div>
            <div className={styles.fluxConnectionLabel}>API Requests</div>
          </div>
          
          <div className={styles.fluxNode}>
            <div className={styles.fluxIcon}>
              <img src="/wata-docs/img/saxo-logo.svg" alt="Saxo Bank" />
              <div className={styles.fluxLabel}>Saxo Bank</div>
            </div>
          </div>
        </div>
        <div className={styles.ctaButtons}>
            <Link
              className={clsx('button button--lg', styles.primaryButton)}
              to="/docs/architecture">
              📚 Look at the architecture
            </Link>
          </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="WATA - Automated trading system for Saxo Bank's Knock-out warrants (Turbos)">
      <HomepageHeader />
      <StatisticsSection />
      <main>
        <HomepageFeatures />
        <FluxSchemaSection />
      </main>
      <CTASection />
    </Layout>
  );
}