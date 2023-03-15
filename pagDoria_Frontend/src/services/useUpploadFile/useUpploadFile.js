export const useUpploadFile = () => {

    const upploadFile = (file, folderId) => {
        if(!file){
            return
        }
        var reader = new FileReader() //this for convert to Base64 
        reader.readAsDataURL(file) //start conversion...
        reader.onload = function (e) { //.. once finished..
        var rawLog = reader.result.split(',')[1]; //extract only thee file data part
        var dataSend = { dataReq: { data: rawLog, name: file.name, type: file.type, folderId: folderId }, fname: "uploadFilesToGoogleDrive" }; //preapre info to send to API
        // console.log('dataSend ->', dataSend)
        fetch('https://script.google.com/macros/s/AKfycbyx69L0fZwzxRNMjwbVyyVlBMfPzGhpnwEs6LEQckPuXIEfYt5c0p5IBK0W2Ol6uJCS/exec', //your AppsScript URL
        { method: "POST", mode: 'no-cors', body: JSON.stringify(dataSend) }) //send to Api
        .then(res => res.json()).then((a) => {
            console.log(a) //See response
        }).catch(e => console.log(e)) // Or Error in console
    }
    }
    return {upploadFile}
} 
