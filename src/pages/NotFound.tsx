import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-8">Page not found</p>
      <Link
        to="/"
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
      >
        <Home size={20} />
        Back to Dashboard
      </Link>
    </div>
  );
}