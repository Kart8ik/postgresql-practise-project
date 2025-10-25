import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/navbar";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Leaderboard from "@/pages/leaderboard";
import { useAuth } from "@/Context";
import { Toaster } from "sonner";
import { AuthProvider } from "@/Context";


function Layout() {
  const { user, session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  const showNavbar = !!session;

  return (
    <div className="min-h-screen w-screen flex flex-col bg-background overflow-hidden">
      {showNavbar && <Navbar />}
      <main className="h-full w-full flex-1 overflow-hidden">
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </>
          ) : (
            <Route path="/" element={<Login />} />
          )}
        </Routes>
      </main>
    </div>
  );
}



export default function App() {
  return (
    <Router>
      <Toaster richColors position="bottom-right" />
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

