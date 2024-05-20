
export const getLoggedInUser = () => {
    if(localStorage.getItem("authUser")|| ""){
        const token = JSON.parse(atob(localStorage.getItem("authUser") || ""))
        if(token)
            return token;
        return null;
    }

}
