import { useContext, useState } from 'react';
import { GlobalContext } from '../../state/GlobalState';
import { REACT_APP_API_URL } from '../../utils/constanst';
export const useGetAllSheets = () => {
    const [searcher, setSearcher] = useState('')
    const [subrolSearch, setSubrolSearch] = useState('')
    const [rows, setRow] = useState([])
    const [getValue, setGetValue] = useState([])
    const [error, setError] = useState(false)

    const {user} = useContext(GlobalContext)
    // console.log('user.subrol',user.subrol)
    
    const getAllSheets = () => {
        let url = ''
        if (searcher){
            url = `${REACT_APP_API_URL}/api/sheet/${subrolSearch ? subrolSearch : user.subrol}/services/search/${"'"+searcher+"'"}`
        }else{
            url = `${REACT_APP_API_URL}/api/sheet/${subrolSearch ? subrolSearch : user.subrol}/services/1`
        }

        const requestOptions = {
            method: 'GET'
        }
        fetch(url, requestOptions)
            .then(response => response.json())
            .then((result)=>{
                // console.log('result', result)
            setRow(result)
            if(result.length){
                setGetValue(result[0])
                // console.log('getValue',getValue)
                setError(false)
            }else {
                setError(true)
            }
        },(error)=>{
            console.log(error)
        })
    }
    return {getAllSheets, rows, searcher, setSearcher, getValue, setSubrolSearch, subrolSearch, error}
}