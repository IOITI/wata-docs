---
sidebar_position: 1
---
# 💹 Welcome to WATA 

<img src="/wata-docs/img/wata_header.png" alt="logo" width="400" />

Automated trading system for Saxo Bank's Knock-out warrants (Turbos), executing trades via webhook signals.

![GitHub repo size](https://img.shields.io/github/repo-size/IOITI/wata?style=flat-square)
![GitHub contributors](https://img.shields.io/github/contributors/IOITI/wata?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/IOITI/wata?style=flat-square)
![GitHub license](https://img.shields.io/github/license/IOITI/wata?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/IOITI/wata?style=flat-square)
![GitHub Release Date](https://img.shields.io/github/release-date/IOITI/wata?style=flat-square)
![GitHub Stars](https://img.shields.io/github/stars/IOITI/wata?style=social) 
![GitHub Forks](https://img.shields.io/github/forks/IOITI/wata?style=social)

---

:::warning

**This is a personal learning project and not production-ready software.**

 Do not risk money which you are afraid to lose. USE THE SOFTWARE AT YOUR OWN RISK. THE AUTHORS AND ALL AFFILIATES ASSUME NO RESPONSIBILITY FOR YOUR TRADING RESULTS.

Always start by running WATA with small money amounts to test the system and its performance. Use a secondary Saxo account if possible. Understand the risks involved in trading before you start, and do not engage money before you understand how it works and what profit/loss you should expect.

**Risk Warning: WATA CAN LOSE ALL YOUR MONEY due to:**
- Insufficient code testing
- Limited security measures on your server
- Lack of fail-safe mechanisms
- No comprehensive monitoring included
- Absence of fail-over systems
- Limited user experience
- Change of Saxo Bank API
- Because trading with leverage is very risky

*This software is provided "as is" without warranty. The authors accept no liability for any damages arising from its use.*
:::

## 🎯 Purpose

WATA (Warrants Automated Trading Assistant) is an algorithmic trading system compagnon, designed for automated execution of Knock-out warrants (Turbos) on Saxo Bank. It serves as a reliable bridge between trading signals and actual market execution, offering several key benefits:

- **Automated Execution**: Eliminates emotional bias and human error by executing trades based on predefined rules and signals (from TradingView, for example)
- **Risk Management**: Implements systematic position monitoring with stop-loss and take-profit mechanisms
- **Performance Tracking**: Provides comprehensive analytics and reporting for trade analysis
- **Real-time Monitoring**: Delivers instant notifications via Telegram for trade execution and system status
- **Scalability**: Built on a microservice architecture for reliable and maintainable operation

The system is particularly suited for traders who:
- Want to automate their trading strategies
- Need reliable execution of trading signals
- Require comprehensive trade tracking and analysis
- Value real-time monitoring and alerts
- Prefer systematic, rule-based trading over discretionary decisions

## 📖 Documentation Overview

This documentation will guide you through:

- [Architecture](architecture): Understanding the system design and components
- [Trading Workflow](trading-workflow): How trades are processed from signal to execution
- [How-To Guide](how-to): Step-by-step setup and usage instructions
- [Configuration](configuration): Detailed configuration options
- [Saxo Authentication](saxo-authentication): Setting up API access
- [Database System](database): How data is stored and managed
- [Reporting](reporting): Analytics and visualization capabilities
- [FAQ](faq): Answers to common questions

## 📄 License

MIT License

Copyright (c) 2025 IOITI
