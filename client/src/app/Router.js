import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { PackEditor } from 'features/PackEditor'
import { LoginPage } from 'features/LoginPage'
import { NotFoundPage } from 'features/NotFoundPage'
import { LandingPage } from 'features/LandingPage'
import { LighterpackImportPage } from 'features/LighterpackImportPage'
import { useAuthState } from 'hooks/useAuth'

const commonRoutes = [
  <Route key="packView" path="/p/:packId" element={<PackEditor readonly />} />,
  <Route
    key="lpImport"
    path="/r/:lighterpackId"
    element={<LighterpackImportPage />}
  />,
]

const loggedInRoutes = (
  <Routes>
    <Route path="/packs/:packId" element={<PackEditor />} />
    <Route path="/login" element={<Navigate to="/" />} />
    <Route path="/signup" element={<Navigate to="/" />} />
    {commonRoutes}
    {/* Catch-all 404 page route */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)

const publicRoutes = (
  <Routes>
    <Route index element={<LandingPage />} />
    <Route path="/login" element={<LoginPage isLogin />} />
    <Route path="/signup" element={<LoginPage />} />
    {commonRoutes}
    {/* Catch-all 404 page route */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)

export const Router = () => {
  const { currentUser } = useAuthState()
  return (
    <BrowserRouter>
      <Helmet defaultTitle="Lightpack" titleTemplate="%s · Lightpack" />
      {currentUser ? loggedInRoutes : publicRoutes}
    </BrowserRouter>
  )
}
