import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import FeedbackModal from '../components/ui/FeedbackModal';
import Toast from '../components/ui/Toast';
import SkeletonLoader from '../components/ui/SkeletonLoader';

export default function Assessment() {
  const { day } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'info' | 'warn' | 'error' | 'success'>('info');
  const [timeLeft, setTimeLeft] = useState(1800);
  const [penalty, setPenalty] = useState(0);
  const [awayTime, setAwayTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [nextPenalty, setNextPenalty] = useState(10);
  const awayRef = useRef(0);
  const penaltyRef = useRef(0);
  const awayTimerRef = useRef<any>(null);
  const lessonId = useRef<string>('');

  // Disable right-click, copy, cut, paste, devtools shortcuts
  useEffect(() => {
    const noContext = (e: MouseEvent) => e.preventDefault();
    const noKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey && ['c','x','v','u'].includes(e.key.toLowerCase())) ||
          e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J'].includes(e.key))) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', noContext);
    document.addEventListener('keydown', noKeys);
    return () => {
      document.removeEventListener('contextmenu', noContext);
      document.removeEventListener('keydown', noKeys);
    };
  }, []);

  useEffect(() => {
    api.get(`/lessons/day/${day}`).then(({ data }) => {
      setLesson(data.lesson);
      lessonId.current = data.lesson._id;
      setTimeLeft(data.lesson.timeLimit || 1800);
      if (data.completed) navigate('/dashboard');
    }).catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [day]);

  // Countdown timer
  useEffect(() => {
    if (!lesson) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [lesson]);

  // Anti-cheat: visibility / focus
  const startAwayTimer = useCallback(() => {
    setShowWarning(true);
    setToast('⚠️ Warning! You left the assessment page. Penalty: -1 point every 10 seconds.');
    setToastType('warn');
    awayTimerRef.current = setInterval(() => {
      awayRef.current += 1;
      setAwayTime(awayRef.current);
      setNextPenalty(10 - (awayRef.current % 10));
      if (awayRef.current % 10 === 0) {
        penaltyRef.current += 1;
        setPenalty(penaltyRef.current);
        if (lessonId.current) {
          api.post('/penalty/log', { lessonId: lessonId.current, durationAway: awayRef.current, penaltyPoints: penaltyRef.current }).catch(() => {});
        }
      }
    }, 1000);
  }, []);

  const stopAwayTimer = useCallback(() => {
    clearInterval(awayTimerRef.current);
    setShowWarning(false);
    setToast(`✅ Welcome back! Penalty so far: ${penaltyRef.current} point(s).`);
    setToastType('info');
  }, []);

  useEffect(() => {
    const onHide = () => { if (document.hidden) startAwayTimer(); else stopAwayTimer(); };
    const onBlur = () => startAwayTimer();
    const onFocus = () => stopAwayTimer();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      clearInterval(awayTimerRef.current);
    };
  }, [startAwayTimer, stopAwayTimer]);

  // Auto-save every 30s
  useEffect(() => {
    const t = setInterval(() => {
      localStorage.setItem(`assessment_draft_${day}`, JSON.stringify(answers));
    }, 30000);
    return () => clearInterval(t);
  }, [answers, day]);

  const handleSubmit = async () => {
    if (submitting) return;
    stopAwayTimer();
    setSubmitting(true);
    try {
      const answersArr = lesson.questions.map((_: any, i: number) => ({ questionIndex: i, answer: answers[i] || '' }));
      const { data } = await api.post('/lessons/submit', {
        lessonId: lessonId.current,
        answers: answersArr,
        timeTaken: (lesson?.timeLimit || 1800) - timeLeft,
        penalty: penaltyRef.current,
      });
      setResult(data);
      setShowFeedback(true);
      localStorage.removeItem(`assessment_draft_${day}`);
    } catch (err: any) {
      setToast(err.response?.data?.message || 'Submission failed');
      setToastType('error');
    } finally { setSubmitting(false); }
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (loading) return <SkeletonLoader rows={5} />;
  if (!lesson) return null;

  return (
    <div className='max-w-3xl mx-auto space-y-6 animate-fade-in' onContextMenu={e => e.preventDefault()}>
      {/* Header */}
      <div className='glass-card p-5'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
          <div>
            <span className='badge-green mb-1 inline-block'>📅 Day {day}</span>
            <h1 className='font-display text-2xl font-bold text-slate-800'>{lesson.topic}</h1>
            <p className='text-sm text-slate-400 mt-1'>Difficulty: {lesson.difficulty} • {lesson.questions.length} Questions</p>
          </div>
          <div className='flex flex-col items-end gap-2'>
            <div className={`text-2xl font-mono font-bold px-4 py-2 rounded-2xl ${
              timeLeft < 120 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-emerald-100 text-emerald-700'
            }`}>
              ⏱ {fmt(timeLeft)}
            </div>
            {penalty > 0 && (
              <span className='badge badge-gold'>⚠️ Penalty: -{penalty} pts</span>
            )}
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {showWarning && (
        <div className='bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 animate-pulse-slow'>
          <p className='text-amber-800 font-semibold text-sm'>
            ⚠️ Warning! You have left the assessment page. A penalty of 1 point will be deducted every 10 seconds until you return.
          </p>
          <p className='text-amber-600 text-xs mt-1'>Next penalty in {nextPenalty}s • Total away: {awayTime}s • Current penalty: {penaltyRef.current} pts</p>
        </div>
      )}

      {/* Lesson Content */}
      <div className='glass-card p-6'>
        <h2 className='font-display font-bold text-lg text-emerald-700 mb-2'>📖 {lesson.topic}</h2>
        <p className='text-slate-600 leading-relaxed mb-4'>{lesson.explanation}</p>
        {lesson.rules?.length > 0 && (
          <div className='mb-4'>
            <h3 className='font-semibold text-slate-700 mb-2'>📌 Rules</h3>
            <ul className='space-y-1'>{lesson.rules.map((r: string, i: number) => (
              <li key={i} className='flex gap-2 text-sm text-slate-600'><span className='text-emerald-500'>▸</span>{r}</li>
            ))}</ul>
          </div>
        )}
        {lesson.examples?.length > 0 && (
          <div className='mb-4'>
            <h3 className='font-semibold text-slate-700 mb-2'>💡 Examples</h3>
            <div className='space-y-1'>{lesson.examples.map((ex: string, i: number) => (
              <div key={i} className='px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 italic'>{ex}</div>
            ))}</div>
          </div>
        )}
        {lesson.commonMistakes?.length > 0 && (
          <div>
            <h3 className='font-semibold text-slate-700 mb-2'>⚠️ Common Mistakes</h3>
            <ul className='space-y-1'>{lesson.commonMistakes.map((m: string, i: number) => (
              <li key={i} className='flex gap-2 text-sm text-rose-600'><span>✗</span>{m}</li>
            ))}</ul>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className='space-y-4'>
        {lesson.questions.map((q: any, i: number) => (
          <div key={i} className={`glass-card p-5 border-l-4 transition-all duration-200 ${
            answers[i] ? 'border-emerald-400' : 'border-slate-200'
          }`}>
            <div className='flex items-start gap-3 mb-3'>
              <span className='w-7 h-7 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0'>{i + 1}</span>
              <div>
                <span className='text-xs text-slate-400 uppercase tracking-wide'>
                  {q.type === 'mcq' ? 'Multiple Choice' : q.type === 'fill' ? 'Fill in the Blank' : q.type === 'transform' ? 'Sentence Transformation' : 'Error Correction'}
                </span>
                <p className='font-medium text-slate-800 mt-0.5'>{q.question}</p>
              </div>
            </div>

            {q.type === 'mcq' && q.options ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 ml-10'>
                {q.options.map((opt: string, j: number) => (
                  <button key={j} type='button'
                    onClick={() => setAnswers({ ...answers, [i]: opt })}
                    className={`px-4 py-2.5 rounded-2xl border-2 text-sm font-medium text-left transition-all duration-200 hover:scale-[1.02] ${
                      answers[i] === opt
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
                    }`}>
                    <span className='w-5 h-5 inline-flex items-center justify-center rounded-full border mr-2 text-xs
                      ${answers[i] === opt ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"}'>
                      {String.fromCharCode(65 + j)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <input type='text'
                className='input-field ml-10 mt-1'
                placeholder='Type your answer here...'
                value={answers[i] || ''}
                onChange={e => setAnswers({ ...answers, [i]: e.target.value })}
                onCopy={e => e.preventDefault()}
                onPaste={e => e.preventDefault()} />
            )}
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className='glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='text-sm text-slate-500'>
          ✍️ {Object.keys(answers).length} / {lesson.questions.length} answered
          {penalty > 0 && <span className='ml-3 text-amber-600'>⚠️ Current penalty: {penalty} pts</span>}
        </div>
        <button onClick={handleSubmit} disabled={submitting} className='btn-primary disabled:opacity-60'>
          {submitting ? '⏳ Submitting...' : '✅ Submit Assessment'}
        </button>
      </div>

      {/* Feedback Modal */}
      {showFeedback && result && (
        <FeedbackModal
          type={result.isSuccessful ? 'success' : 'failure'}
          score={result.finalScore}
          maxScore={lesson.questions.length * 2}
          onClose={() => { setShowFeedback(false); navigate('/dashboard'); }}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} type={toastType} onClose={() => setToast('')} />}
    </div>
  );
}
