/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { GearRow } from './GearRow'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<GearRow />, div)
  ReactDOM.unmountComponentAtNode(div)
})
