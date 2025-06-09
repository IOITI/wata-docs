import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';


export default function PerformanceChart() {
  return (
    <Layout title="Performance Chart" description="Observable Framework Dashboard">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 60px)',
          width: '100%',
        }}>
        <iframe
          src={useBaseUrl('/performance-chart/')}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
    </Layout>
  );
}