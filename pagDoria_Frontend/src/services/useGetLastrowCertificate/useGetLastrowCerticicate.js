import { useState } from 'react';
import { REACT_APP_API_URL } from '../../utils/constanst';

export const useGetLastrowCertificate = (cb) => {
    const [lastRow, setLastRow] = useState()
    
    const useLastRow = () => {
        let url = `${REACT_APP_API_URL}/api/lastrow/certificate/sheet/services`
        
        const requestOptions = {
                method: 'GET'
            }
            fetch(url, requestOptions)
            .then(response => response.json())
            .then((result)=>{
                cb(result.result.replace(/['"]+/g, ''))
                setLastRow(result.result.replace(/['"]+/g, ''))  
            },(error)=>{
                console.log(error)
        })
    }
    return {useLastRow, lastRow}
}