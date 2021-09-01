import React, {useEffect, useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, ButtonGroup, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList, TextField} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Axios from 'axios';


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    margin: {
        margin: theme.spacing(3),
    },
    reverButton: {
      margin: theme.spacing(1),
      padding: theme.spacing(1,8),
      visibility: 'hidden',
    },
    padding: {
        padding: theme.spacing(1,8),
        margin: theme.spacing(1),
        '&:hover': {
          background: "grey",
       },
    },
    selected: {
      padding: theme.spacing(1,8),
      margin: theme.spacing(1),
      background: 'green',
    },
    textfeild: {
      padding: theme.spacing(2,0)
    },
  }));

  const options = ['Select a Doc'];
  let timmer ;
  
export default function DocData() {
    
    const [data, setData] = useState();
    const [sheets, setSheets] = useState();
    const [sheet, setSheet] = useState();
    const [sheetIndex, setSheetIndex] = useState(1);
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [index, setIndex] = useState()
    
    
    const handleClick = () => {
        console.info(`You clicked ${options[selectedIndex]}`);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        let id =null;
        setData(sheets[index-1].changes[sheets[index-1].changes.length-1].text);
        for (let i = 0; i < sheets.length; i++) {
          if(sheets[i].sheetName === options[index]){
            id = sheets[i]._id;
            setSheetIndex(i);
            setIndex(sheets[i].changes.length-1);
          } 
        }
        document.getElementById("revertion").style.visibility = "hidden";
        setSheet(id);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
        }
        setOpen(false);
    };

    const getSheets = () => {
      Axios.get('http://localhost:5000/api/sheets/').then((Response)=> {
        console.log(Response.data);
        setSheets( Response.data );
        for (let index = 0; index < Response.data.length; index++) {
          options.push(Response.data[index].sheetName);
        }
      });
    }

    useEffect (()=> {
      getSheets();
    },[]);

    // const getSheet = () =>  {
    //   Axios.get('http://localhost:5000/api/sheet/'+sheet).then((response)=>{
    //     console.log(response);
    //   })
    // }

    const sendData = (value) => {
      console.log(sheets);      
      if(!sheets){
        alert('Please select sheet before update.');
        return;
      }
      const updatedSheets = [...sheets];
      updatedSheets[sheetIndex].changes.push({text:value});
      console.log(updatedSheets[sheetIndex].changes);
      
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSheets[sheetIndex].changes)
      };
      fetch('http://localhost:5000/api/sheet/'+sheet, requestOptions).then((res) =>{
        setIndex(updatedSheets[sheetIndex].changes.length-1);
        setSheets(updatedSheets);
      })
    }

    function changeVersion (event, index) {
      if(sheets)
      {if(index !== sheets[sheetIndex].changes.length-1){
        document.getElementById("revertion").style.visibility = "visible";
      } else{
        document.getElementById("revertion").style.visibility = "hidden";
      }}
      setData(sheets[selectedIndex-1].changes[index].text);
      setIndex(index);
    }

    const revertVersion = () => {
      const updatedSheets = [...sheets];
      if(sheets){
        if(index !== updatedSheets[sheetIndex].changes.length-1){
          console.log(updatedSheets[sheetIndex].changes.slice(0,index+1));
          
          const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSheets[sheetIndex].changes.slice(0,index+1))
          };
          fetch('http://localhost:5000/api/sheet/'+sheet, requestOptions).then((res) =>{ 
            updatedSheets[sheetIndex].changes = updatedSheets[sheetIndex].changes.slice(0,index+1);
            setSheets(updatedSheets);
          })
        }
      }
    }
    
    const handleChange = (event) => {
        if(timmer){
          clearTimeout(timmer);
        }
        setData(event.target.value);
        
        timmer = setTimeout(()=>{
          sendData(event.target.value);          
        }, 2000);
    }
    return (
        <div>
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                    <Paper className={classes.paper}>
                    <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                        <Button
                            color="primary"
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                            <ArrowDropDownIcon />
                        </Button>
                        </ButtonGroup>
                        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition >
                        {({ TransitionProps, placement }) => (
                            <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                            }}
                            >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu">
                                    {options.map((option, index) => (
                                    <MenuItem
                                        key={option}
                                        disabled={index === -1}
                                        selected={index === selectedIndex}
                                        onClick={(event) => handleMenuItemClick(event, index)}
                                    >
                                        {option}
                                    </MenuItem>
                                    ))}
                                </MenuList>
                                </ClickAwayListener>
                            </Paper>
                            </Grow>
                        )}
                        </Popper>
                    </Paper>
                    </Grid>
                    <Grid item xs={8}>
                    <Paper className={classes.paper}>
                      <TextField
                        id="filled-full-width"
                        label="Doc"
                        style={{ margin: 8 }}
                        helperText="Full width!"
                        fullWidth
                        multiline
                        className={classes.textfeild}
                        rows={24}
                        margin="normal"
                        value={data}  
                        onChange={handleChange}
                      ></TextField>
                      <Button variant="contained" color="primary" id="revertion" onClick={revertVersion}className={classes.reverButton}>Revert</Button>
                     </Paper>
                    </Grid>
                    <Grid item xs={4}>
                    <Paper className={classes.paper}> 
                      {(!selectedIndex) ? <Button variant="contained" color="primary" className={classes.padding}>Current Version</Button> :
                        sheets[sheetIndex].changes.map((change, idx)=> (
                        <Button variant="contained" color="primary" key={idx} className={(idx === index) ? classes.selected : classes.padding} onClick={(event)=> changeVersion(event, idx)}>Version {idx+1}</Button>
                      ))}
                      
                    </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}