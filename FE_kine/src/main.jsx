import React from 'react'
import ReactDOM from 'react-dom/client'
import WhiteBoard from './WhiteBoard.jsx'
import Options from './Options.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Options/>
        <WhiteBoard/>
    </React.StrictMode>
)