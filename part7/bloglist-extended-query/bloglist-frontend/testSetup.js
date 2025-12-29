import {afterEach} from 'vitest'
import {cleanup} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
  value: function () {
    this.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}))
  },
})

afterEach(() => {
  cleanup()
})