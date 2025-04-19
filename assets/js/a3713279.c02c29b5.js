"use strict";(self.webpackChunkwata_docs=self.webpackChunkwata_docs||[]).push([[9588],{3876:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>t,default:()=>h,frontMatter:()=>o,metadata:()=>s,toc:()=>a});const s=JSON.parse('{"id":"deployment","title":"\ud83d\ude80 Deployment Guide","description":"This guide covers the setup and deployment process for WATA, from prerequisites to running the application.","source":"@site/docs/deployment.md","sourceDirName":".","slug":"/deployment","permalink":"/wata-docs/docs/deployment","draft":false,"unlisted":false,"editUrl":"https://github.com/IOITI/wata-docs/tree/main/docs/deployment.md","tags":[],"version":"current","sidebarPosition":6,"frontMatter":{"sidebar_position":6},"sidebar":"tutorialSidebar","previous":{"title":"\ud83d\udcca Trading Workflow","permalink":"/wata-docs/docs/trading-workflow"},"next":{"title":"\ud83c\udf7b  How-To Guide","permalink":"/wata-docs/docs/how-to"}}');var r=i(4848),l=i(8453);const o={sidebar_position:6},t="\ud83d\ude80 Deployment Guide",c={},a=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Deployment Steps",id:"deployment-steps",level:2},{value:"1. Configure Inventory",id:"1-configure-inventory",level:3},{value:"2. Build Application Package",id:"2-build-application-package",level:3},{value:"3. Deploy to Your Server",id:"3-deploy-to-your-server",level:3},{value:"4. Configure Application Settings",id:"4-configure-application-settings",level:3},{value:"5. Manage the Application",id:"5-manage-the-application",level:3},{value:"Docker Compose Architecture",id:"docker-compose-architecture",level:2},{value:"Environment Variables",id:"environment-variables",level:3},{value:"Service Dependencies",id:"service-dependencies",level:3},{value:"Container Structure",id:"container-structure",level:3},{value:"Troubleshooting",id:"troubleshooting",level:2}];function d(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,l.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"-deployment-guide",children:"\ud83d\ude80 Deployment Guide"})}),"\n",(0,r.jsx)(n.p,{children:"This guide covers the setup and deployment process for WATA, from prerequisites to running the application."}),"\n",(0,r.jsx)(n.h2,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,r.jsx)(n.p,{children:"Before deploying WATA, ensure you have:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Saxo Bank account with API access"}),"\n",(0,r.jsx)(n.li,{children:"Dedicated Ubuntu server (VPS or local machine)"}),"\n",(0,r.jsx)(n.li,{children:"Docker and Docker Compose installed"}),"\n",(0,r.jsx)(n.li,{children:"Python 3.12+"}),"\n",(0,r.jsx)(n.li,{children:"Ansible (for automated deployment)"}),"\n",(0,r.jsx)(n.li,{children:"Telegram bot for notifications"}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.em,{children:"(Optional) TradingView account for webhook signals"})}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"deployment-steps",children:"Deployment Steps"}),"\n",(0,r.jsx)(n.h3,{id:"1-configure-inventory",children:"1. Configure Inventory"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Copy the example Ansible inventory file:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"cp deploy/tools/ansible/inventory/inventory_example.ini deploy/tools/ansible/inventory/inventory.ini\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["Edit ",(0,r.jsx)(n.code,{children:"inventory.ini"})," with your server details:","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Server hostname or IP"}),"\n",(0,r.jsx)(n.li,{children:"SSH user and authentication method"}),"\n",(0,r.jsx)(n.li,{children:"Other Ansible configuration as needed"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"2-build-application-package",children:"2. Build Application Package"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Build the deployment package:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"./package.sh\n"})}),"\n","This creates a distributable package with all necessary components."]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"3-deploy-to-your-server",children:"3. Deploy to Your Server"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Run the deployment script:","\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"cd deploy/tools\n./deploy_app_to_your_server.sh\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["The script uses Ansible to:","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Install required dependencies"}),"\n",(0,r.jsx)(n.li,{children:"Set up Docker and Docker Compose"}),"\n",(0,r.jsx)(n.li,{children:"Configure the application directory structure"}),"\n",(0,r.jsx)(n.li,{children:"Deploy the application files"}),"\n",(0,r.jsx)(n.li,{children:"Set up convenient aliases for management"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"4-configure-application-settings",children:"4. Configure Application Settings"}),"\n",(0,r.jsx)(n.p,{children:"After deployment, you need to set up the configuration:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Configure RabbitMQ Password"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"# Navigate to the deploy directory\ncd /app/deploy\n\n# Copy the example .env file\ncp .env.example .env\n\n# Edit the .env file to set your custom RabbitMQ password\nnano .env\n"})}),"\n",(0,r.jsx)(n.p,{children:"This sets the password used by RabbitMQ and automatically updates your config.json file through the setup service."}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Set Up Configuration File"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"cp /app/etc/config_example.json /app/etc/config.json\nnano /app/etc/config.json\n"})}),"\n",(0,r.jsx)(n.p,{children:"Update the configuration with your:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Saxo Bank API credentials"}),"\n",(0,r.jsx)(n.li,{children:"Telegram bot information"}),"\n",(0,r.jsx)(n.li,{children:"Trading rules and preferences"}),"\n",(0,r.jsx)(n.li,{children:"Other settings as needed"}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["For detailed configuration options, see the ",(0,r.jsx)(n.a,{href:"./configuration",children:"Configuration Guide"}),"."]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"5-manage-the-application",children:"5. Manage the Application"}),"\n",(0,r.jsx)(n.p,{children:"Use these aliases to manage WATA on your server:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"watastart"}),": Start the application"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"watastop"}),": Stop the application"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"watalogs"}),": View application logs"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"watastatus"}),": Check application status"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"watasaxoauth <CODE>"}),": Submit Saxo authentication code"]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"docker-compose-architecture",children:"Docker Compose Architecture"}),"\n",(0,r.jsx)(n.p,{children:"WATA uses Docker Compose with an enhanced configuration:"}),"\n",(0,r.jsx)(n.h3,{id:"environment-variables",children:"Environment Variables"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["The ",(0,r.jsx)(n.code,{children:".env"})," file in the ",(0,r.jsx)(n.code,{children:"/app/deploy"})," directory manages sensitive configuration"]}),"\n",(0,r.jsx)(n.li,{children:"Primary use is setting the RabbitMQ password, which is synchronized with your config.json"}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"service-dependencies",children:"Service Dependencies"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["A special ",(0,r.jsx)(n.code,{children:"setup"})," service runs before other services to ensure proper configuration"]}),"\n",(0,r.jsx)(n.li,{children:"This service updates the RabbitMQ password in config.json to match your .env file"}),"\n",(0,r.jsx)(n.li,{children:"All other services depend on both the setup service and RabbitMQ"}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"container-structure",children:"Container Structure"}),"\n",(0,r.jsx)(n.p,{children:"The application runs in several containers:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"rabbitmq"}),": Message broker for inter-service communication"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"web_server"}),": Receives webhook signals"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"trader"}),": Handles Saxo Bank operations"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"scheduler"}),": Manages periodic tasks"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"telegram"}),": Handles notifications"]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"troubleshooting",children:"Troubleshooting"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Container not starting"}),": Check logs with ",(0,r.jsx)(n.code,{children:"watalogs"})," to identify issues"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Authentication problems"}),": Verify Saxo credentials in config.json"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Connection issues"}),": Ensure your server has proper internet access"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Configuration problems"}),": Compare with example configuration for missing fields"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}}}]);