/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { PackEditor } from './PackEditor'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<PackEditor />, div)
  ReactDOM.unmountComponentAtNode(div)
})
