import { useContext, useState } from 'react';
import { GlobalContext } from '../../state/GlobalState';
import { REACT_APP_API_URL } from '../../utils/constanst';

export const useGetAllCertificates = () => {
    const [searcher, setSearcher] = useState('')
    const [rows, setRow] = useState([])
    const [getValue, setGetValue] = useState([])
    const [error, setError] = useState(false)

    const {user} = useContext(GlobalContext)
    // console.log('user.subrol',user.subrol)
    
    const getAllCertificates = () => {
        let url = ''
        if (searcher){
            url = `${REACT_APP_API_URL}/api/certificate/${user ? user.subrol : ''}/search/${"'"+searcher+"'"}`
        }else{
            url = `${REACT_APP_API_URL}/api/certificate/${user ? user.subrol : ''}`
        }

        console.log('url', url)

        const requestOptions = {
            method: 'GET'
        }
        fetch(url, requestOptions)
            .then(response => response.json())
            .then((result)=>{
                //console.log('result', result)
                setRow(result)
            if(result[0].id !== "{version" || searcher.split('').length===4){
                setGetValue(result[0])
                // console.log('getValue',getValue)
                setError(false)
            }else {
                result[0] = ""
                setError(true)
            }
        },(error)=>{
            console.log(error)
        })
    }
    return {getAllCertificates, rows, searcher, setSearcher, getValue, error}
}