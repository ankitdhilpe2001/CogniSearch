import { createRoot } from 'react-dom/client'
import './app/index.css'
import 'remixicon/fonts/remixicon.css'
import { store } from './app/app.store.js'
import { Provider } from "react-redux"
import App from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>

)
