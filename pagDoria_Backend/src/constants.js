//Nombres de las Hojas (Según el Subrol)
const HOJAS_BY_TYPE = {
    mechanic: 'JEFATURA MECANICA',
    windmill: 'JEFATURA SERVICIOS_MOLINO',
    electric: 'JEFATURA ELECTRICA',
    metrology: 'JEFATURA METROLOGIA',
    capex: 'CAPEX',
    reliability: 'CONFIABILIDAD_DIRECCIÓN'
}

//Id's en las url's de las Hojas (Según el Subrol)
const HOJAS_BY_GID = {
    mechanic: '534266823',
    windmill: '0',
    electric: '807776253',
    reliability: '647389262',
    capex: '1030792488',
    metrology: '523740557'
}

module.exports = {HOJAS_BY_TYPE, HOJAS_BY_GID}