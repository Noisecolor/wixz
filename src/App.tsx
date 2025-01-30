import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import BattleScreen from './pages/BattleScreen';
import DebugConsole from './components/DebugConsole';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/promptwizards" element={<LoginScreen />} />
        <Route path="/promptwizards/battle" element={<BattleScreen />} />
        <Route path="*" element={<Navigate to="/promptwizards" replace />} />
      </Routes>
      <DebugConsole />
    </>
  );
}
