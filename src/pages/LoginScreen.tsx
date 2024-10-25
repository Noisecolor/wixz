import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LeaderBoard from '../components/LeaderBoard';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [scores, setScores] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const { data, error } = await supabase
        .from('UserScore')
        .select('*')
        .order('Score', { ascending: false });
      
      if (error) {
        throw error;
      }

      setScores(data || []);
    } catch (err) {
      console.error('Error fetching scores:', err);
      setError('Unable to load scores. Please check your connection.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('username', username);
      navigate('/battle');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl mb-8">
        <div className="flex items-center justify-center mb-8">
          <Gamepad2 className="w-12 h-12 text-purple-300" />
          <h1 className="text-4xl font-bold text-white ml-4">AI Battle</h1>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-200">
              Enter Your Name
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-white/5 border border-purple-300/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="Your gaming name"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
          >
            Start Battle
          </button>
        </form>
      </div>

      {error ? (
        <div className="w-full max-w-2xl bg-red-500/10 backdrop-blur-lg rounded-lg p-4 mb-8">
          <p className="text-red-200 text-center">{error}</p>
        </div>
      ) : (
        <LeaderBoard scores={scores} />
      )}
    </div>
  );
}