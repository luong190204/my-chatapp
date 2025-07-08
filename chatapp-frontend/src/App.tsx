import React, { useState } from 'react';
import './App.css';
import Chat from './components/Chat';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {

  const [userName, setUserName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userName.trim())
      handleLogin()
  };

  const handleLogout = () => {
    setUserName('');
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center bg-gray-100 h-screen">
        <div className='p-8 bg-white rounded-lg shadow-xl w-full sm:w-96'>
          <h1 className='text-3xl font-semibold text-center mb-6 flex items-center justify-center space-x-2'>
            <ChatBubbleLeftIcon className='h-8 w-8 text-blue-500'/>
            <span className='text-xl'>Welcome to chat world! </span>
          </h1>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-300"
            type="text"
            value={userName}
            onChange={ (e) => setUserName(e.target.value) }
            onKeyDown={ handleKeyDown }
          />
          <button 
            className='w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer'
            disabled={ !userName.trim() }
            onClick={ handleLogin }
          >
            Join chat
          </button>
        </div>
      </div>
    );
  }

  return <Chat userName={userName} onLogout={handleLogout}/>;
}

export default App;
