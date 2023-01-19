import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { GlobalContext } from "../../state/GlobalState";
import { motion } from "framer-motion"
import './styleSign.css' 

export const SignUpLogin = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [rol, setRol] = useState('')
    const [isError, setIsError] = useState(false)
    const [messageError, setMessageError] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    // const [isClassError, setClassError] = useState(true)
    const navigate = useNavigate();
    const {setUser} = useContext(GlobalContext)

    useEffect(() => {
      const session = localStorage.getItem('SESSION')
      // console.log('session --->', session)
      if(session){
        navigate(`/${JSON.parse(session).rol}`)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const validatorLogin = () => {
        const regexEmail =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(email === '' || password === ''){
            setIsError(true)
            setMessageError('Complete todos los espacios')
            return false
        }
        if(!email || !regexEmail.test(email)) {
            setIsError(true)
            setMessageError('Email invalido')
            return false
        }
        if(!password){
            setIsError(true)
            setMessageError('Clave requerida')
            return false
        }
        return true
    }

    const validatorRegister = () => {
        const regexEmail =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(rol=== '' || name=== '' || email === '' || password === '' || password2 === '') {
            setIsError(true)
            setMessageError('Complete todos los espacios')
            return false
        }
        if(!email || !regexEmail.test(email)) {
            setIsError(true)
            setMessageError('Email invalido')
            return false
        }
        if(!password){
            setIsError(true)
            setMessageError('Clave requerida')
            return false
        }
        return true
    }

    //Registro
    const sendRequest = () => {
        if(!validatorRegister()) {
            return 
        }
        const request = {
            name: name, 
            password: password, 
            password2: password2, 
            rol: rol,
            email: email
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
          
          fetch(`${process.env.REACT_APP_API_URL}/api/sign-up`, requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log('result --->', result)
                if(result.error){
                    throw new Error(result.error)
                }
                setUser(result)
                localStorage.setItem('SESSION', JSON.stringify(result))
                navigate(`/${rol}/view`)
            })
            .catch(error => {
                setMessageError(error.message)
                setIsError(true)
            }); 
    }   

    //Login
    const sendRequestLogin = () => {
        if(!validatorLogin()) {
            return 
        }
        const request = {
            password: password, 
            email: email
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
          
          // console.log(process.env);
          fetch(`${process.env.REACT_APP_API_URL}/api/login`, requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log('result --->', result)
                if(result.error){
                    throw new Error(result.error)
                }
                setUser(result)
                localStorage.setItem('SESSION', JSON.stringify(result))
                navigate(`/${result.rol}/view`)
            })
            .catch(error => {
                setMessageError(error.message)
                setIsError(true)
            }); 
    }

    //Press Enter, pending...
    
    const container = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
          opacity: 1,
          scale: 0.93,
          transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
          }
        }
      };
      
      const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1
        }
      };

    return ( 
        <div className="bodySign">
            <motion.ul
                className="container"
                variants={container}
                initial="hidden"
                animate="visible"
            >
            <motion.li key={container} className="item" variants={item} />
            <main className={isLogin ? 'sign-in-mode' : 'sign-up-mode'}>
                <div className="box">
                    <div className="inner-box">
                        <div className="forms-wrap">
                            <div className="sign-in">
                                <div className="logo">
                                    <img src="/assets/logo/logo_doria.png" alt="Doria" />
                                </div>
                                <div className="heading">
                                    <h2>Iniciar Sesión</h2>
                                    <h6>¿No estás regístrado? </h6>
                                    <span onClick={() => {
                                            setIsLogin(false)
                                            setIsError(false)
                                        }
                                    } className="toggle">Regístrate</span>
                                </div>

                                <div className="actual-form">
                                    <div className="input-wrap">
                                        <input 
                                            type="email" 
                                            name="email" 
                                            className={`input-field ${email ? "active" : "remove"}`}
                                            onChange={(e) => setEmail(e.target.value)} 
                                            autoComplete="off"
                                            value={email}
                                            
                                            
                                        />
                                        <label>Email</label>
                                    </div>
                                    <div className="input-wrap">
                                        <input 
                                            type="password"
                                            className={`input-field ${password ? "active" : "remove"}`}
                                            onChange={(e) => setPassword(e.target.value)} 
                                            autoComplete="off"
                                            name="password" 
                                            maxLength={20}
                                            
                                            
                                        />
                                        <label>Clave</label>
                                    </div>

                                    <input type="button" className="button-send" id="buttonSendLogin" value="Ingresar" onClick={sendRequestLogin} />
                                </div>
                                
                                { isError && (<div className="message-bad" id="message-bad">
                                    <h3>Surgió un error</h3>
                                    <p>{messageError}</p>
                                    <img src="/assets/icon/x.png" alt="Error" />
                                </div>)}
                            </div>

                            <div className="sign-up">
                                <div className="logo">
                                    <img src="/assets/logo/logo_doria.png" alt="Doria" />
                                </div>
                                <div className="heading">
                                    <h2>Regístrate</h2>
                                    <h6>¿Ya estás regístrado? </h6>
                                    <span onClick={() => {
                                        setIsLogin(true)
                                        setIsError(false)
                                        }
                                    } className="toggle">Inicia Sesión</span>
                                </div>

                                <div className="actual-form">
                                    <div className="rolName">
                                        <div className="select-wrap">
                                            <select 
                                                name="rol"
                                                className="select-field"
                                                onChange={(e) => setRol(e.target.value)} 
                                                autoComplete="off"
                                                defaultValue={rol}
                                            >
                                                <option hidden value>Rol</option>
                                                <option value="tech">Técnico</option>
                                                <option value="bosses">Jefe</option>
                                            </select>
                                        </div>
                                        <div className="input-wrap" name="name">
                                            <input 
                                                type="text" 
                                                name="name"
                                                className={`input-field ${name ? "active" : "remove"}`}
                                                onChange={(e) => setName(e.target.value)} 
                                                autoComplete="off"
                                                value={name}
                                            />
                                            <label>Nombre</label>
                                        </div>
                                    </div>
                                    <div className="input-wrap">
                                        <input 
                                            type="email" 
                                            name="email" 
                                            className={`input-field ${email ? "active" : "remove"}`}
                                            onChange={(e) => setEmail(e.target.value)} 
                                            value={email}
                                        />
                                        <label>Email</label>
                                    </div>
                                    <div className="input-wrap">
                                        <input 
                                            type="password" 
                                            name="password" 
                                            className={`input-field ${password ? "active" : "remove"}`}
                                            onChange={(e) => setPassword(e.target.value)} 
                                            maxLength={20}
                                        />
                                        <label>Clave</label>
                                    </div>
                                    <div className="input-wrap">
                                        <input 
                                            type="password" 
                                            className={`input-field ${password2 ? "active" : "remove"}`}
                                            onChange={(e) => setPassword2(e.target.value)} 
                                            name="password2" 
                                            autoComplete="off"
                                            maxLength={20}
                                        />
                                        <label>Confirmar Clave</label>
                                    </div>

                                    <input type="button" className="button-send" id="buttonSendRegister" value="Ingresar" onClick={sendRequest} />
                                </div>
                                
                                { isError && (<div className="message-bad" id="message-bad">
                                    <h3>Surgió un error</h3>
                                    <p>{messageError}</p>
                                    <img className="img-error" src="/assets/icon/x.png" alt="Error" />
                                </div>)}
                            </div>
                        </div>
                        <div>
                            <img className="img-doria" src="/assets/background/img-doria.png" alt="Img-Doria"/>
                        </div>
                    </div>
                </div>
            </main>
            </motion.ul>
        </div>
    )
}