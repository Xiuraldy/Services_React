import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { HtmlTooltip } from '../../elements/TooltipReuse';
import { GlobalContext } from "../../state/GlobalState"
import './styleMenu.css' 

export const Menu = () => {
    const navigate = useNavigate()
    const [rol, setRol] = useState('')
    const [name, setName] = useState('')
    const {user, setUser} = useContext(GlobalContext)
    const [itemSelected, setItemSelected] = useState('')
    let location = useLocation();
    useEffect(() => {
        setRol(user ? user.rol : '')
        setName(user ? user.name : '')
        if(user){
            setItemSelected(location.pathname.split('/')[2])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user])

    const clearLocalStorage = () => {
        setUser(null)
        localStorage.clear()
        navigate('/sign-up-login')
        document.body.classList.remove("shrink")
    }

    const redirect = (value) => {
        setItemSelected(value)
        navigate(`/${rol}/${value}`)
    }

    const addClass = () => {
        document.body.classList.toggle("shrink")
    }

    const redirectExcel = () => {
        window.open("https://docs.google.com/spreadsheets/d/1oWOTBbasKTmX1UYul8zHm0SO5lhnmdvPjaZVfhuwR00/edit#gid=1413542043")
    }

    const firstName = (name) => {
        const nameUser = name.name;
        const cutName = nameUser.split(' ');
        const firstName = cutName[0];
        return firstName
    }
    
    return (
        rol ? (    
            <div>
                <div className="content-page">
                    <nav className="nav-menu">
                        <div className="sidebar-top">
                            <span className="shrink-btn" onClick={addClass}>
                                <i><img src="/assets/icon/menu/chevron-left.png" alt="Chevron-left" className="chevron-left" /></i>
                            </span>
                            <img src="/assets/logo/logo_doria.png" alt="Doria" className="logo" />
                            <h3 className="hide">Servicios</h3>
                        </div>

                        <div className="sidebar-links">
                            <ul className="ul-menu">
                                <HtmlTooltip title="Visualizar" placement="right" arrow className='tooltip'>
                                    <li>
                                        <div onClick={() => redirect('view')} className={`${itemSelected === 'view' ? 'activeItem' : 'inactiveItem'}`}>
                                            <div className="icon">
                                                <img src="/assets/icon/menu/view/view-png.png" alt="view-png" className="width-view" />
                                                <img src="/assets/icon/menu/view/view-solid.png" alt="view-solid" className="width-view"/>
                                            </div>
                                            <span className="hide">Visualizar</span>
                                        </div>
                                    </li>
                                </HtmlTooltip>
                                <HtmlTooltip title="Ingresar" placement="right" arrow className='tooltip'>
                                <li>
                                    <div onClick={() => redirect('get')} className={`${itemSelected === 'get' ? 'activeItem' : 'inactiveItem'}`}>
                                        <div className="icon">
                                            <img src="/assets/icon/menu/get into/get-png.png" alt="get-png" className="width-get" />
                                            <img src="/assets/icon/menu/get into/get-solid.png" alt="get-solid" className="width-get" />
                                        </div>
                                        <span className="hide">Ingresar</span>
                                    </div>
                                </li>
                                </HtmlTooltip>
                                <HtmlTooltip title="Excel" placement="right" arrow className='tooltip'>
                                <li>
                                    <div onClick={redirectExcel} className='inactiveItem'>
                                        <div className="icon">
                                            <img src="/assets/icon/menu/excel/excel-png.png" alt="excel-png" className="width-excel" />
                                            <img src="/assets/icon/menu/excel/excel-solid.png" alt="excel-solid" className="width-excel" />
                                        </div>
                                        <span className="hide">Excel</span>
                                    </div>
                                </li>
                                </HtmlTooltip>
                                        {
                                            rol==='tech' && (
                                                <>
                                                </>
                                            ) 
                                        }
                                        {
                                            rol==='bosses' && (
                                                <>
                                                                <HtmlTooltip title="Autorizar y Eliminar" placement="right" arrow className='tooltip'>
                                                                <li>
                                                                    <div onClick={() => redirect('authorize')} className={`${itemSelected === 'authorize' ? 'activeItem' : 'inactiveItem'}`}>
                                                                        <div className="icon">
                                                                            <img src="/assets/icon/menu/authorize/authorize-png.png" alt="authorize-png" className="width-authorize" />
                                                                            <img src="/assets/icon/menu/authorize/authorize-solid.png" alt="authorize-solid" className="width-authorize" />
                                                                        </div>
                                                                        <span className="sidebar-links-lines hide">Autorizar y<br /> Eliminar</span>
                                                                    </div>
                                                                </li>
                                                                </HtmlTooltip>
                                                                <HtmlTooltip title="Usuarios" placement="right" arrow className='tooltip'>
                                                                <li>
                                                                    <div onClick={() => redirect('users')} className={`${itemSelected === 'users' ? 'activeItem' : 'inactiveItem'}`}>
                                                                        <div className="icon">
                                                                            <img src="/assets/icon/menu/users/users-png.png" alt="users-ligth" className="width-users" />
                                                                            <img src="/assets/icon/menu/users/users-solid.png" alt="users-ligth" className="width-users" />
                                                                        </div>
                                                                        <span className="hide">Usuarios</span>
                                                                    </div>
                                                                </li>
                                                                </HtmlTooltip>
                                                </>
                                            ) 
                                        }  
                            </ul>
                        </div>

                        <div className="sidebar-footer">
                                {
                                    rol==='tech' && (
                                        <div className="acoount">
                                            <HtmlTooltip title={<div style={{ textAlign: 'center' }}>Técnico <br />{firstName({name})}</div>} placement="top" arrow>
                                                <img src="/assets/icon/menu/userRol/userRol.png" alt="userRol-png" className="width-userRol" />
                                            </HtmlTooltip>
                                        </div>
                                    )
                                }
                                {
                                    rol==='bosses' && (
                                        <div className="acoount">
                                            <HtmlTooltip title={<div style={{ textAlign: 'center' }}>Jefe <br />{firstName({name})}</div>} placement="top" arrow>
                                                <img src="/assets/icon/menu/userRol/userRol.png" alt="userRol-png" className="width-userRol" />
                                            </HtmlTooltip>
                                        </div>
                                    )
                                }
                            <div className="user-rol">
                                <div className="user-profile hide">
                                    <img src="/assets/icon/menu/userRol/userRolCircle.png" alt="userRolCircle-png" className="userRolCircle" />
                                        {
                                            rol==='tech' && (
                                                <div className="user-info">
                                                    <h3>{firstName({name})}</h3>
                                                    <h5>Técnico</h5> 
                                                </div>
                                            )
                                        }
                                        {
                                            rol==='bosses' && (
                                                <div className="user-info">
                                                    <h3>{firstName({name})}</h3>
                                                    <h5>Jefe</h5>
                                                </div>
                                            )
                                        } 
                                </div>
                                <HtmlTooltip title="Salir" placement="right" arrow>
                                    <button className="log-out" onClick={clearLocalStorage}>
                                        <img src="/assets/icon/menu/logout.png" alt="logout-png" className="width-logout" />
                                    </button> 
                                </HtmlTooltip>
                            </div>
                        </div>
                    </nav>
                    <main className="main-menu">
                        
                    </main>
                </div>
            </div>
        ) : <></>
    )
}