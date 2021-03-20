import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton';
import { Typography } from '@material-ui/core';

 export default function LoadingTable(props){
    return(
        <div style={{marginTop: '30px'}}>
            <Typography variant="h3">
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </Typography>
        </div>
    )
 }