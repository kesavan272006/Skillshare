import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing';
import Home from './pages/home';
import Signin from './pages/signin';
import CreateSession from './pages/CreateSession';
import EditSession from './pages/EditSession';
import SessionDetail from './pages/SessionDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<Signin />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateSession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/:sessionId"
        element={
          <ProtectedRoute>
            <EditSession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session/:sessionId"
        element={
          <ProtectedRoute>
            <SessionDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
