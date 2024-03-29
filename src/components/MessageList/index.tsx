import { api } from '../../services/api'
import styles from './styles.module.scss'
import logoImg from '../../assets/logo.svg'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

type Message = {
  id: string
  text: string
  user: {
    name: string
    avatar_url: string
  }
}

let messagesQueue: Message[] = []

const socket = io(`${import.meta.env.VITE_API_URL}`)

socket.on('new_message', newMessage => {
  messagesQueue.push(newMessage)
})

const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [animation, setAnimation] = useState(false)

  useEffect(() => {
    setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1],
        ].filter(Boolean))

        messagesQueue.shift()
      }
    }, 3000)
  }, [])

  useEffect(() => {
    api.get<Message[]>('/messages/last3').then(response => {
      setMessages(response.data)
    })
  }, [])

  useEffect(() => {
    setAnimation(true)
  }, [messages])

  useEffect(() => {
    if (animation) {
      setTimeout(() => {
        setAnimation(false)
      }, 800)
    }
  }, [animation])

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {
          messages.map((message, index) => {
            return (
              <li key={message.id} className={`${styles.message} ${(animation && index == 0) ? styles.newMessage : ''}`}>
                <p className={styles.messageContent}>{message.text}</p>
                <div className={styles.messageUser}>
                  <div className={styles.userImage}>
                    <img src={message.user.avatar_url} alt={message.user.name} />
                  </div>
                  <span>{message.user.name}</span>
                </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export { MessageList }