import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(traduzErro(err.code))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      setError(traduzErro(err.code))
    }
  }

  function traduzErro(code) {
    const mapa = {
      'auth/invalid-email': 'E-mail invalido.',
      'auth/user-not-found': 'Usuario nao encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/invalid-credential': 'E-mail ou senha incorretos.',
      'auth/email-already-in-use': 'Este e-mail ja esta cadastrado.',
      'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
    }
    return mapa[code] || 'Ocorreu um erro. Tente novamente.'
  }

  return (
    <div className="login-page">
      <div className="login-card fade-in-up">
        <img src="/logo.png" alt="DevTarefas" className="login-logo" />
        <p className="subtitle">
          {mode === 'login' ? 'Entre para ver suas tarefas.' : 'Crie sua conta gratis.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="voce@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="Minimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <button className="btn-google" onClick={handleGoogle} type="button">
          Continuar com Google
        </button>

        <p className="switch-mode">
          {mode === 'login' ? 'Ainda nao tem conta?' : 'Ja tem conta?'}{' '}
          <button
            type="button"
            className="link-btn"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Criar conta' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  )
}
