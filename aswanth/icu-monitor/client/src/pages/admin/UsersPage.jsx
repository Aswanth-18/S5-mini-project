import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getUsers, createUser, deactivateUser } from '../../services/userApi';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';

const EMPTY = { name: '', email: '', password: '', role: 'nurse', specialization: '' };

export default function UsersPage() {
  const [users, setUsers] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = () => getUsers().then(setUsers).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try { await createUser(form); setOpen(false); setForm(EMPTY); toast.success('User created'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (!users) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👥 User Management</h1>
        <button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm">+ Add User</button>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-400 text-left">
            <tr><th className="p-3">Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-slate-700">
                <td className="p-3">{u.name}{u.specialization ? ` (${u.specialization})` : ''}</td>
                <td className="text-slate-400">{u.email}</td>
                <td><Badge color={u.role === 'admin' ? 'red' : u.role === 'doctor' ? 'blue' : 'green'}>{u.role}</Badge></td>
                <td><Badge color={u.isActive ? 'green' : 'slate'}>{u.isActive ? 'active' : 'disabled'}</Badge></td>
                <td className="p-3 text-right">
                  {u.isActive && (
                    <button onClick={async () => { await deactivateUser(u._id); toast.success('Deactivated'); load(); }}
                      className="text-red-400 hover:text-red-300 text-xs">Deactivate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add User">
        <form onSubmit={submit} className="space-y-3">
          {[['name', 'Full name'], ['email', 'Email'], ['password', 'Password']].map(([k, l]) => (
            <input key={k} type={k === 'password' ? 'password' : k === 'email' ? 'email' : 'text'} required
              value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder={l}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm" />
          ))}
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm">
            {['nurse', 'doctor', 'admin'].map((r) => <option key={r}>{r}</option>)}
          </select>
          {form.role === 'doctor' && (
            <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              placeholder="Specialization (e.g. Critical Care)"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm" />
          )}
          <button className="w-full bg-blue-600 hover:bg-blue-500 rounded-lg py-2.5 font-semibold">Create</button>
        </form>
      </Modal>
    </div>
  );
}