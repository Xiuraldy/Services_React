export const useDeleteUser = (cb) => {
    function deleteId(id) {
        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
        };
    
        fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.error){
                    throw new Error(result.error)
                }
                cb()
        })
    }
    return {deleteId}
}