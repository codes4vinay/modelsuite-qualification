import { useState } from 'react';
import SubmitTaskModal from './SubmitTaskModal';

/* ── Status badge classes ── */
const STATUS_CLASS = {
  Open:      'status-badge-Open',
  Claimed:   'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved:  'status-badge-Approved',
  Rejected:  'status-badge-Rejected',
  Pending:   'status-badge-Submitted',
  'Revision Requested': 'status-badge-RevisionRequested',
};

/* ── Calendar icon ── */
const IconCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="14" height="14" rx="2"/>
    <path d="M7 2v4M13 2v4M3 9h14"/>
  </svg>
);

/* ── Upload icon ── */
const IconUpload = () => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 14V4M6 8l4-4 4 4"/>
    <path d="M3 17h14"/>
  </svg>
);

const fmtDate = (raw) => {
  if (!raw) return null;
  try {
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return raw; }
};

const MyTasksList = ({ tasks, onRefresh }) => {
  const [submitTarget, setSubmitTarget] = useState(null);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="py-12 px-6 text-center rounded-xl"
        style={{
          background: 'rgba(255,255,255,0.015)',
          border: '1px dashed rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
        }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          style={{ margin: '0 auto 10px', opacity: 0.3 }} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        You haven&apos;t claimed any tasks yet. Go grab one above!
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {tasks.map((task, i) => {
          const displayStatus = ['Approved', 'Rejected', 'Revision Requested'].includes(task.submissionReviewStatus)
            ? task.submissionReviewStatus
            : task.status;

          return (
          <div key={task._id}
            className="task-card table-row-animate"
            style={{ animationDelay: `${i * 0.06}s` }}>

            {/* Task info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate mb-0.5"
                style={{ fontSize: '13.5px', color: '#E5E2E1', fontFamily: 'Inter, sans-serif' }}>
                {task.title || 'Untitled Task'}
              </p>
              {fmtDate(task.dueDate) && (
                <p className="flex items-center gap-1.5 text-[11.5px]" style={{ color: '#4B5563' }}>
                  <IconCalendar />
                  Due {fmtDate(task.dueDate)}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {(task.status === 'Claimed' || task.status === 'Submitted') && (
                <button
                  onClick={() => setSubmitTarget(task)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer border transition-all"
                  style={{
                    background: 'rgba(59,130,246,0.08)',
                    color: '#60A5FA',
                    borderColor: 'rgba(59,130,246,0.25)',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(59,130,246,0.16)';
                    e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(59,130,246,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)';
                  }}>
                  <IconUpload />
                  {task.submissionReviewStatus === 'Revision Requested' || task.status === 'Submitted' ? 'Re-submit' : 'Submit'}
                </button>
              )}

              {displayStatus ? (
                <span
                  className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-medium ${STATUS_CLASS[displayStatus] || ''}`}
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {displayStatus}
                </span>
              ) : (
                <span
                  className="inline-block px-2.5 py-[3px] rounded-full text-[11px] font-medium status-badge-Open"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  —
                </span>
              )}
            </div>
          </div>
          );
        })}
      </div>

      {submitTarget && (
        <SubmitTaskModal
          task={submitTarget}
          onClose={() => setSubmitTarget(null)}
          onSubmitted={() => { setSubmitTarget(null); if (onRefresh) onRefresh(); }}
        />
      )}
    </>
  );
};

export default MyTasksList;
