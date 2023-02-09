import { useContext, useEffect, useState } from "react";
import { useGetAllSheets } from "../../../services/useGetSheets/useGetSheets";
import './CommonsView.css';
import { Modal, Button } from '@material-ui/core';
import { motion } from "framer-motion"
import { GlobalContext } from "../../../state/GlobalState";

export const CommonsView = () => {
    const [modalObservations, setModalObservations] = useState(false);
    const {getAllSheets, searcher, setSearcher, getValue, subrolSearch, setSubrolSearch, error} = useGetAllSheets()
    const {user} = useContext(GlobalContext)

    const subrol = user ? user.subrol : '';
    const rol = user ? user.rol : '';

    useEffect(() => {
      getAllSheets()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
    
    return (
        <div className="square-content-service">
            <div className="search-message-choose-area">
                <div className="search-service">
                    <button className="button-search-service" onClick={getAllSheets}>
                        <img src="/assets/view/plane.png" alt="plane-paper" />
                    </button>
                    <input className="input-search-service" value={searcher} onChange={(e) => setSearcher(e.target.value)} type="text" placeholder="N° Solicitud" />
                    {rol==='bosses' && <select className="search-sheet" value={subrolSearch} onChange={(e) => setSubrolSearch(e.target.value)}>
                        <option hidden value>Subrol</option>
                        <option value="mechanic">Mecanico</option>
                        <option value="windmill">Servicios/Molino</option>
                        <option value="electric">Electrico</option>
                        <option value="metrology">Metrologo</option>
                        <option value="capex">CAPEX</option>
                        <option value="reliability">Confiabilidad/Dirección</option>
                    </select>}
                </div>
                <div className="message-service-not-found">
                    {error && <h4>Servicio no encontrado</h4>}
                </div>
                <div className="message-choose-area">
                    {(rol === 'bosses' & subrolSearch === '' || searcher === '') && <p>Complete los espacios</p>}
                </div>
            </div>
                <div className="content-inf-main-service">
                    <div className="inf-main-service">
                        <div className="id-description">
                                <h1>
                                    Id: {getValue.id}
                                </h1>
                            <h5 className="description-services">Descripción: {getValue.DescripciónServicio}</h5>
                        </div>
                        <div className="state-priority-billing">
                            <div className="card-service">
                                <h2>Estado</h2>
                                <h4 name={getValue.Estado}>{getValue.Estado}</h4>
                            </div>
                            <div className="card-service">
                                <h2>Prioridad</h2>
                                <h4 name={getValue.Prioridad}>{getValue.Prioridad}</h4>
                            </div>
                            <div className="card-service">
                                    <h4 name={getValue.FacturaciónServicio}>{getValue.FacturaciónServicio}<br />{getValue.FechaFacturación}</h4>
                            </div>
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
                                <div className="quotation-valueBeforeVat">
                                        <div className="content-quotation">
                                            <h2>Cotización</h2>
                                            
                                            <div className="inf-quotation">
                                                <h3>{getValue.NombreCotización}</h3>
                                                <a href='https://drive.google.com/drive/folders/1ZY2TlOU9Je4hJFoDoPLz_jvMvg3XnTGz' target="_blank" class="button">PDF</a>
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