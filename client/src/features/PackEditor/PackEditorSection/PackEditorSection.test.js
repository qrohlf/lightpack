/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { PackEditorSection } from './PackEditorSection'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<PackEditorSection />, div)
  ReactDOM.unmountComponentAtNode(div)
})
