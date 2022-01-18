/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { WaffleChart } from './WaffleChart'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<WaffleChart />, div)
  ReactDOM.unmountComponentAtNode(div)
})
