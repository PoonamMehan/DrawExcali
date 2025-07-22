// optionally take username using react-hook-from
// use react-hook-form/zod
//allow the user to login using username too
//password 6 or more length
//email must be a valid email. use zod

"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {SignupSchema} from '@repo/types/allTypes';
import {ZodError} from 'zod';

export default function Signup (){
    const [emailInput, setEmailInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
    const [usernameInput, setUsernameInput] = useState<string>("");
    const [inputValidationError, setInputValidationError] = useState<string>();
    const [endpointErr, setEndpointErr] = useState("");
    const router = useRouter();
    const [clicked, setClicked] = useState(false);

    async function signupHandler(){  
        setClicked(true)
        setInputValidationError("");
        setEndpointErr("");
        const data = {
                email: emailInput,
                password: passwordInput,
                username: usernameInput
            }
        //zod se validation of data
        const parsedData = SignupSchema.safeParse(data);
        if(!parsedData.success){
            setClicked(false)
            if(parsedData.error.message){
                console.log("Error in user input data validation: ", parsedData.error.message);
                const obj = JSON.parse(parsedData.error.message)
                setInputValidationError(obj[0]["message"]);
            }  
            return;
        }

        axios({
            method: 'post',
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/signup`,
            data: parsedData.data,
            withCredentials: true
        }).then(function (response){
            console.log("response", response);
            
            //now signed up, let's automatically sign the user in
            axios({
                method: 'post',
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`,
                data: {
                    email: parsedData.data.email,
                    password: parsedData.data.password
                },
                withCredentials: true
            }).then((response)=>{
                setEmailInput("");
                setPasswordInput("");
                setUsernameInput("");
                const token = response.headers["authorization"];
                localStorage.setItem("Token", token);
                router.push('/create-join-room');
            }).catch((error)=>{
                setEndpointErr("User Signed up, but some error occured during automatic login, try to Login.")
                console.log("Automatic login after signup error: ", error.message)
                return;
            })
            

            setInputValidationError("");
            setEndpointErr("");
        }).catch((err)=>{
            setClicked(false)
            //server error
            //email/username already existing
            //password small
            if(err.response.status == 400){
                setEndpointErr(err.response.data.errorMessage)
                console.log("Error", err.status, err.response.data.errorMessage);
                return
            }
            setEndpointErr("Some error occured on our end, try again");
            console.log("Error", err);
            console.log("Error", err.status, err.response.data.errorMessage);
        })  
    }

    return(
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-md bg-gray-900/60 border border-gray-800 rounded-2xl p-8 shadow-lg backdrop-blur-md">
                <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
                Sign Up
                </h2>

                {inputValidationError && (
                <div className="text-red-400 text-sm text-center mb-2">{inputValidationError}</div>
                )}
                {endpointErr && (
                <div className="text-red-400 text-sm text-center mb-4">{endpointErr}</div>
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
                    type="text"
                    placeholder="Username(optional)"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
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
                        onClick={signupHandler}
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