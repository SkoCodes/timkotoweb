import React, { useState } from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@material-ui/core';
import PlayerTableRow from './PlayerTableRow';

export default function PlayerTable(props){
    const [checked, setChecked] = useState(false)

    const handleCheck = () =>{
        setChecked(!checked)
    }
    return(
        <div>
            <TableContainer style={{minWidth: 300, minHeight: 300}}>
                <Table stickyHeader>
                    <TableHead>
                    <TableRow>
                        <TableCell>{""}</TableCell>
                        <TableCell align="left">Team</TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Number</TableCell>
                        <TableCell align="left">Salary</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.data.map((player,index) => (
                        <PlayerTableRow key={index} data={player}/>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}