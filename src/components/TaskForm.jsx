import { useState } from 'react'

export default function TaskForm({ categories, onAddTask, onAddCategory }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0]?.id || '')
  const [priority, setPriority] = useState('media')
  const [dueDate, setDueDate] = useState('')
  const [newCategory, setNewCategory] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAddTask({ title: title.trim(), category: category || categories[0]?.id, priority, dueDate })
    setTitle('')
    setDueDate('')
  }

  function handleAddCategory() {
    if (!newCategory.trim()) return
    onAddCategory(newCategory.trim())
    setNewCategory('')
  }

  return (
    <div className="task-form-card">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nova tarefa, ex: Revisar pull request"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="form-row">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baixa">Baixa</option>
          </select>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary full-width">
          Adicionar tarefa
        </button>
      </form>

      <div className="new-category-row">
        <input
          type="text"
          placeholder="Nova categoria"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="button" onClick={handleAddCategory}>
          + Categoria
        </button>
      </div>
    </div>
  )
}
