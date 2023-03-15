export const useGetDateTime = () => {
    const getDateTime = () => {
        var fecha = new Date(); //Fecha actual
        var mes = fecha.getMonth()+1; //obteniendo mes
        var dia = fecha.getDate(); //obteniendo día
        var ano = fecha.getFullYear(); //obteniendo año
        var hora = fecha.getHours(); //obteniendo hora
        var minutos = fecha.getMinutes(); //obteniendo minuto
        
        const datetime = minTwoDigits(dia)+"/"+minTwoDigits(mes)+"/"+ano+" "+minTwoDigits(hora)+":"+minTwoDigits(minutos);
        return datetime
    }
    
    const minTwoDigits = (n) => {
      return (n < 10 ? '0' : '') + n;
    }
    return {getDateTime}
}