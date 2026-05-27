import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hook/useChat';

const Dashboard = () => {

    const chat = useChat();

    const user = useSelector((state) => state.auth.user);
    //connects to the backend server 
    useEffect(() => {
      chat.initializeSocket()
    }, [])
    
    console.log(user)

    return (
        <div>Dashboard</div>
    )
}

export default Dashboard