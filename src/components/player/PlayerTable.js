import React, { useState, useEffect } from 'react'
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
        padding: "5px 2px"
    }
  });

export default function PlayerTable(props){
    const classes = useStyles();

    useEffect(()=>{
        updateMaximum()
    })

    const updateMaximum = () =>{
        if(props.data.position === "C"){
            props.updateMaximum(1)
        }
        else{
            props.updateMaximum(2)
        }
    }
    
    const formatNumber = (num) => {
        if (num == undefined || num == undefined) return
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return(
        <div>
            <TableContainer className={classes.container} style={{marginTop: '10px'}}>
                <Table stickyHeader className={classes.container}>
                    <TableHead>
                    <TableRow>
                        <TableCell align="left" className={classes.tableCell}>Team </TableCell>
                        <TableCell align="left" className={classes.tableCell}>Name</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Salary</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.data.players.map((player,index) => (
                        <TableRow key={index} onClick={()=>props.onSelectPlayer(player.position, player.playerId, player.selected, player.salary)} style={{backgroundColor: `${player.selected ? '#dfe6e9':'white'}`}}>
                            <TableCell align="left" className={classes.tableCell}>{player.team}</TableCell>
                            <TableCell align="left" className={classes.tableCell}>{"#"+player.jersey+" "+player.playerName}</TableCell>
                            <TableCell align="right" className={classes.tableCell}>{formatNumber(player.salary)}</TableCell>
                        </TableRow>
                        // <PlayerTableRow onClick={()=> console.log('working')} key={index} data={player}/>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}