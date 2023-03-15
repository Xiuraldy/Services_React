import React, { useEffect, useState } from 'react';
import { HtmlTooltip } from '../../../elements/TooltipReuse';
import { Modal, TextField, Button } from '@material-ui/core';
import { motion } from "framer-motion"
import '.././styleBosses.css';
import './BossesUsers.css';
import { useGetAllUsers } from '../../../services/useGetAllUsers/useGetAllUsers';
import { useDeleteUser } from '../../../services/useDeleteUser/useDeleteUser';
import { useEditUser } from '../../../services/useEditUser/useEditUser';
import { useCreateUser } from '../../../services/useCreateUser/useCreateUser';
import { SUBROL } from '../../../utils/constanst';

export const BossesUsers = () => {
    const [modalCreate, setModalCreate] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [userSelected, setUserSelected] = useState({})

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [rol, setRol] = useState('')
    const [subrol, setSubrol] = useState('')

    const {users, getAllUsers, nextAndPrevious, count, pag, search, handleChangeSearchInput, handleChangeSearchSelectRol, searchInput, searchSelectRol} = useGetAllUsers()

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            // 👇 Get input value
            search()
        }
    };

    const {deleteId} = useDeleteUser(() => {
        getAllUsers()
        setModalDelete(false)
    })

    const {sendRequestEdit, error:errorEdit} = useEditUser(() => {
        getAllUsers()
        setModalEdit(false)
        setUserSelected({})
    }, {name, rol, subrol, email})

    const {sendRequest, error:errorCreate} = useCreateUser(() => {
        getAllUsers()
        setModalCreate(false)
    }, {name, rol, subrol, email, password, password2})
    
    useEffect(() => {
        getAllUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getRol = (rol) => {
        if(rol === 'bosses') {
            const rolUser = 'Jefe'
            return rolUser
        }else{
            const rolUser = 'Técnico'
            return rolUser
        }
    }

    const onModalCreate = () => {
        setModalCreate(!modalCreate)
    }

    const bodyModalCreate = (
        <motion.div
            className="container"
            initial={{ scale: .5, y:200, rotate:80 }}
            animate={{ rotate:0, scale: 1 }}
            transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            }}>
        <div className='modal'>
            <div className='modal-title'>
                <h2>Crear Usuario</h2>
            </div>
            <div className="modal-inputs">
                <div className="rol-name">
                    <div className="select-wrap">
                        <select 
                            name="rol"
                            className="select-field"
                            onChange={(e) => setRol(e.target.value)} 
                            value={rol}
                        >
                            <option hidden value>Rol</option>
                            <option value="tech">Técnico</option>
                            <option value="bosses">Jefe</option>
                        </select>
                    </div>
                        <div className="select-wrap">
                            <select 
                                name="subrol"
                                className="select-field"
                                onChange={(e) => setSubrol(e.target.value)} 
                                autoComplete="off"
                                defaultValue={subrol}
                            >
                                <option hidden value>Subrol</option>
                                <option value="mechanic">Mecanico</option>
                                <option value="windmill">Servicios/Molino</option>
                                <option value="electric">Electrico</option>
                                <option value="metrology">Metrologo</option>
                                <option value="capex">CAPEX</option>
                                <option value="reliability">Confiabilidad/Dirección</option>
                            </select>
                        </div>
                    <TextField 
                        className='textField'
                        label="Nombre" 
                        style={{width: 300, marginTop: 12}}
                        type="text" 
                        name="name"
                        onChange={(e) => setName(e.target.value)} 
                        value={name}
                    />
                </div>
                <TextField 
                    className='textField'
                    label="Email" 
                    style={{width: 300, marginTop: 12}}
                    type="text" 
                    name="email"
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email}
                />
                <TextField 
                    className='textField'
                    label="Contraseña" 
                    style={{width: 300, marginTop: 12}}
                    type="password" 
                    name="password"
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password}
                />
                <TextField 
                    className='textField'
                    label="Confirmar contraseña" 
                    style={{width: 300, marginTop: 12}}
                    type="password" 
                    name="password2"
                    onChange={(e) => setPassword2(e.target.value)} 
                    value={password2}
                />
            </div>
            <div className='modal-buttons'>
                <Button color="primary" onClick={sendRequest}>Enviar</Button>
                <Button onClick={()=>onModalCreate()}>Cancelar</Button>
            </div>
            {errorCreate && (<div className="message-bad" id="message-bad">
                <hr />
                <h3>Surgió un error</h3>
                <p>{errorCreate}</p>
                <img className="img-error" src="/assets/icon/x.png" alt="Error" />
            </div>)}
        </div>
        </motion.div>
    )

    const onModalEdit = (user) => {
        setUserSelected(user)
        setModalEdit(true)
        setRol(user.rol)
        setSubrol(user.subrol)
        setName(user.name)
        setEmail(user.email)
    }

    const bodyModalEdit = (
        <motion.div
            className="container"
            initial={{ scale: .5, y:200, rotate:80 }}
            animate={{ rotate:0, scale: 1 }}
            transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
        }}>
        <div className='modal'>
            <div className='modal-title' name="edit">
                <h2>Editar Usuario</h2>
            </div>
            <div className="modal-inputs">
                <div className="rol-name">
                    <div className="select-wrap">
                        <select 
                            name="rol"
                            className="select-field" 
                            onChange={(e) => setRol(e.target.value)} 
                            value={rol}
                        >
                            <option hidden value>Rol</option>
                            <option value="tech">Técnico</option>
                            <option value="bosses">Jefe</option>
                        </select>
                    </div>
                    <div className="select-wrap">
                        <select 
                            name="subrol"
                            className="select-field" 
                            onChange={(e) => setSubrol(e.target.value)} 
                            value={subrol}
                        >
                            <option hidden value>Subrol</option>
                            <option value="mechanic">Mecanico</option>
                            <option value="windmill">Servicios/Molino</option>
                            <option value="electric">Electrico</option>
                            <option value="metrology">Metrologo</option>
                            <option value="capex">CAPEX</option>
                            <option value="reliability">Confiabilidad/Dirección</option>
                        </select>
                    </div>
                    <TextField 
                        className='textField'
                        label="Nombre" 
                        style={{width: 300, marginTop: 12}}
                        type="text" 
                        name="name"
                        onChange={(e) => setName(e.target.value)} 
                        value={name}
                    />
                </div>
                <TextField 
                    className='textField'
                    label="Email" 
                    style={{width: 300, marginTop: 12}}
                    type="text" 
                    name="email"
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email}
                />
            </div>
            <div className='modal-buttons'>
                <Button onClick={() => sendRequestEdit(userSelected.id)}>Editar</Button>
                <Button onClick={()=>setModalEdit(false)}>Cancelar</Button>
            </div>
            { errorEdit && (<div className="message-bad" id="message-bad">
                <hr />
                <h3>Surgió un error</h3>
                <p>{errorEdit}</p>
                <img className="img-error" src="/assets/icon/x.png" alt="Error" />
            </div>)}
        </div>
        </motion.div>
    )

    const onModalDelete = (user) => {
        setUserSelected(user)
        setModalDelete(!modalDelete)
    }

    const container = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            delayChildren: 0.5,
            staggerChildren: 0.5
          }
        }
      };
      
    return (
        <div className='main-bosses-user'>
            <div className="header-users">
                <div className="search-filter">
                <div className="select-wrap" name="users">
                        <select 
                            name="rol-search"
                            className="select-field"
                            id='search-user-rol'
                            value={searchSelectRol}
                            onChange={(e) => handleChangeSearchSelectRol(e.target.value)}
                            onKeyDown={handleKeyDown}
                        >
                            <option value="">Rol</option>
                            <option value="tech">Técnico</option>
                            <option value="bosses">Jefe</option>
                        </select>
                    </div>
                    <div className="search-users">
                        <input type="text" id='search-user' value={searchInput} onChange = {(e) => handleChangeSearchInput(e.target.value)} onKeyDown={handleKeyDown}/>
                        <motion.button className="container"
                            whileHover={{ scale: 1,  rotate: 20, y: 10}}
                            whileTap={{ scale: 1, rotate: -10, y: -10 }}
                        >
                            <img src="/assets/icon/search.png" alt="search-user" onClick={search} />
                        </motion.button>
                    </div>
                </div>
                <div>
                    <motion.button whileTap={{ scale: 0.8 }} className="button-add-user" onClick={onModalCreate}><img src="/assets/icon/add.png" alt="" />Añadir Usuario</motion.button>
                </div>
            </div>
            <div className="content-pagination">
                <button className="buttons-pagination" name="previous" onClick={() => nextAndPrevious(-1)}>
                ← 
                </button>
                <div className="pagination-text">
                    Página <b>{pag}</b> de <b>{count}</b>
                </div>
                <button className="buttons-pagination" name="next" onClick={() => nextAndPrevious(1)}>
                →
                </button>
            </div>
            <div className="content-cards-users">
            <motion.ul 
                className="container"
                name="card-user"
                variants={container}
                initial="hidden"
                animate="visible"
            >
                    {users.map((user) => (
                                <div className="card-user">
                                    <div className="inf-user">
                                        <div className="roles">
                                            <h3>{getRol(user.rol)}<br /></h3>
                                            <h5>{SUBROL[user.subrol]}</h5>
                                        </div>
                                        <hr />
                                        <div className="inf-personal">
                                            <h4>{user.name}<br /></h4>
                                            <h6><i>{user.email}<br /></i></h6>
                                        </div>
                                    </div>
                                    <div className="card-buttons-user">
                                        <HtmlTooltip title='Editar' placement="left" arrow>
                                            <button onClick={()=>onModalEdit(user)}><img src="/assets/icon/card/edit.png" alt="card-edit-user" /></button>
                                        </HtmlTooltip>
                                        <HtmlTooltip title='Eliminar' placement="right" arrow>
                                            <button onClick={()=>onModalDelete(user)}><img src="/assets/icon/card/delete.png" alt="card-delete-user" /></button>    
                                        </HtmlTooltip>
                                    </div>
                                </div>
                        ))}
            </motion.ul>
            </div>
            <Modal
                open={modalCreate}
                onClose={onModalCreate}>
                    {bodyModalCreate}
            </Modal>
                <Modal
                    open={modalDelete}
                    onClose={onModalDelete}>
                        {
                            <motion.div
                            className="container"
                            initial={{ scale: .5, y:200, rotate:80 }}
                            animate={{ rotate:0, scale: 1 }}
                            transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                        }}>
                            <div className='modal'>
                            <div className='modal-title' name="delete">
                                <h2>Eliminar Usuario</h2>
                            </div>
                            <p className='pModalDelete'>¿Desea eliminar el usuario<br/><b>{userSelected.name}</b>?</p>
                            <div className='modal-buttons'>
                                <Button color="Secondary" onClick={() => deleteId(userSelected.id)}>Eliminar</Button>
                                <Button onClick={()=>setModalDelete(false)}>Cancelar</Button>
                            </div>
                        </div></motion.div>}
                </Modal>
            <Modal
                open={modalEdit}
                onClose={onModalEdit}>
                    {bodyModalEdit}
            </Modal>
            </div>
    );
}