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
    const [checked, setChecked] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)



    useEffect(()=>{
        if(props.data.position == "C"){
            props.updateMaximum(1)
            sessionStorage.setItem("maximum",1)
        }
        else{
            props.updateMaximum(2)
            sessionStorage.setItem("maximum",2)
        }
    },[])

    const handleCheck = (salary) =>{
        if(checked){
            props.addSalary(salary)
            props.updateSelected(props.selected - 1)
            setChecked(!checked)
        }
        else{
            if(props.selected === props.maximum){
                setOpenDialog(true)
                console.log('max')
            }
            else{
                setChecked(!checked)
                props.reduceSalary(salary)
                props.updateSelected(props.selected + 1)
            }
        }
    }

    return(
        <>
            <TableRow onClick={()=>handleCheck(props.data.salary, props.data.position)} style={{backgroundColor: `${checked ? '#dfe6e9':'white'}`, cursor: 'pointer'}}>
                <TableCell align="left" className={classes.tableCell}>{props.data.team}</TableCell>
                <TableCell align="left" className={classes.tableCell}>{"#"+props.data.jersey+" "+props.data.playerName}</TableCell>
                <TableCell align="left" className={classes.tableCell}>{props.data.salary}</TableCell>
            </TableRow>
            <Dialog open={openDialog}>
                <DialogContent style={{textAlign: 'center', fontSize: '25px'}}>
                    You can only select up to {props.maximum} players in {props.data.position} position.
                    <Button variant="outlined" style={{margin: '20px 0px'}} fullWidth onClick={()=>setOpenDialog(false)}>OK</Button>
                </DialogContent>
            </Dialog>
        </>
    )
}