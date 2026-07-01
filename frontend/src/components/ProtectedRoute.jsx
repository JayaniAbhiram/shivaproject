import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, organizerOnly = false }) {
  const { user, loading, isOrganizer } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (organizerOnly && !isOrganizer) return <Navigate to="/" replace />;

  return children;
}
