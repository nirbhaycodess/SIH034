import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NewInspection } from './pages/NewInspection';
import { InspectionResult } from './pages/InspectionResult';
import { InspectionHistory } from './pages/InspectionHistory';
import { ProductRepository } from './pages/ProductRepository';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';
function Shell() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <Header onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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
  );
}
