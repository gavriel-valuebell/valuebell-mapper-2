import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, message } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import valubellIcon from '../../assets/valubell-icon.jpeg'
import styles from './LandingPage.module.scss'

export default function LandingPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !loading) {
      navigate('/app')
    }
  }, [user, loading, navigate])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Sign in error:', error)
      message.error('Failed to sign in with Google')
    }
  }

  if (loading) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={valubellIcon} className={styles.logo} alt="Valuebell Logo" />
        <h1 className={styles.title}>Valuebot</h1>
        <p className={styles.description}>
          Transcribe and map your podcast episodes with AI
        </p>
        <Button
          type="primary"
          size="large"
          icon={<GoogleOutlined />}
          onClick={handleSignIn}
          className={styles.signInButton}
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}
