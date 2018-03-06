import React from 'react';
import ReactDOM from 'react-dom';
import {injectGlobal} from 'styled-components'
import {calcScreenCapacity} from './api'
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App/>, document.getElementById('root'));

registerServiceWorker();

injectGlobal`
  body {
    margin: 0;
  }
`
window.addEventListener('resize', () => setTimeout(() => window.location.reload(), 1000))

console.info('screen capacity is', calcScreenCapacity())