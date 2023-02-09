import { useState } from "react"
import { REACT_APP_API_URL } from "../../utils/constanst"
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

          
          
          fetch(`${REACT_APP_API_URL}/api/sign-up`, requestOptions)
            .then(response => response.json())
            .then(result => {
                cb()
            })
            .catch(error => {
                setError(error.message)
            }); 
    }   
    return {sendRequest, error}
}