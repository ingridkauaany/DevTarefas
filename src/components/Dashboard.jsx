import { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from 'firebase/firestore'
import { auth, db } from '../firebase'
import TaskForm from './TaskForm'
import TaskItem from './TaskItem'

const DEFAULT_CATEGORIES = [
  { id: 'geral', name: 'Geral' },
  { id: 'trabalho', name: 'Trabalho' },
  { id: 'pessoal', name: 'Pessoal' },
]

const PRIORITY_ORDER = { alta: 0, media: 1, baixa: 2 }

export default function Dashboard({ user }) {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [loading, setLoading] = useState(true)

  const tasksRef = collection(db, 'users', user.uid, 'tasks')
  const categoriesRef = collection(db, 'users', user.uid, 'categories')

  useEffect(() => {
    const q = query(tasksRef, orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid])

  useEffect(() => {
    const unsubscribe = onSnapshot(categoriesRef, (snap) => {
      if (snap.empty) return
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid])

  async function handleAddTask({ title, category, priority, dueDate }) {
    await addDoc(tasksRef, {
      title,
      category,
      priority,
      dueDate: dueDate || null,
      done: false,
      createdAt: Date.now(),
    })
  }

  async function handleAddCategory(name) {
    const id = name.toLowerCase().replace(/\s+/g, '-')
    if (categories.find((c) => c.id === id)) return
    const newCats = [...categories, { id, name }]
    setCategories(newCats)
    await addDoc(categoriesRef, { name })
  }

  async function handleToggle(taskId) {
    const task = tasks.find((t) => t.id === taskId)
    await updateDoc(doc(db, 'users', user.uid, 'tasks', taskId), { done: !task.done })
  }

  async function handleDelete(taskId) {
    await deleteDoc(doc(db, 'users', user.uid, 'tasks', taskId))
  }

  function categoryName(id) {
    return categories.find((c) => c.id === id)?.name || 'Geral'
  }

  const pending = tasks
    .filter((t) => !t.done)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
  const done = tasks.filter((t) => t.done)

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Ola, {user.displayName || user.email.split('@')[0]}</h1>
          <p className="today-label">{today}</p>
        </div>
        <button className="btn-secondary" onClick={() => signOut(auth)}>
          Sair
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Pendentes</p>
          <p className="stat-value">{pending.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Concluidas</p>
          <p className="stat-value">{done.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Alta prioridade</p>
          <p className="stat-value">{pending.filter((t) => t.priority === 'alta').length}</p>
        </div>
      </div>

      <TaskForm
        categories={categories}
        onAddTask={handleAddTask}
        onAddCategory={handleAddCategory}
      />

      <div className="task-list">
        {loading && <p className="empty-state">Carregando tarefas...</p>}
        {!loading && tasks.length === 0 && (
          <p className="empty-state">Nenhuma tarefa ainda. Adicione a primeira acima.</p>
        )}
        {pending.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            categoryName={categoryName(t.category)}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
        {done.length > 0 && <p className="section-label">Concluidas ({done.length})</p>}
        {done.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            categoryName={categoryName(t.category)}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
