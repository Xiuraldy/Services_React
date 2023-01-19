import { useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { BossesAuthorize } from "../page/bosses/authorize/BossesAuthorize"
import { BossesUsers } from "../page/bosses/users/BossesUsers"
import { CommonsGet } from "../page/commons/get/CommonsGet"
import { CommonsView } from "../page/commons/view/CommonsView"

export const BossesRoutes = () => {
    const navigate = useNavigate()
    useEffect(() => {
      const session = localStorage.getItem('SESSION')
      if(!session){
        navigate('/sign-up-login')
      }else{
        const sessionParse = JSON.parse(session)
        if(sessionParse.rol !== 'bosses'){
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
                    <Route path='/authorize' element={<BossesAuthorize />} />
                    <Route path='/users' element={<BossesUsers />} />
                    <Route path='/view' element={<CommonsView />} />
                    <Route path='/get' element={<CommonsGet />} />
                </Routes>
        </div>
    )
}