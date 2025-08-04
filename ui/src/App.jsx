import './App.css'

import axios from 'axios'
import {useEffect, useState} from "react";

function App() {
    const [message, setMessage] = useState('')

    useEffect(() => {
        axios.get(import.meta.env.VITE_API_URL)
            .then(response => {
                setMessage(response.data)
            })
            .catch(error => {
                console.error('Failed to fetch message:', error);
            })

    }, [])

  return (
    <>
        <h1>{message.content}</h1>
    </>
  )
}

export default App