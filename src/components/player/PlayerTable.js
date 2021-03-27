import React, { useState } from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@material-ui/core';
import PlayerTableRow from './PlayerTableRow';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
    tableRow: {
        height: 30
      },
      tableCell: {
        padding: "1px 16px"
    }
  });

export default function PlayerTable(props){
    const classes = useStyles();
    const [checked, setChecked] = useState(false)
    const [maximum, setMaximum] = useState(0)
    const [selected, setSelected] = useState(0)
    

    const handleCheck = () =>{
        setChecked(!checked)
    }

    const handleReducedSalary = (data, check) =>{
            props.updateSalarycap(props.salarycap - data)
    }

    const handleAddSalary = (data) =>{
            props.updateSalarycap(props.salarycap + data)
    }

    // const handleSetSelected = (data) =>{
    //     setSelected
    // }

    // const handleUpdateMaximun = (data) =>{
    //     setMaximum(data)
    // }
    return(
        <div>
            <TableContainer className={classes.container}>
                <Table stickyHeader>
                    <TableHead>
                    <TableRow>
                        <TableCell align="left" className={classes.tableCell}>Team</TableCell>
                        <TableCell align="left" className={classes.tableCell}>Name</TableCell>
                        <TableCell align="left" className={classes.tableCell}>Salary</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.data.map((player,index) => (
                        <PlayerTableRow maximum={maximum} updateMaximum={setMaximum} selected={selected} updateSelected={setSelected} salarycap={props.salarycap} addSalary={handleAddSalary} reduceSalary={handleReducedSalary} key={index} data={player}/>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}