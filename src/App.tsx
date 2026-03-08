import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MemberApp from './views/memberview/MemberApp';
import AdminApp from './views/adminview/AdminApp';
import OperatorApp from './views/operatorview/OperatorApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin View */}
        <Route path="/admin/*" element={<AdminApp />} />
        
        {/* Operator View */}
        <Route path="/operator/*" element={<OperatorApp />} />
        
        {/* Member View (Default) */}
        <Route path="/*" element={<MemberApp />} />
        
        {/* Catch all - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
