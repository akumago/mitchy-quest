import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App'; // Changed from default to named import

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element. The React app cannot be mounted.');
  const errorDiv = document.createElement('div');
  errorDiv.style.color = 'red';
  errorDiv.style.padding = '20px';
  errorDiv.style.textAlign = 'center';
  errorDiv.style.fontSize = '18px';
  errorDiv.innerHTML = 'エラー: ルート要素 (#root) が見つかりません。Reactアプリを起動できません。index.html を確認してください。';
  document.body.appendChild(errorDiv);
}