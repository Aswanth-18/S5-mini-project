import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { homeFor } from '../../constants/roles';

const DEMO = [
  { label: 'Admin', email: 'admin@icu.local', pass: 'admin123' },
  { label: 'Doctor', email: 'ravi@icu.local', pass: 'doctor123' },
  { label: 'Nurse', email: 'anu@icu.local', pass: 'nurse123' }
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      toast.success(`Welcome, ${user.name}`);
      navigate(homeFor(user.role));
    } catch { /* error from store */ }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🫀</div>
          <h1 className="text-3xl font-bold">ICU Monitor</h1>
          <p className="text-slate-400 mt-1">AI-Driven Critical Patient Monitoring</p>
        </div>
        <form onSubmit={submit} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
              placeholder="you@icu.local" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
              placeholder="••••••••" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg py-2.5 font-semibold transition">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
          <div className="pt-3 border-t border-slate-700">
            <p className="text-xs text-slate-500 mb-2 text-center">Demo accounts (click to fill):</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO.map((d) => (
                <button key={d.label} type="button"
                  onClick={() => { setEmail(d.email); setPassword(d.pass); }}
                  className="text-xs bg-slate-700 hover:bg-slate-600 rounded-lg py-2 transition">{d.label}</button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}