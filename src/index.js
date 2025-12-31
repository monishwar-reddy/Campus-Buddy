import React from 'react';
import ReactDOM from 'react-dom/client';
import { datadogRum } from '@datadog/browser-rum';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

datadogRum.init({
  applicationId: process.env.REACT_APP_DD_APPLICATION_ID,
  clientToken: process.env.REACT_APP_DD_CLIENT_TOKEN,
  site: process.env.REACT_APP_DD_SITE || 'datadoghq.com',
  service: process.env.REACT_APP_DD_SERVICE || 'kiroween-bulletin',
  env: process.env.REACT_APP_DD_ENV || 'development',
  // Specify a version number to identify the deployed version of your application in Datadog 
  // version: '1.0.0', 
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
