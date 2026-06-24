import { deleteTask } from '../../api/tasks';

/* ── SVG Action Icons ── */
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4l5 5M3 16l1-4L14 2a2 2 0 012.83 0l1.17 1.17A2 2 0 0118 5.17L8 15l-4 1z"/>
  </svg>
);

const IconDelete = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h14M8 6V4a1 1 0 011-1h2a1 1 0 011 1v2M17 6l-1 12a2 2 0 01-2 2H6a2 2 0 01-2-2L3 6M9 10v5M11 10v5"/>
  </svg>
);

/* ── Avatar color map ── */
const AVATAR_COLORS = [
  'linear-gradient(135deg,#3B82F6,#2563EB)',
  'linear-gradient(135deg,#8B5CF6,#7C3AED)',
  'linear-gradient(135deg,#10B981,#059669)',
  'linear-gradient(135deg,#F59E0B,#D97706)',
];
const getAvatarGradient = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ── Date formatter ── */
const fmtDate = (raw) => {
  if (!raw) return '—';
  try {
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return raw; }
};

/* ── Status badge class ── */
const STATUS_CLASS = {
  Open:      'status-badge-Open',
  Claimed:   'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved:  'status-badge-Approved',
  Rejected:  'status-badge-Rejected',
};

const TasksTable = ({ tasks, onEdit, onRefresh }) => {

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      onRefresh();
    } catch {
      alert('Failed to delete task');
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="py-20 text-center" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          style={{ margin: '0 auto 12px', opacity: 0.3 }} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <path d="M9 12h6M9 8h6M9 16h4"/>
        </svg>
        No tasks yet. Create your first task above.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse" style={{ fontSize: '13.5px' }}>
        <thead>
          <tr>
            <th className="table-th">Title</th>
            <th className="table-th">Status</th>
            <th className="table-th">Assigned To</th>
            <th className="table-th">Due Date</th>
            <th className="table-th">Created</th>
            <th className="table-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, i) => (
            <tr key={task._id}
              className="table-row table-row-animate"
              style={{ animationDelay: `${i * 0.05}s` }}>

              {/* Title + description */}
              <td className="table-td" style={{ maxWidth: '260px' }}>
                <span className="block font-semibold truncate"
                  style={{ color: '#E5E2E1', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>
                  {task.title || '—'}
                </span>
                {task.description && (
                  <span className="block truncate" style={{ color: '#4B5563', fontSize: '12px', maxWidth: '240px' }}>
                    {task.description}
                  </span>
                )}
              </td>

              {/* Status badge */}
              <td className="table-td">
                <span className={`inline-block px-2.5 py-[3px] rounded-full text-[11.5px] font-medium ${STATUS_CLASS[task.status] || 'status-badge-Open'}`}
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {task.status || '—'}
                </span>
              </td>

              {/* Assigned to */}
              <td className="table-td" style={{ whiteSpace: 'nowrap' }}>
                {task.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                      style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: getAvatarGradient(task.assignedTo.name || ''),
                        fontFamily: 'Inter, sans-serif',
                      }}>
                      {task.assignedTo.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ color: '#E5E2E1' }}>{task.assignedTo.name}</span>
                  </div>
                ) : (
                  <span style={{ color: '#4B5563', fontSize: '13px' }}>Unassigned</span>
                )}
              </td>

              {/* Due date */}
              <td className="table-td" style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>
                {fmtDate(task.dueDate)}
              </td>

              {/* Created */}
              <td className="table-td" style={{ color: '#4B5563', whiteSpace: 'nowrap', fontSize: '12.5px' }}>
                {fmtDate(task.createdAt)}
              </td>

              {/* Actions */}
              <td className="table-td">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onEdit(task)}
                    title="Edit task"
                    className="action-btn action-btn-edit">
                    <IconEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    title="Delete task"
                    className="action-btn action-btn-delete">
                    <IconDelete />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksTable;
