import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '@/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let idToken;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        idToken = await userCredential.user.getIdToken();
      } catch (fbErr) {
        console.warn('Firebase login failed, trying fallback to custom auth:', fbErr.message);
      }

      const headers = { 'Content-Type': 'application/json' };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify(idToken ? { email: formData.email } : formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      login(data.token || idToken);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-0.5 h-4 bg-[#2563EB]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
              Secure Access
            </span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-100" style={OUTFIT}>
            Welcome Back
          </h1>
          <p className="text-zinc-500 text-sm mt-1" style={MONO}>
            Sign in to your CampusLaunch account
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6">
          {error && (
            <div className="bg-red-950/40 border border-red-800/60 text-red-400 px-3 py-2 rounded-sm mb-5 text-xs" style={MONO}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5" style={MONO}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-sm px-3 py-2 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-[#2563EB] transition-colors"
                style={MONO}
                placeholder="you@university.edu"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5" style={MONO}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-sm px-3 py-2 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-[#2563EB] transition-colors"
                style={MONO}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#2563EB] text-white font-semibold py-2.5 px-4 rounded-sm text-sm uppercase tracking-widest hover:bg-blue-500 transition-colors mt-2"
              style={MONO}
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-zinc-500" style={MONO}>
          No account?{' '}
          <Link to="/register" className="text-[#2563EB] hover:text-blue-400 transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
