// Transforma los datos que trae en formato csv a JSON

const csvJSON = (csv) => {
    // console.log('csv ->', csv)

    const newArray = []
    let word = ''
    let isWord = false

    for (let index = 0; index < csv.length; index++) {
        const element = csv[index];
        if(element === '"' && !isWord) {
            isWord = true
            continue
        }
        if(element === '"') {
            isWord = false
            newArray.push(word)
            word = ''
            continue
        }
        if(element === ',' && !isWord) {
            continue
        }
        if(element === '\n' && !isWord) {
            newArray.push('\n')
            continue
        }
        word += element
    }

    const lines = []
    let arrayLine = []
    for (let index = 0; index < newArray.length; index++) {
        const element = newArray[index];
        if(element === '\n'){
            lines.push(arrayLine)
            arrayLine = []
            continue
        }
        arrayLine.push(element)
    }
    lines.push(arrayLine)
    // console.log('lines ->', lines)
    var result = [];
    
    var headers=lines[0];
    
    for(var i=1;i<lines.length;i++){
        
        var obj = {};
        var currentline=lines[i];
        
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        
        result.push(obj);
        
    }
    //return result; //JavaScript object
    // console.log('result ->', result)
    return result; //JSON
}

module.exports = {csvJSON}