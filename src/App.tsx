import { useState } from 'react';
import { Header } from './components/Header';
import { HackerDashboard } from './components/HackerDashboard';
import { HackDefenseLessonPage } from './components/HackDefenseLessonPage';
import { StopWorldAttackLessonPage } from './components/StopWorldAttackLessonPage';
import { TerminalBox } from './components/TerminalBox';
import { DownloadBox } from './components/DownloadBox';
import { QuizSection } from './components/QuizSection';
import { DictionarySection } from './components/DictionarySection';
import { CyberGuruAI } from './components/CyberGuruAI';
import { QUIZ_QUESTIONS } from './data/cyberData';

export default function App() {
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [activeLesson, setActiveLesson] = useState<
    'none' | 'hack-eken-berena-vidiya' | 'stop-world-attack'
  >('none');
  const [hackLessonCompleted, setHackLessonCompleted] = useState(false);
  const [worldAttackCompleted, setWorldAttackCompleted] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveLesson('none');
    window.setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 30);
  };

  const handleScoreChange = (nextScore: number, completed: boolean) => {
    setScore(nextScore);
    setQuizCompleted(completed);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05080a] text-[#e2f1f8]">
      <Header
        score={score}
        totalQuestions={QUIZ_QUESTIONS.length}
        activeModeLabel="QUIZ MODE"
        onNavigate={scrollToSection}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {activeLesson === 'hack-eken-berena-vidiya' ? (
          <HackDefenseLessonPage
            onBack={() => setActiveLesson('none')}
            onComplete={() => setHackLessonCompleted(true)}
          />
        ) : activeLesson === 'stop-world-attack' ? (
          <StopWorldAttackLessonPage
            onBack={() => setActiveLesson('none')}
            onComplete={() => setWorldAttackCompleted(true)}
          />
        ) : (
          <>
            {/* Hacker Dashboard Section below header */}
            <HackerDashboard
              onJumpToQuiz={() => scrollToSection('quiz-section')}
              onJumpToDictionary={() => scrollToSection('dictionary-section')}
              onOpenHackLesson={() => {
                setActiveLesson('hack-eken-berena-vidiya');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              hackLessonCompleted={hackLessonCompleted}
              onOpenWorldAttackLesson={() => {
                setActiveLesson('stop-world-attack');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              worldAttackCompleted={worldAttackCompleted}
            />

            {/* Interactive Cyber Guru AI Teacher */}
            <CyberGuruAI />

        {/* Dual Console: Left TERMINAL + Right DOWNLOAD DATA */}
        <div
          id="lab-console"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
        >
          <TerminalBox
            onEnterSystem={() => scrollToSection('quiz-section')}
            onJumpDictionary={() => scrollToSection('dictionary-section')}
            quizScore={score}
            quizCompleted={quizCompleted}
          />
          <DownloadBox />
        </div>

        {/* 5-Question Sinhala Cyber Security Quiz */}
        <QuizSection onScoreChange={handleScoreChange} />

            {/* Beginner Cyber Words Dictionary */}
            <DictionarySection />
          </>
        )}
      </main>

      <footer className="border-t border-[#10222c] bg-[#040709] py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7396a8]">
          <p className="font-mono-tech">
            CHATHURANGA CYBER LAB · Learn Cyber Security in Sinhala &amp; English Free
          </p>
          <p>
            Educational &amp; Defensive Awareness Platform — Start from Zero
          </p>
        </div>
      </footer>
    </div>
  );
}
