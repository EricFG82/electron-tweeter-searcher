/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import '_public/style.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './renderer.scss';

// Prime React CSS
import '../../node_modules/primereact/resources/themes/saga-blue/theme.css';
import '../../node_modules/primereact/resources/primereact.min.css';
import '../../node_modules/primeicons/primeicons.css';

ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  document.getElementById('root'),
);
