import { useState } from 'react';
export const useGetAllUsers = () => {
    const [users, setUsers] = useState([])
    const [pag, setPag] = useState(1)
    const [count, setCount] = useState(0)
    const [searchInput, setSearchInput] = useState("")
    const [searchSelectRol, setSearchSelectRol] = useState("")


    const handleChangeSearchInput = (value) => {
        setSearchInput(value)
    }

    const handleChangeSearchSelectRol = (value) => {
        setSearchSelectRol(value)
    }

    const search = () => {
        setPag(1)  
        getAllUsers(1, searchInput, searchSelectRol)
    }

    const nextAndPrevious = (step) => {
        const newPag = pag + step
        if (newPag < 1) {
            return
        }
        if (newPag > count) {
            return
        }
        getAllUsers(pag+step, searchInput, searchSelectRol)
    }



    const getAllUsers = (pagine=1, search, searchRol) => {
        setPag(pagine)
        let url = `${process.env.REACT_APP_API_URL}/api/users?pag=${pagine}`
        if(search || searchRol){
            url += `&search=${search}`
            url += `&search=${searchRol}`
        }
        fetch(url)
        .then(response => response.json())
        .then(result => {
            if(result.error){
                throw new Error(result.error)
            }
            setUsers(result.data)
            setCount(Math.ceil(result.count/9))
        })
        .catch(error => console.log('error', error));
    }
    return {getAllUsers, users, nextAndPrevious, count, pag, search, handleChangeSearchInput, handleChangeSearchSelectRol, searchInput, searchSelectRol}
}