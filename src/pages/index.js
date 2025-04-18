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
              logoSrc="/wata-docs/img/wata_logo.png"
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
  
  return (
    <section className={clsx(styles.statistics, {[styles.visible]: visible})}>
      <div className="container">
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>No manual trade</div>
            <div className={styles.statLabel}></div>
            <div className={styles.statLabel}>---</div>
            <div className={styles.statLabel}>But you need a strategy</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>0% FOMO TRADE</div>
            <div className={styles.statLabel}>---</div>
            <div className={styles.statLabel}>WATA doesn't</div>
            <div className={styles.statLabel}>read Reddit tips</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>99.9% Uptime</div>
            <div className={styles.statLabel}>---</div>
            <div className={styles.statLabel}>Unlike your trading discipline</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>Instant Trade Alerts</div>
            <div className={styles.statLabel}>---</div>
            <div className={styles.statLabel}>Bad news delivered faster than ever</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>Systematic Execution</div>
            <div className={styles.statLabel}>---</div>
            <div className={styles.statLabel}>No</div>
            <div className={styles.statLabel}>'just one more trade' syndrome</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>Limited Diversification</div>
            <div className={styles.statLabel}>---</div>
            <div className={styles.statLabel}>Because you'll probably just use one asset</div>
          </div>
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
              Start Now
            </Link>
          </div>
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
      </main>
      <CTASection />
    </Layout>
  );
}
