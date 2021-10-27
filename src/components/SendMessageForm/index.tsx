import { useContext, useState, FormEvent } from 'react'
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc'
import { AuthContext } from '../../contexts/auth'
import { api } from '../../services/api'
import styles from './styles.module.scss'

export const SendMessageForm = () => {
  const { user, signOut } = useContext(AuthContext)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSendMessage(event: FormEvent) {
    setLoading(true)
    event.preventDefault()

    if (!message.trim()) {
      return setLoading(false)
    }

    await api.post('/messages', { message })
    setMessage('')
    setLoading(false)
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button onClick={signOut} className={styles.signOutButton}>
        <VscSignOut size="32" />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size="16" />
          {user?.login}
        </span>
      </header>
      <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          placeholder="Qual a sua expectativa para o evento?"
          onChange={event => setMessage(event.target.value)}
          value={message} />
        <button
          type="submit"
          disabled={loading}
        >{(!loading) ? `Enviar mensagem` : `Enviando`}</button>
      </form>
    </div>
  )
}