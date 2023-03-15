const arrayToJson = (data, keys) => {
    return data.map((item) => {
        // console.log('item -->', item)
        return item.reduce((acc, cur, i) => {
            return {
                ...acc, 
                [keys[i]]: cur
            }
        }, {})
    })
} 

module.exports = {arrayToJson}