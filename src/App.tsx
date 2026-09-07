import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { NewInspection } from './pages/NewInspection';
import { InspectionResult } from './pages/InspectionResult';
import { InspectionHistory } from './pages/InspectionHistory';
import { ProductRepository } from './pages/ProductRepository';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';
import { ToastProvider } from './context/ToastContext';

function Shell() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col lg:pl-64">
        <Header onMenu={() => setOpen(true)} />
        <main className="flex-1 mx-auto w-full max-w-[1560px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Shell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inspection/new" element={<NewInspection />} />
          <Route path="/inspection/:id" element={<InspectionResult />} />
          <Route path="/inspections" element={<InspectionHistory />} />
          <Route path="/products" element={<ProductRepository />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider>
  );
}
