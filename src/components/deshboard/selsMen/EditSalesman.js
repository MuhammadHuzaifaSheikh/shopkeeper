import React, {useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import '../../config/Config'
import firebase from "firebase";
import {useHistory, useParams} from "react-router-dom";
import Background from "../../backgroundImage/sidebar-2.d30c9e30.jpg";
import ImageUpload from "../imageUpload/ImageUpload";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {CircularProgress, Dialog, DialogContent} from "@material-ui/core";
import storage from "../../config/Config";
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const storageRef = storage.ref();



const useStyles = makeStyles((theme) => ({
    main: {
        backgroundImage: `linear-gradient(90deg, rgba(2,0,36,0.7) 0%, rgba(9,132,227,0.7) 49%, rgba(0,212,255,1) 100%),url(${Background})`,
        backgroundSize: 'cover',
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'

    },
    container: {
        background: 'rgba(555,555,555,0.8)',
        height: '93vh',
        width: '45%',
        borderRadius: '20px',
        boxShadow: ' 0px 0px 22px 0px rgba(46, 50, 50, 0.69)',
        margin:'10px'

    },
    paper: {
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function EditSalsman() {
    const classes = useStyles();
    let history = useHistory();
    let { id } = useParams();




    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [bonus, setBonus] = useState('');
    const [photoUrl, setPhotoUrl] = useState('')
    const [photoName, setPhotoName] = useState('')

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [variant, setVariant] = useState('success')
    const [openImageCropper, setOpenImageCropper] = useState(false)

    const [dialogText, setDialogText] = useState('Loading....')
    const [openDialog, setOpenDialog] = useState(false)
    const [moveCircle, setMoveCircle] = useState(false)

    useEffect(function () {
        getSalesmanDetail()
    },[])

    function getSalesmanDetail() {
        setOpenDialog(true)
        setMoveCircle(true)
        setDialogText('Loading ....')

        let url = 'http://localhost:5000/salesman/getForEdit'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({_id: id}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {

                console.log(response);

                setName(response.data.name)
                setBonus(response.data.bonus)
                setPhone(response.data.phone)
                setPhotoName(response.data.photoName)
                setPhotoUrl(response.data.photoUrl)

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
    }


    function validateAndSaveData(e) {

        e.preventDefault();
        let salesmanData = {
            name,
            phone,
            bonus,
            photoUrl,
            photoName,
            id,

        };

        for (var d in salesmanData) {
            if (salesmanData[d] === '') {
                setSnackbarOpen(true)
                setSnackbarMessage("Some fields are missing!")
                setVariant('error')
                return;
                break;
            }
        }
        setOpenDialog(true)
        setMoveCircle(true)
        setDialogText('Loading ....')


            setOpenDialog(true)
            let url = 'http://localhost:5000/salesman/edit'
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(salesmanData),
                headers: {
                    "content-type": "application/json",
                }
            }).then((data) => {
                data.json().then((response) => {
                    console.log(response);
                    setOpenDialog(false)

                   getSalesmanDetail()


                    setSnackbarOpen(true)
                    setSnackbarMessage("Successfully Done!")
                    setVariant('success')


                    // history.push("/dashboard/selsmendetail");


                })


            })
                .catch((error) => {
                    console.log(error);
                    let desertRef = storageRef.child(photoName);

                    desertRef.delete().then(()=> {
                        console.log(photoName,' successfully deleted');
                    }).catch((error)=> {
                        console.log(error);
                    });
                    setOpenDialog(true)
                    setDialogText('Please check your Internet connection')

                    setPhotoName('')
                    setPhotoUrl('')
                });




    }



    function onValueName(e) {
        setName(e.target.value);
    }

    function onValuePhone(e) {
        setPhone(e.target.value);
    }
    function onValueBonus(e) {
        setBonus(e.target.value);
    }




    function onClose() {
        setSnackbarOpen(false)
    }


    function uploadPhoto() {
        setOpenImageCropper(true)

        let desertRef = storageRef.child(photoName);

        desertRef.delete().then(()=> {
            console.log(photoName,' successfully deleted');
        }).catch((error)=> {
            console.log(error);
        });
        setPhotoUrl('')
        setPhotoName('')    }

    function openImagePicker(boolean) {
        setOpenImageCropper(boolean)
    }

    function getStudentImageURL(url) {
        setPhotoUrl(url)
    }
    function getImageName(name) {
        setPhotoName(name)
    }

    return (
        <div>
            <Container  component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <Avatar alt="Sales Man" src={photoUrl} />

                    </Avatar>
                    <Button  onClick={uploadPhoto} variant="outlined" color="primary">
                        Upload Photo
                    </Button>
                    {openImageCropper ?
                        <ImageUpload onFileName={getImageName}  onCropped={getStudentImageURL} openImagePicker={openImagePicker}/> : null}<br/>


                    <Typography component="h1" variant="h5">
                        Register Sales Man
                    </Typography>
                    <form onSubmit={validateAndSaveData} className={classes.form} noValidate>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    value={name}
                                    onChange={onValueName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="phone"
                                    label="Phone"
                                    name="phone"
                                    type="number"
                                    value={phone}
                                    onChange={onValuePhone}
                                    autoComplete="phone"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="bonus"
                                    label="give bonus in percentage"
                                    name="bonus"
                                    type="number"
                                    value={bonus}
                                    onChange={onValueBonus}

                                    autoComplete="off"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary"/>}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}

                        >
                            Update
                        </Button>
                    </form>
                </div>
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
            </Container>
        </div>
    );
}