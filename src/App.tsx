import { Navigate, Route, Routes } from 'react-router-dom'
import { PortalShell } from './components/PortalShell'
import { DanhMucPhiUploadPage } from './pages/DanhMucPhiUploadPage'
import { DashboardPage } from './pages/DashboardPage'
import { HoaDonUploadPage } from './pages/HoaDonUploadPage'
import { HocSinhUploadPage } from './pages/HocSinhUploadPage'
import { LoginPage } from './pages/LoginPage'
import { ProtectedRoute } from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<PortalShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/danh-muc-phi" element={<DanhMucPhiUploadPage />} />
          <Route path="/hoc-sinh" element={<HocSinhUploadPage />} />
          <Route path="/hoa-don" element={<HoaDonUploadPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
