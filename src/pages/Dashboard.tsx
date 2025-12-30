import { useState, useEffect } from 'react';
import { StudySession, StudyStreak, Subject } from '../types';
import PomodoroTimer from '../components/PomodoroTimer';
import StudyStreakComponent from '../components/StudyStreak';
import FocusMode from '../components/FocusMode';
import LoadingSpinner from '../components/LoadingSpinner';
import { GraduationCap } from 'lucide-react';
import { getFromStorage, setToStorage } from '../utils/storage';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studyTime, setStudyTime] = useState<StudySession[]>([]);
  const [isStudyActive, setIsStudyActive] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [streak, setStreak] = useState<StudyStreak>({
    currentStreak: 0,
    bestStreak: 0,
    lastStudyDate: new Date().toISOString()
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSubjects, loadedStudyTime, loadedStreak] = await Promise.all([
          getFromStorage<Subject[]>('subjects', []),
          getFromStorage<StudySession[]>('studyTime', []),
          getFromStorage<StudyStreak>('streak', {
            currentStreak: 0,
            bestStreak: 0,
            lastStudyDate: new Date().toISOString()
          })
        ]);

        setSubjects(loadedSubjects || []);
        setStudyTime(loadedStudyTime || []);
        setStreak(loadedStreak);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Failed to load data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setToStorage('studyTime', studyTime).catch(console.error);
    }
  }, [studyTime, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setToStorage('streak', streak).catch(console.error);
    }
  }, [streak, isLoading]);

  const handleStudySessionComplete = (minutes: number) => {
    if (minutes <= 0) {
      console.error('Invalid study session duration');
      return;
    }

    try {
      const newSession: StudySession = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        durationMinutes: minutes,
        subject: selectedSubject || 'General',
      };
      setStudyTime(prev => [...prev, newSession]);
      
      // Update streak
      const today = new Date();
      const lastStudy = new Date(streak.lastStudyDate);
      
      today.setHours(0, 0, 0, 0);
      lastStudy.setHours(0, 0, 0, 0);
      
      const timeDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
      
      if (timeDiff <= 1) {
        if (timeDiff === 1 || (timeDiff === 0 && streak.currentStreak === 0)) {
          setStreak(prev => ({
            currentStreak: prev.currentStreak + 1,
            bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
            lastStudyDate: today.toISOString()
          }));
        }
      } else {
        setStreak({
          currentStreak: 1,
          bestStreak: streak.bestStreak,
          lastStudyDate: today.toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to handle study session completion:', error);
    } finally {
      setIsStudyActive(false);
      setSelectedSubject('');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-indigo-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <FocusMode isStudyActive={isStudyActive} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <StudyStreakComponent
            streak={streak}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
              aria-label="Select study subject"
            >
              <option value="">General Study</option>
              {subjects?.map(subject => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            <PomodoroTimer 
              onSessionComplete={handleStudySessionComplete}
              onStart={() => setIsStudyActive(true)}
              onStop={() => setIsStudyActive(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}