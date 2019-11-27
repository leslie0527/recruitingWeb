const path = require('path');
import './style.css';

const config = {
  entry: {
    main: './main'
  },
  output: {
    path: path.join(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'main.js'
  }
};