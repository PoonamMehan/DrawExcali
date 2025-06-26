// use react-hook-form/zod
//allow the user to login using username too
//password 6 or more length
//email must be a valid email. use zod

"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login (){
    const [emailInput, setEmailInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
    const router = useRouter();

    async function loginHandler(){  
        axios({
            method: 'post',
            url: '/api/user/login',
            data: {
                email: emailInput,
                password: passwordInput
            },
            withCredentials: true
        }).then(function (response){
            console.log("response", response);
            setEmailInput("");
            setPasswordInput("");
            const token = response.headers["authorization"]
            localStorage.setItem("Token", token);
            router.push('/create-join-room');
        }).catch((err)=>{
            console.log("Error", err);
            console.log("Error", err.status, err.response.data.errorMessage);
        })        
    }

    return(
        <div >
            <input placeholder="Email" value={emailInput} onChange={(e)=>{setEmailInput(e.target.value)}}></input>
            <input placeholder="Password"  value={passwordInput} onChange={(e)=>{setPasswordInput(e.target.value)}}></input>
            <button onClick={loginHandler}>Submit</button>
        </div>
    )
}