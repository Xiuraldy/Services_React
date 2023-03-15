import { useContext, useState } from 'react';
import { GlobalContext } from '../../state/GlobalState';
import { REACT_APP_API_URL } from '../../utils/constanst';
export const useGetLastRow = (cb) => {
    const [lastRow, setLastRow] = useState()
    
    const {user} = useContext(GlobalContext)
    const subrol = user ? user.subrol : '';
    
    const useLastRow = () => {
        setLastRow('')
        let url = `${REACT_APP_API_URL}/api/lastrow/sheet/${subrol}/services`
        
        const requestOptions = {
                method: 'GET'
            }
            fetch(url, requestOptions)
            .then(response => response.json())
            .then((result)=>{
                cb(result.result.replace(/['"]+/g, ''))
                // {console.log('result -->', result.result)}
                setLastRow(result.result.replace(/['"]+/g, ''))
            },(error)=>{
                console.log(error)
        })
    }
    return {useLastRow, lastRow}
}