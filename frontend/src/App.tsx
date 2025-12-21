import { ConfigProvider, theme } from 'antd'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage'
import MainApp from './pages/MainApp/MainApp'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import './App.css'

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#F96B2F',
          borderRadius: 4,
          colorBgContainer: '#1E1E1E',
        },
      }}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ConfigProvider>
  )
}

export default App
