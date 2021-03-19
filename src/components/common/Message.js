import Alert from '@material-ui/lab/Alert';

export default function Message(props){
    return(
        <div>
            <Alert severity={props.messageType}>{props.text}</Alert>
        </div>
    );
}

