import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import '@mysten/dapp-kit/dist/index.css';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 👇 Import ToastProvider
import { ToastProvider } from './context/ToastContext'; 

const queryClient = new QueryClient();
const networks = {
  testnet: { url: getFullnodeUrl('testnet') }, // Thêm testnet vào đây
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider>
          {/* 👇 Bọc ToastProvider bao quanh App */}
          <ToastProvider> 
            <App />
          </ToastProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);