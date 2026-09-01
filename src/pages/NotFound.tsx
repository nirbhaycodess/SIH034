import { Link } from 'react-router-dom';
export function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-7xl font-bold text-blue-700">404</p>
        <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
        <Link to="/dashboard" className="mt-5 inline-block font-semibold text-blue-700">
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
