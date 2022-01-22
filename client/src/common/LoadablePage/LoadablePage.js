import React, { useState, useEffect } from 'react'
import { LoadingPage } from 'common/LoadingPage'
import { ErrorPage } from 'common/ErrorPage'
import { NotFoundPage } from 'features/NotFoundPage' // wtf is this doing in features?
import { Layout } from 'common/Layout'

const ERR_MSG_GENERIC =
  'Something caused an application error to occur while loading this page. Our team has been notified of this issue and will investigate.'
const SPINNER_DISPLAY_DELAY = 500

export const LoadablePage = ({ query, children }) => {
  const [pastSpinnerDelay, setPastSpinnerDelay] = useState(false)

  useEffect(() => {
    setTimeout(() => setPastSpinnerDelay(true), SPINNER_DISPLAY_DELAY)
  }, [])

  if (query.isError && query.error?.error?.code === 'not_found') {
    return <NotFoundPage />
  }

  if (query.isError) {
    return (
      <ErrorPage
        title="Resource Load Error"
        detail={ERR_MSG_GENERIC}
        error={query.error}
      />
    )
  }

  if (query.isLoading && pastSpinnerDelay) {
    return <LoadingPage />
  }

  if (query.isSuccess) {
    return children()
  }

  // for the first ?? seconds, just show a white screen to simulate browser behavior
  return <Layout />
}
