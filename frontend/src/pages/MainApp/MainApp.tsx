import { Button, Avatar, Dropdown } from 'antd'
import { MailOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import TranscribeForm from '../../components/TranscribeForm/TranscribeForm'
import { useAuth } from '../../contexts/AuthContext'
import valubellIcon from '../../assets/valubell-icon.jpeg'
import styles from './MainApp.module.scss'

export default function MainApp() {
  const { user, signOut } = useAuth()
  const isEmbedMode = new URLSearchParams(window.location.search).get('embed') === 'true'

  const handleSignOut = async () => {
    await signOut()
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'email',
      label: user?.email,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'signout',
      label: 'Sign out',
      icon: <LogoutOutlined />,
      onClick: handleSignOut,
    },
  ]

  return (
    <div className={`${styles.container} ${isEmbedMode ? styles.embedMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <a href="https://www.valuebell.studio/" target="_blank" rel="noopener noreferrer">
            <img src={valubellIcon} className={styles.logo} alt="Valuebell Logo" />
          </a>
          <h1 className={styles.title}>Valuebot</h1>
        </div>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Avatar
            src={user?.photoURL}
            icon={!user?.photoURL && <UserOutlined />}
            className={styles.avatar}
          />
        </Dropdown>
      </header>
      <main className={styles.main}>
        <TranscribeForm />
      </main>
      {!isEmbedMode && (
        <Button
          type="primary"
          shape="round"
          icon={<MailOutlined />}
          href="https://www.valuebell.studio/contact"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.floatingContactButton}
          size="large"
        >
          Contact Us
        </Button>
      )}
    </div>
  )
}
