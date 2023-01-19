import { useState } from "react"
import { validatorEmail } from "../../utils/validatorEmail"

export const useCreateUser = (cb, request) => {
    const [error, setError] = useState('')

    const validatorCreateUser = () => {
        if(request.rol=== '' || request.name=== '' || request.email === '' || request.password === '' || request.password2 === '') {
            setError('Complete todos los espacios')
            return false
        }
        if(!validatorEmail(request.email)) {
            setError('Email invalido')
            return false
        }
        if(!request.password){
            setError('Clave requerida')
            return false
        }
        return true
    }
    
    const sendRequest = () => {
        if(!validatorCreateUser()) {
            return 
        }
        // console.log('request --->', request)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(request),
            redirect: 'follow'
          };
          
          fetch(`${process.env.REACT_APP_API_URL}/api/sign-up`, requestOptions)
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
    return {sendRequest, error}
}