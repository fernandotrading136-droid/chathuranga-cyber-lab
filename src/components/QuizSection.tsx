import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  HelpCircle,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/cyberData';
import { playCorrect, playWrong } from '../utils/soundEffects';

interface QuizSectionProps {
  onScoreChange: (score: number, completed: boolean) => void;
}

export function QuizSection({ onScoreChange }: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const selectedOptionId = selectedAnswers[currentQuestion.id];
  const isSubmitted = Boolean(submittedQuestions[currentQuestion.id]);
  const isCorrect = selectedOptionId === currentQuestion.correctOptionId;

  const computeScore = (
    answers: Record<number, string>,
    submitted: Record<number, boolean>
  ) => {
    return QUIZ_QUESTIONS.reduce((acc, q) => {
      if (submitted[q.id] && answers[q.id] === q.correctOptionId) {
        return acc + 1;
      }
      return acc;
    }, 0);
  };

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    if (optionId === currentQuestion.correctOptionId) {
      playCorrect();
    } else {
      playWrong();
    }
    const nextAnswers = { ...selectedAnswers, [currentQuestion.id]: optionId };
    const nextSubmitted = { ...submittedQuestions, [currentQuestion.id]: true };
    setSelectedAnswers(nextAnswers);
    setSubmittedQuestions(nextSubmitted);

    const newScore = computeScore(nextAnswers, nextSubmitted);
    const allAnswered =
      Object.keys(nextSubmitted).length === QUIZ_QUESTIONS.length;
    onScoreChange(newScore, allAnswered);
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmittedQuestions({});
    setShowSummary(false);
    onScoreChange(0, false);
  };

  const totalScore = computeScore(selectedAnswers, submittedQuestions);

  const getRankFeedback = (score: number) => {
    if (score === 5) {
      return {
        rank: 'CYBER GUARDIAN (5/5)',
        messageSi: 'විශිෂ්ටයි! ඔබ සයිබර් ආරක්ෂාවේ මූලික පාඩම් සියල්ල නිවැරදිව ප්‍රගුණ කර ඇත.',
      };
    }
    if (score >= 3) {
      return {
        rank: 'JUNIOR ANALYST',
        messageSi: 'හොඳයි! ඔබට හොඳ මූලික දැනුමක් ඇත. Cyber Words ශබ්දකෝෂය කියවා නැවත උත්සාහ කරන්න.',
      };
    }
    return {
      rank: 'CYBER BEGINNER',
      messageSi: 'ආරම්භය සුබයි! පහත Cyber Words කියවා නැවත Quiz එක කර බලන්න.',
    };
  };

  const rankInfo = getRankFeedback(totalScore);

  return (
    <section
      id="quiz-section"
      aria-labelledby="quiz-heading"
      className="rounded-lg border border-[#00f0ff]/25 bg-[#070c10] p-4 sm:p-6"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#142630] pb-4">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="h-5 w-5 text-[#00ff66]" aria-hidden="true" />
          <div>
            <h2
              id="quiz-heading"
              className="font-display text-lg sm:text-xl font-bold text-[#e8f6fc]"
            >
              Session 1 Cyber Security Quiz (සිංහල ප්‍රශ්න 5)
            </h2>
            <p className="text-xs sm:text-sm text-[#8bb1c2]">
              නිවැරදි පිළිතුර තෝරා ක්ෂණිකව පැහැදිලි කිරීම බලන්න.
            </p>
          </div>
        </div>

        <div className="font-mono-tech text-xs text-[#00f0ff] tabular-nums">
          {showSummary
            ? `FINAL SCORE: ${totalScore}/${QUIZ_QUESTIONS.length}`
            : `QUESTION ${currentIndex + 1} / ${QUIZ_QUESTIONS.length}`}
        </div>
      </div>

      {/* Step Progress Bar */}
      <div
        className="mt-4 grid grid-cols-5 gap-2"
        aria-label="Quiz progress"
      >
        {QUIZ_QUESTIONS.map((q, idx) => {
          const answered = submittedQuestions[q.id];
          const correct = selectedAnswers[q.id] === q.correctOptionId;
          let barClass = 'bg-[#12242e]';
          if (answered) {
            barClass = correct ? 'bg-[#00ff66]' : 'bg-[#ff4d6d]';
          } else if (idx === currentIndex && !showSummary) {
            barClass = 'bg-[#00f0ff]';
          }
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setShowSummary(false);
                setCurrentIndex(idx);
              }}
              aria-label={`Jump to question ${idx + 1}`}
              className={`h-2 rounded-sm transition-colors cursor-pointer ${barClass}`}
            />
          );
        })}
      </div>

      {showSummary ? (
        <div className="mt-6 rounded-md border border-[#00ff66]/30 bg-[#04080b] p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66]">
                <Award className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="font-mono-tech text-xs font-semibold text-[#00f0ff]">
                  RESULT: {rankInfo.rank}
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-[#e8f6fc] tabular-nums">
                  Your Score: {totalScore} / {QUIZ_QUESTIONS.length}
                </h3>
                <p className="mt-1.5 text-sm text-[#c0dce8] leading-relaxed">
                  {rankInfo.messageSi}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRestart}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-md bg-[#00ff66] px-5 py-2.5 font-mono-tech text-sm font-bold text-[#031208] hover:bg-[#26ff80] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Retake Quiz</span>
            </button>
          </div>

          {/* Review Breakdown */}
          <div className="mt-6 space-y-2.5 border-t border-[#142630] pt-4">
            <h4 className="font-mono-tech text-xs font-semibold text-[#8bb1c2]">
              ANSWER BREAKDOWN
            </h4>
            {QUIZ_QUESTIONS.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const ok = userAns === q.correctOptionId;
              const correctLabel = q.options.find(
                (o) => o.id === q.correctOptionId
              )?.labelSi;
              return (
                <div
                  key={q.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded border border-[#12242e] bg-[#070c10] px-3.5 py-2.5 text-xs"
                >
                  <div className="flex items-start gap-2">
                    {ok ? (
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#00ff66]"
                        aria-hidden="true"
                      />
                    ) : (
                      <XCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d6d]"
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-[#dceff7]">
                      Q{idx + 1}. {q.topic}
                    </span>
                  </div>
                  <span
                    className={`font-mono-tech shrink-0 ${
                      ok ? 'text-[#00ff66]' : 'text-[#00f0ff]'
                    }`}
                  >
                    Correct: {correctLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-5">
          {/* Question Topic & Text */}
          <div className="font-mono-tech text-xs text-[#00f0ff]">
            TOPIC: {currentQuestion.topic}
          </div>
          <h3 className="mt-2 text-base sm:text-lg font-semibold text-[#eef8fc] leading-relaxed">
            {currentIndex + 1}. {currentQuestion.questionSi}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#7ea3b5]">
            {currentQuestion.questionHintEn}
          </p>

          {/* Multiple Choice Options */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isRightOption = opt.id === currentQuestion.correctOptionId;

              let optionStyle =
                'border-[#183240] bg-[#040709] text-[#d6ecf5] hover:border-[#00f0ff]/60 hover:bg-[#0a1720]';

              if (isSubmitted) {
                if (isRightOption) {
                  optionStyle =
                    'border-[#00ff66] bg-[#00ff66]/15 text-[#eafff2]';
                } else if (isSelected && !isRightOption) {
                  optionStyle =
                    'border-[#ff4d6d] bg-[#ff4d6d]/15 text-[#ffe6eb]';
                } else {
                  optionStyle =
                    'border-[#11222c] bg-[#040709] text-[#6d8c9c] opacity-75';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`min-h-[52px] flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm sm:text-base transition-colors cursor-pointer disabled:cursor-default focus-visible:outline-2 focus-visible:outline-[#00f0ff] ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono-tech text-xs font-bold uppercase text-[#00f0ff]">
                      [{opt.id}]
                    </span>
                    <span>{opt.labelSi}</span>
                  </div>
                  {isSubmitted && isRightOption && (
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 text-[#00ff66]"
                      aria-hidden="true"
                    />
                  )}
                  {isSubmitted && isSelected && !isRightOption && (
                    <XCircle
                      className="h-5 w-5 shrink-0 text-[#ff4d6d]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Feedback & Next Button */}
          {isSubmitted && (
            <div className="mt-4 rounded-md border border-[#183442] bg-[#04080b] p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p
                    className={`font-mono-tech text-xs font-bold ${
                      isCorrect ? 'text-[#00ff66]' : 'text-[#ff4d6d]'
                    }`}
                  >
                    {isCorrect
                      ? 'CORRECT ANSWER (නිවැරදියි)'
                      : 'INCORRECT (වැරදියි) — නිවැරදි පැහැදිලි කිරීම පහතින්:'}
                  </p>
                  <p className="mt-1.5 text-sm text-[#d9eef7] leading-relaxed">
                    {currentQuestion.explanationSi}
                  </p>
                  <p className="mt-1 text-xs text-[#89aebf]">
                    {currentQuestion.explanationEn}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-md bg-[#00f0ff] px-5 py-2.5 font-mono-tech text-sm font-bold text-[#031318] hover:bg-[#3df5ff] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <span>
                    {currentIndex === QUIZ_QUESTIONS.length - 1
                      ? 'View Final Score'
                      : 'Next Question'}
                  </span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
