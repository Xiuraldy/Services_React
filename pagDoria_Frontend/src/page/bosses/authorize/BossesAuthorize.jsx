import * as React from 'react';
import { useContext, useEffect, useState } from "react";
import { useGetAllSheets } from "../../../services/useGetSheets/useGetSheets";
import { Modal, Button, TextField, Snackbar } from '@material-ui/core';
import { motion } from "framer-motion";
import './BossesAuthorize.css';
import { useGetProviders } from "../../../services/useGetProviders/useGetProviders";
import { Alert, Autocomplete, Stack } from "@mui/material";
import { GlobalContext } from "../../../state/GlobalState";
import { useEditServices } from "../../../services/useEditServices/useEditServices";
import { HtmlTooltip } from "../../../elements/TooltipReuse";
import { useGetPendings } from '../../../services/useGetPendings/useGetPendings';
import { useGetDateTime } from '../../../services/useGetDateTime/useGetDateTime';
import { FOLDERS_ID_CERTIFICATE, FOLDERS_ID_QUOTATION } from '../../../utils/constanst';

export const BossesAuthorize = () => {
    const [modalObservations, setModalObservations] = useState(false);
    const {getAllSheets, searcher, setSearcher, getValue, error} = useGetAllSheets()

    const {user} = useContext(GlobalContext)

    const [descripcionServicio, setDescripcionServicio] = useState('')
    const [prioridad, setPrioridad] = useState('')
    const [proovedor, setProovedor] = useState('')
    const [solicitudProveedor, setSolicitudProveedor] = useState('')
    const [imputaciónSolicita, setImputaciónSolicita] = useState('')
    const [imputaciónAutoriza, setImputaciónAutoriza] = useState('')
    const [nombreCotización, setNombreCotización] = useState('')
    const [COP, setCOP] = useState('')
    const [USD, setUSD] = useState('')
    const [EUR, setEUR] = useState('')
    const [observacionesAutoriza, setObservacionesAutoriza] = useState('')
    const [estadoServicio, setEstadoServicio] = useState('')
    const [loading, setLoading] = useState(false)

    const [modalUpdate, setModalUpdate] = useState(false) 
    const onModalUpdate = () => {
        setModalUpdate(!modalUpdate)
    }

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setDescripcionServicio(getValue.DescripciónServicio)
        setPrioridad(getValue.Prioridad)
        setProovedor(getValue.Proovedor)
        setSolicitudProveedor(getValue.SolicitudProveedor)
        setImputaciónSolicita(getValue.ImputaciónSolicita)
        setImputaciónAutoriza(getValue.ImputaciónAutoriza)
        setNombreCotización(getValue.NombreCotización)
        setCOP(getValue.COP)
        setUSD(getValue.USD)
        setEUR(getValue.EUR)
        setObservacionesAutoriza(getValue.ObservacionesAutoriza)
        setEstadoServicio(getValue.estadoServicio)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getValue])

    const {getProviders, providers} = useGetProviders()

    const {getPendings, pendings} = useGetPendings()

    useEffect(() => {
        if(user){
            getAllSheets()
            getProviders()
            getPendings()
        }
        // eslint-disable-next-line
    }, [user])


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            // 👇 Get input value
            getAllSheets()
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        clearError()
        setOpen(false)
    }

    const handleClick = () => {
        if(!validatorEditService()){
            setModalUpdate(false)
            return
        }

        setModalUpdate(false)
        setLoading(true)
        editServices()
    };

    const onModalObservations = () => {
        setModalObservations(!modalObservations)
    }

    const PDFOrdenCompra = getValue.PDFOrdenCompra
    
    const bodyModalObservations = (
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
            <div className='modal-title-services'>
                <h2>Observaciones</h2>
            </div>
            <div className="observations-modal">
                <div className="content-coordinator-observation">
                    <div className="coordinator-observation-name">
                        <h2>COORDINADOR</h2>
                        <h3>{getValue.CoordinadorAutoriza}</h3>
                    </div>
                    <div className="coordinator-observation">
                        <TextField 
                            id="outlined-basic"  
                            variant="outlined" 
                            onChange={(e) => setObservacionesAutoriza(e.target.value)}
                            value={observacionesAutoriza}
                            multiline
                        />
                    </div>
                </div>
                <div className="hr-horizontal-short-modal-coordinator">
                        <hr />
                </div>
                <div className="content-reliability-observation">
                    <div className="reliability-observation-name">
                        <h2>CONFIABILIDAD</h2>
                    </div>
                    <div className="reliability-observation">
                        {getValue.ObservacionesConfiabilidad}
                        <div className="observations-message-reliability" name={getValue.ObservacionesConfiabilidad}>No hay comentarios.</div>
                    </div>
                </div>
            </div>
            <div className='modal-buttons'>
                <Button onClick={()=>onModalObservations()}>SALIR</Button>
            </div>
        </div>
        </motion.div>
    )

    const {getDateTime} = useGetDateTime()

    const {editServices, error: errorEdit, clearError, validatorEditService} = useEditServices(() => {
        setOpen(true)
        setLoading(false)
    }, () => setLoading(false), {fechaSolicitud: getDateTime(), proovedor: proovedor, solicitudProveedor: proovedor !== 'OTROS ' ? '' : solicitudProveedor,
    nombreCotizacion: nombreCotización, COP: COP, USD: USD, EUR: EUR, descripcionServicio: descripcionServicio, 
    imputacionSolicita: imputaciónSolicita, fechaAprobacion: estadoServicio === 'Rechazado' ? getDateTime() : prioridad!=='' ? getDateTime() : '', coordinadorAutoriza: estadoServicio === 'Rechazado' ? 'Rechazado' : prioridad!=='' ? user.name : '', 
    prioridad: prioridad, imputacionAutoriza: imputaciónAutoriza, observacionesAutoriza: observacionesAutoriza, searcher: searcher, estadoServicio: estadoServicio })

    const urlCertificate = `https://drive.google.com/drive/u/0/folders/${FOLDERS_ID_CERTIFICATE[user ? user.subrol : '']}`
    const urlQuotation = `https://drive.google.com/drive/u/0/folders/${FOLDERS_ID_QUOTATION[user ? user.subrol : '']}`

    return (
        <div className="square-content-service" name="edit">
            <div className="search-message-choose-area">
                <div className="search-carousel">
                    <div className="search-service" name="authorize">
                        <button className="button-search-service" onClick={getAllSheets}>
                            <img src="/assets/view/plane.png" alt="plane-paper" />
                        </button>
                        <input className="input-search-service" name="edit-search" value={searcher} onChange={(e) => setSearcher(e.target.value)} onKeyDown={handleKeyDown} type="text" placeholder="N° Solicitud" />
                    </div>
                    <div className="carrousel-pendings" name="authorize">
                        {pendings.length === 0 ? <div className="title-item-pending">Estás al día</div> : <div className="title-item-pending">Pendientes</div>}
                        {pendings.map((pending) => (
                            <>
                                <button onMouseUp={(e) => setSearcher(e.target.value)} onClick={getAllSheets} value={pending} className="item-pending">
                                    {pending}
                                </button>
                            </>
                        ))}
                    </div>
                </div>
                <div className="message-service-not-found">
                    {error && <h4>Servicio no encontrado</h4>}
                </div>
            </div>
                <div className="content-inf-main-service">
                    <div className="inf-main-service" name="edit">
                        <div className="id-description" name="edit">
                            <div className="id-img">
                                <h1>
                                    Id: {getValue.id}
                                    {estadoServicio === 'Aprobado' && <img src="/assets/icon/approval.png" name="approval" alt="approval" />}
                                    {estadoServicio === 'Pendiente' && <img src="/assets/icon/approval.png" name="not-approval" alt="not approval" />}
                                    {estadoServicio === 'Rechazado' && <img src="/assets/icon/decline.png" name="decline" alt="decline" />}
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        className='state-approval'
                                        name={estadoServicio}
                                        value={estadoServicio}
                                        options={[
                                            { value: 'Pendiente', label: 'Pendiente' },
                                            { value: 'Aprobado', label: 'Aprobado' },
                                            { value: 'Rechazado', label: 'Rechazado' }
                                        ]}
                                        renderInput={(params) => <TextField {...params} placeholder="Estado Final" />}
                                        isOptionEqualToValue={(option, value) =>
                                            value === undefined || value === "" || option.id === value.id
                                        }
                                        onChange={(e, newValue) => {
                                            // console.log('newValue ', newValue)
                                            setEstadoServicio(newValue ? newValue.value : '')
                                        }}
                                    /> 
                                </h1>
                            </div>
                            <h5 className="description-services" name="edit">Descripción:<br/> 
                                <TextField 
                                    id="outlined-basic" 
                                    variant="outlined" 
                                    name="description"
                                    onChange={(e) => setDescripcionServicio(e.target.value)}
                                    value={descripcionServicio} 
                                    disabled={estadoServicio === 'Rechazado' ? true : false}
                                    multiline
                                />
                            </h5>
                            {/* eslint-disable-next-line */}
                            {getValue.númeroActa ? <a href={urlCertificate} target="_blank" type="button"><h6 name="number-certificate-departure" style={{marginTop: '10px'}}><img src="/assets/getServices/exit.png" alt="" />Acta de Salida No. {getValue.númeroActa}</h6></a> : '' }
                        </div>
                        <div className="state-priority-billing">
                            <div className="card-service">
                                <h2>Estado</h2>
                                <h4 className="state-edit" name={getValue.Estado}>{getValue.Estado}</h4>
                            </div>
                            <div className="card-service">
                                <h2>Prioridad</h2>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    className='priority-select'
                                    name={prioridad}
                                    value={prioridad}
                                    disabled={estadoServicio === 'Rechazado' ? true : false}
                                    options={[
                                        { value: 'BAJA', label: 'BAJA' },
                                        { value: 'MEDIA', label: 'MEDIA' },
                                        { value: 'ALTA', label: 'ALTA' }
                                    ]}
                                    renderInput={(params) => <TextField {...params} />}
                                    isOptionEqualToValue={(option, value) =>
                                        value === undefined || value === "" || option.id === value.id
                                    }
                                    onChange={(e, newValue) => {
                                        setPrioridad(newValue ? newValue.value : '')
                                    }}
                                />
                            </div>
                            <div className="card-service">
                                    <h4 className="state-invoice" name={getValue.FacturaciónServicio}>{getValue.FacturaciónServicio}<br />{getValue.FechaFacturación}</h4>
                            </div>
                        </div>
                            <div className="button-update-service">
                                <HtmlTooltip title="Actualizar Servicio" placement="top" arrow>
                                    <button onClick={onModalUpdate} disabled={loading}><img src="/assets/icon/save.png" alt="update-service" /></button>
                                </HtmlTooltip>
                            </div>
                            <Modal open={modalUpdate} close={onModalUpdate}>
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
                                        <h2>Actualizar Servicio</h2>
                                    </div>
                                    <p className='pModalDelete'>¿Desea confirmar la actualización de su servicio?</p>
                                    <div className='modal-buttons'>
                                        <Button color="Primary" onClick={handleClick}>Enviar</Button>
                                        <Button onClick={()=>setModalUpdate(false)}>Cancelar</Button>
                                    </div>
                                </div></motion.div>
                            </Modal>
                            <div className="css-cpgvjg-MuiSnackbar-root" name="edit">
                                <Stack spacing={1} sx={{ width: '100%' }}>
                                    <Snackbar open={!!errorEdit} autoHideDuration={5000} onClose={handleClose}>
                                            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                                                <p>{errorEdit}</p>
                                            </Alert>
                                    </Snackbar>
                                </Stack>

                                <Stack spacing={2} sx={{ width: '100%' }}>
                                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                                                Servicio Actualizado Con Exito
                                            </Alert>
                                    </Snackbar>
                                </Stack>
                            </div>
                    </div>
                    <div className="hr-square-content-service-horizontal">
                        <hr />
                    </div>
                    <div className="inf-bottom-service">
                        <div className="people-involved" name="edit">
                            <div className="provider">
                                <div className="main-inf-provider">
                                    <h4>Proveedor</h4>
                                    <div className="autocomplete-other">
                                        <h2>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                className="input-editPosts"
                                                name="provider-edit"
                                                value={proovedor}
                                                disabled={estadoServicio === 'Rechazado' ? true : false}
                                                options={providers.map((providerItem) => {
                                                    return {value: providerItem.proveedores, label: providerItem.proveedores}
                                                })}
                                                renderInput={(params) => <TextField {...params} label="Nombre" />}
                                                isOptionEqualToValue={(option, value) =>
                                                    value === undefined || value === "" || option.id === value.id
                                                }
                                                onChange={(e, newValue) => {
                                                    setProovedor(newValue ? newValue.value : '')
                                                }}
                                            />
                                        </h2>
                                        <div className="other" name="edit-services">
                                            {/*console.log('proovedor',proovedor)*/}
                                            {proovedor === 'OTROS ' &&
                                            <TextField 
                                                id="outlined-basic" 
                                                label="Nuevo Proveedor" 
                                                variant="outlined" 
                                                onChange={(e) => setSolicitudProveedor(e.target.value)}
                                                value={solicitudProveedor}
                                            />}
                                        </div>
                                    </div>
                                </div>
                                <div className="content-number-creditor">
                                    <h3>N° Acreedor</h3>
                                    <h3>{getValue.NúmeroAcreedor}</h3>
                                </div>
                            </div>
                            <div className="request">
                                <div className="main-inf-request">
                                    <h4>Solicita</h4>
                                    <h2>{getValue.Solicita}</h2>
                                </div>
                                <div className="inf-request">
                                    <div className="date-request" name="edit">
                                        <h2>FECHA</h2>
                                        <h3>{getValue.FechaSolicitud}</h3>
                                    </div>
                                    <div className="imputation-request" name="edit">
                                        <h2>IMPUTACIÓN</h2>
                                        <h3>
                                            <TextField 
                                                id="outlined-basic" 
                                                variant="outlined" 
                                                disabled={estadoServicio === 'Rechazado' ? true : false}
                                                onChange={(e) => setImputaciónSolicita(e.target.value)}
                                                value={imputaciónSolicita} 
                                                multiline
                                            />
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="authorize">
                                <div className="main-inf-authorize">
                                    <h4>Autoriza</h4>
                                    <h2>{estadoServicio !== 'Rechazado' ? getValue.CoordinadorAutoriza : estadoServicio === "Aprobado" && user ? user.name : ''}</h2>
                                </div>
                                <div className="inf-authorize">
                                    <div className="inf-authorize-observations">
                                        <div className="date-authorize" name="edit">
                                            <h2>FECHA</h2>
                                            <h3>{estadoServicio !== 'Rechazado' ? getValue.FechaAprobación : imputaciónAutoriza !== "" && getDateTime()}</h3>
                                        </div>
                                        <div className="imputation-authorize" name="edit">
                                            <h2>IMPUTACIÓN</h2>
                                            <h3>
                                                <TextField 
                                                    id="outlined-basic" 
                                                    variant="outlined" 
                                                    disabled={estadoServicio === 'Rechazado' ? true : false}
                                                    onChange={(e) => setImputaciónAutoriza(e.target.value)}
                                                    value={imputaciónAutoriza} 
                                                    multiline
                                                />
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hr-square-content-service-vertical" name="edit">
                            <hr />
                        </div>
                            <div className="quotation-valueBeforeVat-reliability" name="edit">
                                <div className="quotation-valueBeforeVat" name="edit">
                                        <div className="content-quotation">
                                            <h2>Cotización</h2>
                                            <div className="inf-quotation" name="edit">
                                                <h3>
                                                    <TextField 
                                                        id="outlined-basic" 
                                                        label="Nombre" 
                                                        variant="outlined" 
                                                        disabled={estadoServicio === 'Rechazado' ? true : false}
                                                        onChange={(e) => setNombreCotización(e.target.value)}
                                                        value={nombreCotización}
                                                    /> 
                                                </h3>
                                                {/* eslint-disable-next-line */}
                                                <a href={urlQuotation} target="_blank" type="button">PDF</a> 
                                            </div>
                                        </div>
                                        <div className="content-valueBeforeVat">
                                            <h2>Valor antes del IVA</h2>
                                            <div className="content-moneys-valueBeforeVat">
                                                <div className="moneys-valueBeforeVat">
                                                    <div className="type-money">
                                                        <h3>COP</h3>
                                                    </div>
                                                    <div className="money-valueBeforeVat" name="edit">
                                                        <h4>
                                                            <TextField 
                                                                id="outlined-basic" 
                                                                sx={{ width: 130 }} 
                                                                disabled={estadoServicio === 'Rechazado' ? true : EUR !== '' || USD !== '' ? true : false}
                                                                variant="outlined"
                                                                onChange={(e) => setCOP(e.target.value)}
                                                                value={COP}
                                                                type="text"
                                                            />
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div className="moneys-valueBeforeVat">
                                                    <div className="type-money">
                                                        <h3>USD</h3>
                                                    </div>
                                                    <div className="money-valueBeforeVat" name="edit">
                                                        <h4>
                                                            <TextField 
                                                                    id="outlined-basic" 
                                                                    sx={{ width: 130 }} 
                                                                    disabled={estadoServicio === 'Rechazado' ? true : EUR !== '' || COP !== '' ? true : false}
                                                                    variant="outlined"
                                                                    onChange={(e) => setUSD(e.target.value)}
                                                                    value={USD}
                                                                    type="text"
                                                            /> 
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div className="moneys-valueBeforeVat">
                                                    <div className="type-money">
                                                        <h3>EUR</h3>
                                                    </div>
                                                    <div className="money-valueBeforeVat" name="edit">
                                                        <h4>
                                                            <TextField 
                                                                    id="outlined-basic" 
                                                                    sx={{ width: 130 }} 
                                                                    disabled={estadoServicio === 'Rechazado' ? true : USD !== '' || COP !== '' ? true : false}
                                                                    variant="outlined"
                                                                    onChange={(e) => setEUR(e.target.value)}
                                                                    value={EUR}
                                                                    type="text"
                                                            /> 
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="observations-reliability" onClick={onModalObservations}>
                                            <img src="/assets/view/eye.png" alt="" />
                                            <div className="alert-observations-autorize" name={getValue.ObservacionesAutoriza}>!</div>
                                            <div className="alert-observations-reliability" name={getValue.ObservacionesConfiabilidad}>!</div>
                                        </button>
                                </div>
                                    <div className="hr-square-content-service-horizontal-short">
                                        <hr />
                                    </div>
                                    <div className="reliability">
                                        <div className="date-order">
                                            <h4>Fecha generación orden</h4>
                                            <h2>{getValue.FechaGeneraciónOrden}</h2>
                                        </div>
                                        <div className="solped">
                                            <h4>Solped</h4>
                                            <h2>{getValue.Solped}</h2>
                                        </div>
                                        <div className="order" name="edit">
                                            <h4>Orden de compra</h4>
                                            <div className="order-pdf-number">
                                                <h2>{getValue.OrdenCompra}</h2>
                                                {/* eslint-disable-next-line */}
                                                {PDFOrdenCompra && <a href={PDFOrdenCompra} target="_blank" class="button">PDF</a>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                </div>
            {/* {rows.map((row) => (
                <div>
                {row.FechaSolicitud}   
                </div>
            ))} */}
            <Modal
                open={modalObservations}
                onClose={onModalObservations}>
                    {bodyModalObservations}
            </Modal>
        </div>
    )
}