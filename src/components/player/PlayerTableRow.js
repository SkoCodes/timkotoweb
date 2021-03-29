import React, { useState, useEffect } from 'react'
import { TableCell, TableRow, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

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
        padding: "10px 16px"
    }
  });

export default function PlayerTableRow(props){
    const classes = useStyles();

    // const handleCheck = (salary) =>{
    //     if(checked){
    //         props.addSalary(salary)
    //         props.updateSelected(props.selected - 1)
    //         setChecked(!checked)
    //     }
    //     else{
    //         if(props.selected === props.maximum){
    //             setOpenDialog(true)
    //             console.log('max')
    //         }
    //         else{
    //             setChecked(!checked)
    //             props.reduceSalary(salary)
    //             props.updateSelected(props.selected + 1)
    //         }
    //     }
    // }

    return(
        <>
            <TableRow style={{backgroundColor: `${props.selected ? '#dfe6e9':'white'}`}}>
                <TableCell align="left" className={classes.tableCell}>{props.data.team}</TableCell>
                <TableCell align="left" className={classes.tableCell}>{"#"+props.data.jersey+" "+props.data.playerName}</TableCell>
                <TableCell align="left" className={classes.tableCell}>{props.data.salary}</TableCell>
            </TableRow>
        </>
    )
}