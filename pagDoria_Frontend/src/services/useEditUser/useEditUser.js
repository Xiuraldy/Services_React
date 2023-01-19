import { useState } from "react";
import { validatorEmail } from "../../utils/validatorEmail";

export const useEditUser = (cb, request) => {
    const [error, setError] = useState('')
    const sendRequestEdit = (id) => {
        // console.log('request --->', request)
        if(!validatorEmail(request.email)){
            setError('Email Invalido')
            return
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(request),
            redirect: 'follow'
          };
          
          fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log('result --->', result)
                if(result.error){
                    throw new Error(result.error)
                }
                cb()
            })
            .catch(error => {
                setError(error.message)
            }); 
    }   
    return {sendRequestEdit, error}
}