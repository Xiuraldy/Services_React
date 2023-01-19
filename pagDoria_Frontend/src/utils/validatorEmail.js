export const validatorEmail = (email) => {
    const regexEmail =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!email || !regexEmail.test(email)) {
            return false
        }
    return true
}