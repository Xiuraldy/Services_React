import { useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { CommonsGet } from "../page/commons/get/CommonsGet"
import { CommonsView } from "../page/commons/view/CommonsView"
import { Tech } from "../page/tech/Tech/Tech"

export const TechRoutes = () => {
    const navigate = useNavigate()
    useEffect(() => {
      const session = localStorage.getItem('SESSION')
      if(!session){
        navigate('/sign-up-login')
      }else{
        const sessionParse = JSON.parse(session)
        if(sessionParse.rol !== 'tech'){
            navigate(`/${sessionParse.rol}`)
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <header>
            </header>
                <Routes>
                    <Route path='/' element={<Tech />} />
                    <Route path='/view' element={<CommonsView />} />
                    <Route path='/get' element={<CommonsGet />} />
                </Routes>
        </div>
    )
}