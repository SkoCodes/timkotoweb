export const messageType = {
    warning : "alert-warning",
    danger : "alert-danger"
};

export function Message({text, messageType}){
    return(
        <div className ={`alert ${messageType}`} >
            {text}
        </div>
    );
}

