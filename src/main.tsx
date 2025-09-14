import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import TestSimple from './test-simple.tsx';
import './index.css';

// Temporarily use TestSimple to check if basic React is working
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestSimple />
  </StrictMode>
);
