import React, { useEffect } from "react";
import { useSelector } from "react-redux";
// import { logout } from "../../auth/auth.slice";  Writen BY AI
// import { useNavigate } from "react-router";  Writen BY AI
import { useChat } from "../hooks/useChat";

const Dashboard = () => {
    const chat = useChat();
    // const dispatch = useDispatch();  Writen BY AI
    // const navigate = useNavigate();  Writen BY AI
    const user = useSelector(state => state.auth);

    console.log(user)

    useEffect(() => {
        chat.initilizeSocketConnection();
    }, [chat])


    return (
        <div>Dashboard</div>
    )

}

export default Dashboard