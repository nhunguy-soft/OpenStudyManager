import { StudyStreak } from '../types';
import { Flame, Award, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface StudyStreakProps {
  streak: StudyStreak;
}

export default function StudyStreakComponent({ streak }: StudyStreakProps) {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="text-yellow-300" size={24} />
        <h3 className="text-xl font-semibold">Study Streak</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-orange-200" />
            <div className="text-sm text-orange-200">Current Streak</div>
          </div>
          <div className="text-4xl font-bold">{streak.currentStreak} days</div>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-orange-200" />
            <div className="text-sm text-orange-200">Best Streak</div>
          </div>
          <div className="text-4xl font-bold">{streak.bestStreak} days</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-orange-400/30">
        <div className="text-sm text-orange-200">
          Last studied {formatDistanceToNow(new Date(streak.lastStudyDate))} ago
        </div>
      </div>
    </div>
  );
}