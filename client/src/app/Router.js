import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { PackEditor } from 'features/PackEditor'
import { LoginPage } from 'features/LoginPage'
import { NotFoundPage } from 'features/NotFoundPage'

const commonRoutes = [
  <Route key="packView" path="/p/:packId" element={<PackEditor readonly />} />,
]

const loggedInRoutes = (
  <Routes>
    <Route path="/pack/:packId" element={<PackEditor />} />
    {commonRoutes}
    {/* Catch-all 404 page route */}
    <Route component={NotFoundPage} />
  </Routes>
)

const publicRoutes = (
  <Routes>
    <Route path="/login" element={<LoginPage isLogin />} />
    <Route path="/signup" element={<LoginPage />} />
    <Route path="/pack/:packId" element={<PackEditor />} />
    {commonRoutes}
    {/* Catch-all 404 page route */}
    <Route component={NotFoundPage} />
  </Routes>
)

export const Router = () => {
  const currentUser = null
  return (
    <BrowserRouter>
      <Helmet defaultTitle="Lightpack" titleTemplate="%s · Lightpack" />
      {currentUser ? loggedInRoutes : publicRoutes}
    </BrowserRouter>
  )
}
