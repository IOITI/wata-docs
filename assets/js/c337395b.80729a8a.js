"use strict";(self.webpackChunkwata_docs=self.webpackChunkwata_docs||[]).push([[1262],{7364:(e,r,i)=>{i.r(r),i.d(r,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>t,metadata:()=>s,toc:()=>o});const s=JSON.parse('{"id":"reporting","title":"\ud83d\udcc8 Reporting","description":"WATA includes a comprehensive reporting system that provides visual analytics and performance tracking for your trading activity.","source":"@site/docs/reporting.md","sourceDirName":".","slug":"/reporting","permalink":"/wata/docs/reporting","draft":false,"unlisted":false,"editUrl":"https://github.com/IOITI/wata/tree/main/website/docs/reporting.md","tags":[],"version":"current","sidebarPosition":8,"frontMatter":{"sidebar_position":8},"sidebar":"tutorialSidebar","previous":{"title":"\ud83d\udcbe Database System","permalink":"/wata/docs/database"},"next":{"title":"\u2753 Frequently Asked Questions","permalink":"/wata/docs/faq"}}');var n=i(4848),a=i(8453);const t={sidebar_position:8},l="\ud83d\udcc8 Reporting",d={},o=[{value:"Dashboard Overview",id:"dashboard-overview",level:2},{value:"Setting Up the Dashboard",id:"setting-up-the-dashboard",level:2},{value:"Requirements",id:"requirements",level:3},{value:"Dashboard Setup Steps",id:"dashboard-setup-steps",level:3},{value:"Available Reports",id:"available-reports",level:2},{value:"1. Performance Overview",id:"1-performance-overview",level:3},{value:"2. Trade Analysis",id:"2-trade-analysis",level:3},{value:"3. Risk Metrics",id:"3-risk-metrics",level:3},{value:"4. Time Analysis",id:"4-time-analysis",level:3},{value:"Customizing the Dashboard",id:"customizing-the-dashboard",level:2}];function c(e){const r={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.header,{children:(0,n.jsx)(r.h1,{id:"-reporting",children:"\ud83d\udcc8 Reporting"})}),"\n",(0,n.jsx)(r.p,{children:"WATA includes a comprehensive reporting system that provides visual analytics and performance tracking for your trading activity."}),"\n",(0,n.jsx)(r.h2,{id:"dashboard-overview",children:"Dashboard Overview"}),"\n",(0,n.jsx)(r.p,{children:"The reporting dashboard is built on Observable Framework and provides:"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:"Daily and cumulative profit tracking"}),"\n",(0,n.jsx)(r.li,{children:"Performance analysis by action type (long, short)"}),"\n",(0,n.jsx)(r.li,{children:"Win-rate and position duration metrics"}),"\n",(0,n.jsx)(r.li,{children:"Interactive data exploration"}),"\n"]}),"\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.img,{alt:"reporting_example.gif",src:i(8383).A+"",width:"960",height:"601"})}),"\n",(0,n.jsx)(r.h2,{id:"setting-up-the-dashboard",children:"Setting Up the Dashboard"}),"\n",(0,n.jsx)(r.h3,{id:"requirements",children:"Requirements"}),"\n",(0,n.jsx)(r.p,{children:"To use the reporting system, you need:"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:"Node.js and npm installed"}),"\n",(0,n.jsx)(r.li,{children:"DuckDB CLI installed"}),"\n",(0,n.jsxs)(r.li,{children:["Python 3.12+ (with required libraries in ",(0,n.jsx)(r.code,{children:"./reporting/requirements.txt"}),")"]}),"\n",(0,n.jsx)(r.li,{children:"Ansible configured with proper inventory (same as deployment stage)"}),"\n"]}),"\n",(0,n.jsx)(r.h3,{id:"dashboard-setup-steps",children:"Dashboard Setup Steps"}),"\n",(0,n.jsxs)(r.ol,{children:["\n",(0,n.jsxs)(r.li,{children:["\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.strong,{children:"Run the Setup Script"})}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:"./reporting/setup_dashboard.sh\n"})}),"\n",(0,n.jsxs)(r.p,{children:["This script creates a new Observable Framework project in ",(0,n.jsx)(r.code,{children:"reporting/trading-dashboard"}),"."]}),"\n"]}),"\n",(0,n.jsxs)(r.li,{children:["\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.strong,{children:"Sync Trading Data"})}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:"./reporting/sync_reporting_data.sh\n"})}),"\n",(0,n.jsx)(r.p,{children:"This script synchronizes your trading data from the server to your local dashboard:"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:"Fetches DuckDB data from your production server"}),"\n",(0,n.jsx)(r.li,{children:"Exports the database to Parquet format"}),"\n",(0,n.jsx)(r.li,{children:"Generates the necessary JSON files for visualization"}),"\n",(0,n.jsx)(r.li,{children:"Copies all data to the Observable Framework project"}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(r.li,{children:["\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.strong,{children:"Start the Dashboard Server"})}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:"./reporting/start_report_server.sh\n"})}),"\n",(0,n.jsxs)(r.p,{children:["This launches the development server on port 4321.\nAccess the dashboard at: ",(0,n.jsx)(r.a,{href:"http://localhost:4321",children:"http://localhost:4321"})]}),"\n"]}),"\n"]}),"\n",(0,n.jsx)(r.h2,{id:"available-reports",children:"Available Reports"}),"\n",(0,n.jsx)(r.p,{children:"The dashboard provides several views to analyze your trading performance:"}),"\n",(0,n.jsx)(r.h3,{id:"1-performance-overview",children:"1. Performance Overview"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:"Daily profit/loss chart"}),"\n",(0,n.jsx)(r.li,{children:"Cumulative performance tracking"}),"\n",(0,n.jsx)(r.li,{children:"Monthly and weekly summaries"}),"\n"]}),"\n",(0,n.jsx)(r.h3,{id:"2-trade-analysis",children:"2. Trade Analysis"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:"Performance by trade type"}),"\n",(0,n.jsx)(r.li,{children:"Average trade duration"}),"\n",(0,n.jsx)(r.li,{children:"Win/loss ratio"}),"\n",(0,n.jsx)(r.li,{children:"Profit factor"}),"\n"]}),"\n",(0,n.jsx)(r.h3,{id:"3-risk-metrics",children:"3. Risk Metrics"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:"Maximum drawdown"}),"\n",(0,n.jsx)(r.li,{children:"Risk/reward ratio"}),"\n",(0,n.jsx)(r.li,{children:"Volatility measures"}),"\n"]}),"\n",(0,n.jsx)(r.h3,{id:"4-time-analysis",children:"4. Time Analysis"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsx)(r.li,{children:"Performance by time of day"}),"\n",(0,n.jsx)(r.li,{children:"Day of week analysis"}),"\n",(0,n.jsx)(r.li,{children:"Trading frequency metrics"}),"\n"]}),"\n",(0,n.jsx)(r.h2,{id:"customizing-the-dashboard",children:"Customizing the Dashboard"}),"\n",(0,n.jsx)(r.p,{children:"The Observable Framework makes it easy to customize the dashboard:"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsxs)(r.li,{children:["Edit files in ",(0,n.jsx)(r.code,{children:"reporting/trading-dashboard/src/pages/"})," to modify existing views"]}),"\n",(0,n.jsx)(r.li,{children:"Add new pages for custom analyses"}),"\n",(0,n.jsx)(r.li,{children:"Adjust visualization parameters in the configuration files"}),"\n"]})]})}function h(e={}){const{wrapper:r}={...(0,a.R)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},8383:(e,r,i)=>{i.d(r,{A:()=>s});const s=i.p+"assets/images/reporting_example-285deffdde309c129a70a24008eb69c2.gif"}}]);