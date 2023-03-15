import { useContext, useEffect, useState } from "react";
import { useGetAllSheets } from "../../../services/useGetSheets/useGetSheets";
import './CommonsView.css';
import { Modal, Button, TextField } from '@material-ui/core';
import { motion } from "framer-motion"
import { GlobalContext } from "../../../state/GlobalState";
import { useEditServices } from "../../../services/useEditServices/useEditServices";
import { Autocomplete } from "@mui/material";
import { FOLDERS_ID_CERTIFICATE, FOLDERS_ID_QUOTATION } from "../../../utils/constanst";
import { useGetPendingsView } from "../../../services/useGetPendingsView/useGetPendingsView";

export const CommonsView = () => {
    const [modalObservations, setModalObservations] = useState(false);
    const {getAllSheets, searcher, setSearcher, getValue, subrolSearch, setSubrolSearch, error} = useGetAllSheets()
    const {user} = useContext(GlobalContext)

    const rol = user ? user.rol : '';

    const {getPendingsView, pendingsView} = useGetPendingsView()

    useEffect(() => {
            if(user){
                getAllSheets()
                getPendingsView()
            }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            // 👇 Get input value
            getAllSheets()
        }
    };

    const onModalObservations = () => {
        setModalObservations(!modalObservations)
    }

    const PDFOrdenCompra = getValue.PDFOrdenCompra

    const [ejecuciónServicio, setEjecuciónServicio] = useState('')

    useEffect(() => {
        setEjecuciónServicio(getValue.ejecuciónServicio)
    },[getValue])

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
                        {getValue.ObservacionesAutoriza}
                        <div className="observations-message-autorize" name={getValue.ObservacionesAutoriza}>No hay comentarios.</div>
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

    const {editServices} = useEditServices(()=>{}, ()=>{}, {ejecuciónServicio: ejecuciónServicio, searcher: searcher})

    const urlCertificate = `https://drive.google.com/drive/u/0/folders/${FOLDERS_ID_CERTIFICATE[user ? user.subrol : '']}`
    const urlQuotation = `https://drive.google.com/drive/u/0/folders/${FOLDERS_ID_QUOTATION[user ? user.subrol : '']}`
    
    return (
        <div className="square-content-service">
            <div className="search-message-choose-area">
                <div className="search-service" name="commonsView">
                    <button className="button-search-service" onClick={getAllSheets}>
                        <img src="/assets/view/plane.png" alt="plane-paper" />
                    </button>
                    <input className="input-search-service" value={searcher} onChange={(e) => setSearcher(e.target.value)} onKeyDown={handleKeyDown} type="text" placeholder="N° Solicitud" />
                    {rol==='bosses' && <select className="search-sheet" value={subrolSearch} onChange={(e) => setSubrolSearch(e.target.value)} onKeyDown={handleKeyDown}>
                        <option hidden value>Área</option>
                        <option value="mechanic">Mecanico</option>
                        <option value="windmill">Servicios/Molino</option>
                        <option value="electric">Electrico</option>
                        <option value="metrology">Metrologo</option>
                        <option value="capex">CAPEX</option>
                        <option value="reliability">Confiabilidad/Dirección</option>
                    </select>}
                </div>
                <div className="carrousel-pendings" name="authorize">
                        {pendingsView.length === 0 ? <div className="title-item-pending">Estás al día</div> : <div className="title-item-pending">Sin Facturar</div>}
                        {pendingsView.map((pending) => (
                            <>
                                <button onMouseUp={(e) => setSearcher(e.target.value)} onClick={getAllSheets} value={pending} className="item-pending">
                                    {pending}
                                </button>
                            </>
                        ))}
                    </div>
                <div className="message-service-not-found">
                    {error && <h4>Servicio no encontrado</h4>}
                </div>
                <div className="message-choose-area">
                    {(searcher === '') && <p>Complete los espacios</p>}
                </div>
            </div>
                <div className="content-inf-main-service">
                    <div className="inf-main-service">
                        <div className="id-description">
                            <div className="id-img">
                                <h1>
                                    Id: {getValue.id} 
                                    {getValue.estadoServicio === 'Aprobado' && <img src="/assets/icon/approval.png" name="approval" alt="approval" />}
                                    {getValue.estadoServicio === 'Pendiente' && <img src="/assets/icon/approval.png" name="not-approval" alt="not approval" />}
                                    {getValue.estadoServicio === 'Rechazado' && <img src="/assets/icon/decline.png" name="decline" alt="decline" />}
                                </h1>
                                <h6 name={getValue.estadoServicio}>{getValue.estadoServicio}</h6>
                            </div>
                            <h5 className="description-services">Descripción: {getValue.DescripciónServicio}</h5>
                            {/* eslint-disable-next-line */}
                            {getValue.númeroActa ? <a href={urlCertificate} target="_blank" type="button"><h6 name="number-certificate-departure"><img src="/assets/getServices/exit.png" alt="" />Acta de Salida No. {getValue.númeroActa}</h6></a> : ''}
                        </div>
                        <div className="state-priority-billing">
                            <div className="card-service">
                                <h2>Estado</h2>
                                <h4 className="state-edit" name={getValue.Estado}>{getValue.Estado}</h4>
                            </div>
                            <div className="card-service">
                                <h2>Prioridad</h2>
                                <h4 name={getValue.Prioridad}>{getValue.Prioridad}</h4>
                            </div>
                            <div className="card-service">
                                    <h4 className="state-invoice" name={getValue.FacturaciónServicio}>{getValue.FacturaciónServicio}<br />{getValue.FechaFacturación}</h4>
                            </div>
                        </div>
                        <div className="departure-sticker">
                            <h4 name={getValue.numeroActa}>{getValue.numeroActa}</h4>
                        </div>
                    </div>
                    <div className="hr-square-content-service-horizontal">
                        <hr />
                    </div>
                    <div className="inf-bottom-service">
                        <div className="people-involved">
                            <div className="provider">
                                <div className="main-inf-provider">
                                    <h4>Proveedor</h4>
                                    <h2>{getValue.Proovedor}{getValue.Proveedor}</h2>
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
                                    <div className="date-request">
                                        <h2>FECHA</h2>
                                        <h3>{getValue.FechaSolicitud}</h3>
                                    </div>
                                    <div className="imputation-request">
                                        <h2>IMPUTACIÓN</h2>
                                        <h3>{getValue.ImputaciónSolicita}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="authorize">
                                <div className="main-inf-authorize">
                                    <h4>Autoriza</h4>
                                    <h2>{getValue.CoordinadorAutoriza}</h2>
                                </div>
                                <div className="inf-authorize">
                                    <div className="inf-authorize-observations">
                                        <div className="date-authorize">
                                            <h2>FECHA</h2>
                                            <h3>{getValue.FechaAprobación}</h3>
                                        </div>
                                        <div className="imputation-authorize">
                                            <h2>IMPUTACIÓN</h2>
                                            <h3>{getValue.ImputaciónAutoriza}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hr-square-content-service-vertical">
                            <hr />
                        </div>
                            <div className="quotation-valueBeforeVat-reliability">
                                <div className="content-execution-service">
                                    <div className="title-execution-service">
                                        Ejecución<br/> del servicio
                                    </div>
                                    <div className="select-execution-service">
                                        <Autocomplete
                                            disablePortal
                                            disableClearable
                                            id="combo-box-demo"
                                            className='execution-service'
                                            value={ejecuciónServicio}
                                            options={[
                                                { value: 'Ejecutado En Su Totalidad', label: 'Ejecutado En Su Totalidad' },
                                                { value: 'Ejecutado Parcialmente', label: 'Ejecutado Parcialmente' },
                                                { value: 'No Ejecutado', label: 'No Ejecutado' },
                                                { value: 'Por Ejecutar', label: 'Por Ejecutar' }
                                            ]}
                                            renderInput={(params) => <TextField {...params} />}
                                            isOptionEqualToValue={(option, value) =>
                                                value === undefined || value === "" || option.id === value.id
                                            }
                                            onBlur={() => editServices()}
                                            onChange={(e, newValue) => {
                                            // console.log('newValue ', newValue)
                                            setEjecuciónServicio(newValue ? newValue.value : '')
                                            }}
                                        /> 
                                    </div>
                                    {ejecuciónServicio === 'Ejecutado En Su Totalidad' ?
                                        <div className="img-execution-service">
                                            <img src="/assets/icon/execution/done.gif" name="done" alt="done" />
                                        </div> : ejecuciónServicio === 'Ejecutado Parcialmente' ?
                                        <div className="img-execution-service">
                                            <img src="/assets/icon/execution/partially.gif" name="partially" alt="partially" />
                                        </div> : ejecuciónServicio === 'Por Ejecutar' ?
                                        <div className="img-execution-service">
                                            <img src="/assets/icon/execution/toExecute.gif" name="toExecute" alt="toExecute" />
                                        </div> : ejecuciónServicio === "No Ejecutado" &&
                                        <div className="img-execution-service">
                                            <img src="/assets/icon/execution/kept.gif" name="kept" alt="kept" />
                                        </div>
                                    }
                                </div>
                                <div className="hr-horizontal-short-modal-coordinator">
                                        <hr />
                                </div>
                                <div className="quotation-valueBeforeVat">
                                        <div className="content-quotation">
                                            <h2>Cotización</h2>
                                            
                                            <div className="inf-quotation">
                                                <h3>{getValue.NombreCotización}</h3>
                                                {/* eslint-disable-next-line */}
                                                <a href={urlQuotation} target="_blank" class="button">PDF</a> 
                                            </div>
                                        </div>
                                        <div className="content-valueBeforeVat">
                                            <h2>Valor antes del IVA</h2>
                                            <div className="content-moneys-valueBeforeVat">
                                                <div className="moneys-valueBeforeVat">
                                                    <div className="type-money">
                                                        <h3>COP</h3>
                                                    </div>
                                                    <div className="money-valueBeforeVat">
                                                        <h4>{getValue.COP}</h4>
                                                    </div>
                                                </div>
                                                <div className="moneys-valueBeforeVat">
                                                    <div className="type-money">
                                                        <h3>USD</h3>
                                                    </div>
                                                    <div className="money-valueBeforeVat">
                                                        <h4>{getValue.USD}</h4>
                                                    </div>
                                                </div>
                                                <div className="moneys-valueBeforeVat">
                                                    <div className="type-money">
                                                        <h3>EUR</h3>
                                                    </div>
                                                    <div className="money-valueBeforeVat">
                                                        <h4>{getValue.EUR}</h4>
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
                                        <div className="order">
                                            <h4>Orden de compra</h4>
                                            <div className="order-pdf-number">
                                                <h2>{getValue.OrdenCompra}</h2>
                                                {/* eslint-disable-next-line */}
                                                {PDFOrdenCompra && <a href={PDFOrdenCompra} target="_blank" type="button">PDF</a>} 
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