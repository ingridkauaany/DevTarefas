const PRIORIDADE_LABEL = { alta: 'Alta', media: 'Media', baixa: 'Baixa' }

export default function TaskItem({ task, categoryName, onToggle, onDelete }) {
  return (
    <div className={`task-row priority-${task.priority} ${task.done ? 'done' : ''}`}>
      <button
        className="check-btn"
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? 'Reabrir tarefa' : 'Concluir tarefa'}
      >
        {task.done ? '✓' : ''}
      </button>
      <div className="task-info">
        <p className="task-title">{task.title}</p>
        <p className="task-meta">
          {categoryName} &middot; {PRIORIDADE_LABEL[task.priority] || task.priority}
          {task.dueDate ? ` · ${new Date(task.dueDate).toLocaleDateString('pt-BR')}` : ''}
        </p>
      </div>
      <button className="delete-btn" onClick={() => onDelete(task.id)} aria-label="Excluir tarefa">
        ×
      </button>
    </div>
  )
}
