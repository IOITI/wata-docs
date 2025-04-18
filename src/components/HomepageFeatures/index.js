import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Automated Trading',
    Svg: require('@site/static/img/automated_trading.svg').default,
    description: (
      <>
        WATA is designed to automate the execution of trading signals for Saxo Bank's 
        Knock-out warrants (Turbos), eliminating emotional bias and human error.
      </>
    ),
  },
  {
    title: 'Risk Management',
    Svg: require('@site/static/img/risk_management.svg').default,
    description: (
      <>
        Implement systematic position monitoring with stop-loss and take-profit mechanisms. 
        WATA provides configurable risk parameters to help protect your capital.
      </>
    ),
  },
  {
    title: 'Performance Tracking',
    Svg: require('@site/static/img/performance_tracking.svg').default,
    description: (
      <>
        Comprehensive analytics and reporting for trade analysis. Track your 
        performance with detailed statistics and performance metrics.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
