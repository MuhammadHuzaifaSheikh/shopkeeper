import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import {forwardRef} from 'react';
import {IconButton, Button, Dialog, DialogContent, CircularProgress, Typography} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import MuiAlert from '@material-ui/lab/Alert';

import {useHistory} from "react-router-dom";
import storage from '../../config/Config'
import {
    AddBox,
    ArrowDownward,
    Check,
    ChevronLeft,
    ChevronRight,
    Clear,
    DeleteOutline,
    Edit,
    FilterList,
    FirstPage,
    LastPage,
    Remove,
    SaveAlt,
    Search,
    ViewColumn
} from '@material-ui/icons';
import Snackbar from "@material-ui/core/Snackbar";


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const storageRef = storage.ref();

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};


export default function Salsman() {

    const history = useHistory()


    const [dialogText, setDialogText] = useState('Loading....')
    const [openDialog, setOpenDialog] = useState(false)
    const [moveCircle, setMoveCircle] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [variant, setVariant] = useState('success')
    let image = {
        width: '50px',
        height: '50px'
    }


    const [state, setState] = React.useState({
        columns: [
            {title: 'Edit', field: 'edit'},
            {title: 'Salesman Name', field: 'name'},
            {title: 'Phone', field: 'phone'},
            {title: 'Bonus %', field: 'bonus'},
            {title: 'Email', field: 'email'},
            {title: 'Avatar', field: 'avatar'},
        ],
        data: [],
    });

    useEffect(function () {

        setOpenDialog(true)
        setMoveCircle(true)
        setDialogText('Loading ....')

        let url = 'http://localhost:5000/salesman/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({shopkeeperId: localStorage.getItem('shopKeeper'),}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                console.log(response,'response');
                response.data.forEach(function (i) {
                    i.avatar= <img style={image} src={i.photoUrl} alt=""/>
                    i.edit= <IconButton onClick={()=>editSalesman(i._id)} edge="end" aria-label="delete"><Edit/></IconButton>
                    console.log(i.photoUrl,'--------------');
                    setState((prevState) => {
                        const data = [...prevState.data];
                        data.push(i);
                        return { ...prevState, data };
                    });

                })
                if (response.data) {


                    setOpenDialog(false)

                    setMoveCircle(false)


                }
            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');
                if (error === "TypeError: Failed to fetch") {
                    setDialogText('Loading ....')

                }
                setDialogText('Loading ....')

            });
    }, [])

    function onClose() {
        setSnackbarOpen(false)
    }

    function editSalesman(id) {
        console.log(id);
        history.push('/dashboard/editsalesman/'+id)
    }

    function deleteSalesman(id,photoName) {
        setOpenDialog(true)
        setMoveCircle(true)
        setDialogText('Loading ....')

        let url = 'http://localhost:5000/salesman/delete'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({id}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                console.log(response);
                if (response.data) {
                    setOpenDialog(false)
                    setMoveCircle(false)


                }
                let desertRef = storageRef.child(photoName);

                desertRef.delete().then(()=> {
                    console.log(photoName,' success fully deleted');
                }).catch((error)=> {
                    console.log(error);
                });




                setSnackbarOpen(true)
                setSnackbarMessage("salesman Successfully deleted!")
                setVariant('success')


                // history.push('/main/find/' +response.data._id)

            })



        })
            .catch((error) => {
                console.log(error);
                setOpenDialog(false)
                setMoveCircle(false)
                setDialogText('Check your internet connection ....')


            });

    }

    function addNewSelsman() {
        history.push('/dashboard/addsalesmans')
    }


    return (

        <div className='main'>

            <div>
                <h2>All salesmans</h2>
                <Button onClick={addNewSelsman} style={{float: 'right', marginTop: '-54px', marginLeft: '-162px'}}
                        className='add_new' variant="contained" color="primary"><AddCircleOutlineIcon/> New
                    salesman</Button>
            </div>
            <MaterialTable
                icons={tableIcons}
                title="Editable Example"
                columns={state.columns}
                data={state.data}
                editable={{
                    onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                setState((prevState) => {
                                    const data = [...prevState.data];
                                    data.splice(data.indexOf(oldData), 1);
                                    console.log(oldData);
                                    deleteSalesman(oldData._id,oldData.photoName)
                                    return { ...prevState, data };
                                });
                            }, 600);
                        }),
                }}
            />
            <Snackbar style={{bottom: "10px"}} anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }} open={snackbarOpen} onClose={onClose}>
                <Alert onClose={onClose} severity={variant}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Dialog fullWidth
                    open={openDialog}
                    onClose={openDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogContent style={{textAlign: "center", paddingTop: "30px"}}>
                    <CircularProgress color="primary"/>
                    <Typography>{dialogText} </Typography>
                </DialogContent>
            </Dialog>
        </div>


    );
}
