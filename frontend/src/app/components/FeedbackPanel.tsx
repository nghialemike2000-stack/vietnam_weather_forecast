import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

export function FeedbackPanel() {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (feedback) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFeedback(null);
        setComment('');
      }, 3000);
    }
  };

  return (
    <div className="border border-border bg-card p-6">
      <h3 className="text-sm text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
        <MessageSquare className="w-4 h-4" />
        PREDICTION FEEDBACK
      </h3>

      {submitted ? (
        <div className="bg-[var(--weather-green)]/20 border border-[var(--weather-green)] p-4 text-center">
          <p className="text-[var(--weather-green)]" style={{ fontFamily: 'var(--font-mono)' }}>
            ✓ FEEDBACK RECEIVED - THANK YOU
          </p>
        </div>
      ) : (
        <div>
          <p className="text-sm mb-4" style={{ fontFamily: 'var(--font-body)' }}>
            Was this prediction accurate?
          </p>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setFeedback('yes')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border transition-all duration-300 ${
                feedback === 'yes'
                  ? 'border-[var(--weather-green)] bg-[var(--weather-green)]/20 text-[var(--weather-green)]'
                  : 'border-border bg-secondary/30 text-foreground hover:border-primary/50'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <ThumbsUp className="w-4 h-4" />
              YES
            </button>
            <button
              onClick={() => setFeedback('no')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border transition-all duration-300 ${
                feedback === 'no'
                  ? 'border-[var(--weather-red)] bg-[var(--weather-red)]/20 text-[var(--weather-red)]'
                  : 'border-border bg-secondary/30 text-foreground hover:border-primary/50'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <ThumbsDown className="w-4 h-4" />
              NO
            </button>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional comment..."
            className="w-full bg-input-background border border-border px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors resize-none mb-4"
            rows={3}
            style={{ fontFamily: 'var(--font-body)' }}
          />

          <button
            onClick={handleSubmit}
            disabled={!feedback}
            className={`w-full py-3 text-sm transition-all duration-300 border ${
              feedback
                ? 'bg-primary text-primary-foreground border-primary hover:shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                : 'bg-secondary/30 text-muted-foreground border-border cursor-not-allowed'
            }`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            SUBMIT FEEDBACK
          </button>
        </div>
      )}
    </div>
  );
}
