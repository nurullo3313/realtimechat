
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import 'antd/dist/reset.css';
import App from './App.jsx'
import {Provider} from "react-redux"
import store from './redux/store.js';
import { Toaster } from "react-hot-toast";
import { SocketProvider} from './context/SocketContext.jsx';


createRoot(document.getElementById('root')).render(
 <BrowserRouter>
  <Provider store={store}>
   <SocketProvider>
    <Toaster
      position="top-right"
    reverseOrder={false}
    />
     <App />
   </SocketProvider>
  </Provider>
 </BrowserRouter>,
)
