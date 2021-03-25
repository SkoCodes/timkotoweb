import React, { useState } from 'react'
import { TableCell, TableRow, Checkbox } from '@material-ui/core';

export default function PlayerTableRow(props){
    const [checked, setChecked] = useState(false)

    const handleCheck = () =>{
        setChecked(!checked)
    }

    return(
            <TableRow onClick={handleCheck} style={{cursor: 'pointer'}}>
                <TableCell>
                <Checkbox
                    checked={checked}
                />
                </TableCell>
                <TableCell align="left">{props.data.team}</TableCell>
                <TableCell align="left">{props.data.playerName}</TableCell>
                <TableCell align="left">{props.data.jersey}</TableCell>
                <TableCell align="left">{props.data.salary}</TableCell>
            </TableRow>
    )
}