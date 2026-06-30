import { reviewSubmission } from '../../api/submissions';

const REVIEW_STATUS_CLASS = {
  Pending:              'status-badge-Submitted',
  Approved:             'status-badge-Approved',
  Rejected:             'status-badge-Rejected',
  'Revision Requested': 'status-badge-RevisionRequested',
};

const SubmissionReviewModal = ({ submission, onClose, onReviewed }) => {

  const handleReview = async (status) => {
    try {
      await reviewSubmission(submission._id, status);
      onReviewed();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Review action failed');
    }
  };

  const task   = submission.taskId   || {};
  const talent = submission.talentId || {};

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-[200] p-6"
      onClick={onClose}>
      <div className="bg-bg-card border border-border rounded-xl w-full max-w-lg shadow-[0_32px_80px_rgba(0,0,0,0.6)] animate-modal-in"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-[17px] font-semibold text-text-primary">Review Submission</h2>
          <button onClick={onClose}
            className="bg-transparent border-none text-text-muted text-base cursor-pointer px-2 py-1 rounded-md hover:bg-bg-hover hover:text-text-primary transition-all">
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">

          {/* Task info */}
          <div className="bg-bg-surface rounded-lg px-4 py-3.5 border border-border">
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-text-faint mb-1.5">Task</p>
            <p className="text-[15px] font-semibold text-text-primary">{task.title || '—'}</p>
            <div className="flex items-center gap-3 mt-2">
              {task.dueDate && (
                <span className="text-[12px] text-text-faint">Due: {task.dueDate}</span>
              )}
              
              {task.status && (
                <span className={`inline-block px-2 py-[2px] rounded-full text-[11px] font-medium status-badge-${task.status}`}>
                  {task.status}
                </span>
              )}
            </div>
          </div>

          {/* Talent info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full avatar-talent flex items-center justify-center text-[13px] font-bold text-white shrink-0">
              {talent.name?.[0] ?? 'T'}
            </div>
            <div>
              <p className="text-[14px] font-medium text-text-primary">{talent.name || 'Unknown Talent'}</p>
              <p className="text-[12px] text-text-faint">{talent.email || '—'}</p>
            </div>
            <div className="ml-auto">
              <span className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold ${REVIEW_STATUS_CLASS[submission.reviewStatus] || 'status-badge-Submitted'}`}>
                {submission.reviewStatus || 'Pending'}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-text-faint mb-2">Notes</p>
            {submission.notes ? (
              <p className="text-[14px] text-text-muted leading-relaxed bg-bg-surface rounded-lg px-4 py-3 border border-border">
                {submission.notes}
              </p>
            ) : (
              <p className="text-[13px] text-text-faint italic">No notes provided.</p>
            )}
          </div>

          {/* File */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-text-faint mb-2">Submitted File</p>
            {submission.fileUrl ? (
              <a href={submission.fileUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-2.5 text-[13px] text-primary font-medium hover:text-secondary transition-colors">
                <span className="text-base">📎</span>
                
                <span className="underline underline-offset-2 truncate">{submission.fileUrl}</span>
                <span className="text-text-faint text-[11px] shrink-0">↗ open</span>
              </a>
            ) : (
              <p className="text-[13px] text-text-faint italic">No file attached.</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-1 border-t border-border mt-1">
            <button onClick={onClose}
              className="flex-1 min-w-[120px] py-2.5 bg-bg-input text-text-muted border border-border rounded-lg text-sm font-medium cursor-pointer hover:bg-bg-hover hover:text-text-primary transition-all font-sans">
              Cancel
            </button>
            <button onClick={() => handleReview('Revision Requested')}
              className="flex-1 min-w-[120px] py-2.5 bg-warning/10 text-warning border border-warning/30 rounded-lg text-sm font-semibold cursor-pointer hover:bg-warning/20 transition-all font-sans">
              Request Revision
            </button>
            <button onClick={() => handleReview('Rejected')}
              className="flex-1 min-w-[120px] py-2.5 bg-danger/10 text-danger border border-danger/30 rounded-lg text-sm font-semibold cursor-pointer hover:bg-danger/20 transition-all font-sans">
              ✕ Reject
            </button>
            <button onClick={() => handleReview('Approved')}
              className="flex-1 min-w-[120px] py-2.5 bg-success/10 text-success border border-success/30 rounded-lg text-sm font-semibold cursor-pointer hover:bg-success/20 transition-all font-sans">
              ✓ Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionReviewModal;
