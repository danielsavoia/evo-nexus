import { useEffect, useState, useCallback } from 'react'
import { useConfirm } from '../components/ConfirmDialog'
import { api } from '../lib/api'
import { Users as UsersIcon, Plus, Pencil, Trash2, X } from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  display_name: string
  role: string
  is_active: boolean
  last_login: string | null
  created_at: string
}

interface UserForm {
  username: string
  email: string
  display_name: string
  password: string
  role: string
}

const emptyForm: UserForm = { username: '', email: '', display_name: '', password: '', role: 'viewer' }

const roleBadge: Record<string, { bg: string; text: string; border: string }> = {
  admin: { bg: 'rgba(133, 242, 160,0.10)', text: '#85F2A0', border: 'rgba(133, 242, 160,0.25)' },
  operator: { bg: 'rgba(96,165,250,0.10)', text: '#60A5FA', border: 'rgba(96,165,250,0.25)' },
  viewer: { bg: 'rgba(102,112,133,0.15)', text: '#6B8A76', border: 'rgba(102,112,133,0.30)' },
}

function getRoleBadge(role: string) {
  return roleBadge[role] || roleBadge.viewer
}

function getInitials(name: string) {
  return name
    .split(/[\s_-]+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('')
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never'
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function UsersPage() {
  const confirm = useConfirm()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<UserForm>(emptyForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [availableRoles, setAvailableRoles] = useState<string[]>(['admin', 'operator', 'viewer'])

  const fetchUsers = useCallback(async () => {
    try {
      const [data, rolesData] = await Promise.all([
        api.get('/users'),
        api.get('/roles').catch(() => []),
      ])
      setUsers(Array.isArray(data) ? data : data.users || [])
      if (Array.isArray(rolesData) && rolesData.length > 0) {
        setAvailableRoles(rolesData.map((r: { name: string }) => r.name))
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (u: User) => {
    setEditingId(u.id)
    setForm({ username: u.username, email: u.email, display_name: u.display_name, password: '', role: u.role })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.username.trim()) { setError('Username is required'); return }
    if (!editingId && form.password.length < 6) { setError('Password must be at least 6 characters'); return }

    setSubmitting(true)
    try {
      if (editingId) {
        const body: Record<string, string> = {
          username: form.username.trim(),
          email: form.email.trim(),
          display_name: form.display_name.trim(),
          role: form.role,
        }
        if (form.password) body.password = form.password
        await api.put(`/users/${editingId}`, body)
      } else {
        await api.post('/users', {
          username: form.username.trim(),
          email: form.email.trim(),
          display_name: form.display_name.trim() || form.username.trim(),
          password: form.password,
          role: form.role,
        })
      }
      setModalOpen(false)
      fetchUsers()
    } catch (ex: unknown) {
      setError(ex instanceof Error ? ex.message : 'Failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = async (u: User) => {
    const ok = await confirm({
      title: 'Desativar usuário',
      description: `Desativar "${u.username}"?`,
      confirmText: 'Desativar',
      variant: 'danger',
    })
    if (!ok) return
    try {
      await api.delete(`/users/${u.id}`)
      fetchUsers()
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#122018] border border-[#1E3829] flex items-center justify-center">
            <UsersIcon size={20} className="text-[#85F2A0]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#F7F9F8]">User Management</h1>
            <p className="text-sm text-[#6B8A76]">{users.length} user{users.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#41A650] text-[#07130D] font-semibold text-sm hover:bg-[#41A650]/90 transition-colors"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : (
        <div className="bg-[#122018] rounded-xl border border-[#1E3829] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E3829] text-[#6B8A76]">
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Last Login</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const rb = getRoleBadge(u.role)
                return (
                  <tr key={u.id} className="border-b border-[#1E3829]/50 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: rb.bg, color: rb.text, border: `1px solid ${rb.border}` }}
                        >
                          {getInitials(u.display_name || u.username)}
                        </div>
                        <div>
                          <div className="text-[#F7F9F8] font-medium">{u.display_name || u.username}</div>
                          <div className="text-[#6B8A76] text-xs">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6B8A76]">{u.email || '--'}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
                        style={{ background: rb.bg, color: rb.text, borderColor: rb.border }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs ${u.is_active ? 'text-[#85F2A0]' : 'text-red-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-[#41A650]' : 'bg-red-400'}`} />
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6B8A76] text-xs">{timeAgo(u.last_login)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-1.5 rounded-lg text-[#6B8A76] hover:text-[#F7F9F8] hover:bg-white/5 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        {u.is_active && (
                          <button
                            onClick={() => handleDeactivate(u)}
                            className="p-1.5 rounded-lg text-[#6B8A76] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Deactivate"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#6B8A76]">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#122018] rounded-2xl border border-[#1E3829] p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#F7F9F8]">{editingId ? 'Edit User' : 'Create User'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-[#6B8A76] hover:text-[#F7F9F8] transition-colors"><X size={18} /></button>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#F7F9F8] mb-1">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#07130D] border border-[#1E3829] text-[#F7F9F8] text-sm focus:outline-none focus:border-[#41A650] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#F7F9F8] mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#07130D] border border-[#1E3829] text-[#F7F9F8] text-sm focus:outline-none focus:border-[#41A650] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#F7F9F8] mb-1">Display Name</label>
                <input
                  type="text"
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#07130D] border border-[#1E3829] text-[#F7F9F8] text-sm focus:outline-none focus:border-[#41A650] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#F7F9F8] mb-1">
                  Password {editingId && <span className="text-[#6B8A76]">(leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#07130D] border border-[#1E3829] text-[#F7F9F8] text-sm focus:outline-none focus:border-[#41A650] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#F7F9F8] mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#07130D] border border-[#1E3829] text-[#F7F9F8] text-sm focus:outline-none focus:border-[#41A650] transition-colors"
                >
                  {availableRoles.map(r => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg text-[#6B8A76] text-sm hover:text-[#F7F9F8] hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-[#41A650] text-[#07130D] font-semibold text-sm hover:bg-[#41A650]/90 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
