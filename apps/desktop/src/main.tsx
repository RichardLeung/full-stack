import React from 'react';
import { createRoot } from 'react-dom/client';
import { LearningApp } from '@learning/ui';
import '@learning/ui/styles.css';
declare global { interface Window { learningDesktop?: { platform: string; apiUrl?: string } } }
createRoot(document.getElementById('root')!).render(<React.StrictMode><LearningApp apiUrl={window.learningDesktop?.apiUrl || import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000'} desktop /></React.StrictMode>);
