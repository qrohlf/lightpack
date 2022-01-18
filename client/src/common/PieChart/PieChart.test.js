/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { PieChart } from './PieChart'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<PieChart />, div)
  ReactDOM.unmountComponentAtNode(div)
})
