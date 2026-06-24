import { useEffect, useState } from 'react';
import TalentSidebar from '../../components/talent/TalentSidebar';
import AvailableTasksList from '../../components/talent/AvailableTasksList';
import MyTasksList from '../../components/talent/MyTasksList';
import { fetchAvailableTasks, fetchMyTasks } from '../../api/talent';
import { useAuth } from '../../context/AuthContext';

/* ── Wave emoji stripped, use clean greeting ── */

const TalentDashboard = () => {
  const { user } = useAuth();
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks]               = useState([]);
  const [error, setError] = useState(null);

  const loadAvailable = async () => {
    try { const { data } = await fetchAvailableTasks(); setAvailableTasks(data); }
    catch { setError('Failed to load available tasks'); }
  };

  const loadMyTasks = async () => {
    try { const { data } = await fetchMyTasks(); setMyTasks(data); }
    catch { setError('Failed to load your tasks'); }
  };

  useEffect(() => { loadAvailable(); loadMyTasks(); }, []);
  const handleRefresh = () => { loadAvailable(); loadMyTasks(); };

  return (
    <div className="flex min-h-screen" style={{ background: '#050505' }}>
      <TalentSidebar />

      <main className="ml-[220px] flex-1 px-8 py-8" style={{ maxWidth: 'calc(100vw - 220px)' }}>

        {/* Header */}
        <div className="mb-7 page-section">
          <h1 className="text-[22px] font-semibold tracking-tight"
            style={{ color: '#F0F0F0', fontFamily: 'Poppins, sans-serif' }}>
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#6B7280' }}>
            Browse available tasks below and claim one to get started.
          </p>
        </div>

        {error && (
          <p className="text-[13px] mb-4 px-4 py-3 rounded-lg"
            style={{ color: '#F87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </p>
        )}

        {/* Available Tasks */}
        <section className="mb-7 page-section">
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>
              Available Tasks
            </h2>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#6B7280',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
              {availableTasks.length}
            </span>
          </div>
          <AvailableTasksList tasks={availableTasks} onClaimed={handleRefresh} />
        </section>

        {/* My Tasks */}
        <section className="mb-7 page-section">
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>
              My Tasks
            </h2>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#6B7280',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
              {myTasks.length}
            </span>
          </div>
          <MyTasksList tasks={myTasks} onRefresh={handleRefresh} />
        </section>
      </main>
    </div>
  );
};

export default TalentDashboard;
