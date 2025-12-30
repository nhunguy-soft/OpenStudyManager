import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { BarChart2, Clock, TrendingUp } from 'lucide-react';
import { getStudySessions } from '../utils/storage';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

interface StudySession {
  date: string;
  durationMinutes: number;
  subject: string;
}

export default function Analytics() {
  const [studyTime, setStudyTime] = useState<StudySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudySessions() {
      try {
        const sessions = await getStudySessions();
        // Transform StorageStudySession to StudySession
        const transformedSessions = sessions.map(session => {
          const durationMatch = session.content.match(/Duration: (\d+) minutes/);
          const subjectMatch = session.content.match(/Subject: (.+?)(?:\n|$)/);
          return {
            date: format(new Date(session.created_at), 'yyyy-MM-dd'),
            durationMinutes: durationMatch ? parseInt(durationMatch[1]) : 0,
            subject: subjectMatch ? subjectMatch[1] : 'Unknown'
          };
        });
        setStudyTime(transformedSessions);
      } catch (error) {
        console.error('Error loading study sessions:', error);
        setError('Failed to load study data. Please try refreshing the page.');
        toast.error('Failed to load study data');
      } finally {
        setIsLoading(false);
      }
    }
    loadStudySessions();
  }, []);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const minutes = studyTime
      .filter(session => session.date === dateStr)
      .reduce((acc, session) => acc + session.durationMinutes, 0);
    
    return {
      date: format(date, 'MMM d'),
      minutes,
    };
  }).reverse();

  const totalMinutes = studyTime.reduce((acc, session) => acc + session.durationMinutes, 0);
  const averageMinutesPerDay = Math.round(totalMinutes / 7);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Clock size={20} />
            <h3>Total Study Time</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <TrendingUp size={20} />
            <h3>Daily Average</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {Math.floor(averageMinutesPerDay / 60)}h {averageMinutesPerDay % 60}m
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 size={20} className="text-gray-500" />
          <h2 className="text-lg font-semibold">Last 7 Days</h2>
        </div>
        <div className="h-64 flex items-end gap-4">
          {last7Days.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-indigo-100 rounded-t-lg relative group"
                style={{ 
                  height: `${(day.minutes / (Math.max(...last7Days.map(d => d.minutes)) || 1)) * 100}%`,
                  minHeight: '20px'
                }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {Math.floor(day.minutes / 60)}h {day.minutes % 60}m
                </div>
              </div>
              <span className="text-sm text-gray-500">{day.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}