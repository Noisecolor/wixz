import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import BattleScreen from './pages/BattleScreen';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/battle" element={<BattleScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}