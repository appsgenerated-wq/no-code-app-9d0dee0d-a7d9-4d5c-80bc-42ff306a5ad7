import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import config from './constants.js';
import { testBackendConnection } from './services/apiService.js';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [backendConnected, setBackendConnected] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const manifest = new Manifest(config.BACKEND_URL);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 [APP] Starting backend connection test...');
      const result = await testBackendConnection();
      setBackendConnected(result.success);

      if (result.success) {
        console.log('✅ [APP] Backend connection successful.');
        try {
          const currentUser = await manifest.from('user').me();
          setUser(currentUser);
          setCurrentScreen('dashboard');
        } catch (err) {
          setUser(null);
          setCurrentScreen('landing');
        }
      } else {
        console.error('❌ [APP] Backend connection failed:', result.error);
      }
      setLoadingUser(false);
    };

    initializeApp();
  }, []);

  const login = async (email, password) => {
    try {
      await manifest.login(email, password);
      const loggedInUser = await manifest.from('user').me();
      setUser(loggedInUser);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const logout = async () => {
    await manifest.logout();
    setUser(null);
    setCurrentScreen('landing');
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <p>Initializing Lunar Link...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${backendConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <span className={`h-2 w-2 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>{backendConnected ? 'Backend Connected' : 'Backend Disconnected'}</span>
        </div>
      </div>

      {currentScreen === 'landing' || !user ? (
        <LandingPage onLogin={login} />
      ) : (
        <DashboardPage user={user} onLogout={logout} manifest={manifest} />
      )}
    </div>
  );
}

export default App;
