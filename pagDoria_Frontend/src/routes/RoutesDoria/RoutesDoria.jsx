import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { SignUpLogin } from "../../page/sign-up-login/SignUpLogin"
import { TechRoutes } from "../TechRoutes"
import { BossesRoutes } from "../BossesRoutes"
import { Menu } from "../../components/menu/Menu"
import { useContext, useEffect } from "react"
import { GlobalContext } from "../../state/GlobalState"
import './styleRoutesDoria.css';

export const RoutesDoria = () => {
    const {setUser} = useContext(GlobalContext)
    

    useEffect(() => {
        const session = localStorage.getItem('SESSION')
        if(session){
            setUser(JSON.parse(session))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <div>
            <Router>
            <div style={{display: 'flex', height: '100vh', width: '100%'}}>
                <Menu />
                <div className="div-main" style={{flex: 1, overflow: 'auto'}}>
                    <Routes>
                        <Route path='/' element={<Navigate to={localStorage.getItem('SESSION') ? `/${JSON.parse(localStorage.getItem('SESSION')).rol}/view` : '/sign-up-login'}/>} />
                        <Route path='/sign-up-login' element={<SignUpLogin />} />
                        <Route path='/tech/*' element={<TechRoutes />} />
                        <Route path='/bosses/*' element={<BossesRoutes />} />
                    </Routes>
                </div>
            </div>
            </Router>
        </div>
    )
}