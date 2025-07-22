// use react-hook-form/zod
//allow the user to login using username too
//password 6 or more length
//email must be a valid email. use zod

"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { LoginSchema } from '@repo/types/allTypes';

export default function Login (){
    const [emailInput, setEmailInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
    const [ inputErr, setInputErr ] = useState<string>("");
    const [clicked, setClicked] = useState(false);
    //zod err, password/email wrong, err.status==500 server error
    const router = useRouter();

    async function loginHandler(){  
        setClicked(true)
        setInputErr("");
        const data = {
                email: emailInput,
                password: passwordInput
            };
        const parsedData = LoginSchema.safeParse(data);
        if(!parsedData.success){
            setClicked(false);
            if(parsedData.error.message){
                // console.log("ERr", parsedData.error)
                const obj = JSON.parse(parsedData.error.message)
                // console.log("ERr", obj[0]["message"])
                setInputErr(obj[0]["message"]);
            }
            return;
        }

        axios({
            method: 'post',
            url: `/api/user/login`,
            data: parsedData.data,
            withCredentials: true
        }).then(function (response){
            console.log("response", response);
            const token = response.headers["authorization"]
            localStorage.setItem("Token", token);
            router.push('/create-join-room');
            setEmailInput("");
            setPasswordInput("");
            setClicked(false)
        }).catch((err)=>{
            setClicked(false)
            if(err.status < 500 && err.status >= 400){
                setInputErr(err.response.data.errorMessage);
                return;
            }else if(err.status >= 500 && err.status < 600){
                setInputErr("Some error happened on our side, login again.")
                return
            }
            setInputErr("Some error happened on our side, try again.")
            console.log("Error", err);
            console.log("Error", err.status, err.response.data.errorMessage);
        })        
    }

    return(
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-md bg-gray-900/60 border border-gray-800 rounded-2xl p-8 shadow-lg backdrop-blur-md">
            <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            Welcome to DrawAI
            </h2>

            {inputErr && (
            <div className="text-red-400 text-sm text-center mb-4">{inputErr}</div>
            )}

            <div className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <div className="flex w-full">
                <div className="flex w-full relative">
                <button
                    onClick={loginHandler}
                    className="w-full py-3 px-4 text-lg font-medium rounded-md bg-gradient-to-r from-blue-600 to-yellow-600 hover:from-blue-700 hover:to-yellow-700 transition-all"
                >
                Submit
                </button>
                {clicked && <div className="w-full h-full bg-gray-900/60 absolute flex items-center justify-center rounded-md"><div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>}
                </div>
                </div>
            </div>
        </div>
    </div>
    )
}