import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function BackdropLoading(props){
    return(
        <div>
            <Backdrop style={{zIndex: 10000}} open={props.open}>
                <CircularProgress style={{color: 'white'}}/>
            </Backdrop>
        </div>
    )
}