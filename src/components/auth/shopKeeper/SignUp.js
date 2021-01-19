import React, {useState} from 'react';

import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Grid,
    Box,
    Container,
    Typography,
    Snackbar,
    Dialog,
    DialogContent,
    CircularProgress
} from '@material-ui/core'


import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {makeStyles} from '@material-ui/core/styles';
import '../../config/Config'
import firebase from "firebase";
import {
    Link
} from "react-router-dom";
import {useHistory} from "react-router-dom";
import Background from "../../backgroundImage/sidebar-2.d30c9e30.jpg";


import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}

            {'.'}
        </Typography>
    );
}

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
        margin: '10px'

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

export default function SignUp() {
    const classes = useStyles();
    let history = useHistory();


    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [variant, setVariant] = useState('success')
    const [dialogText, setDialogText] = useState('Loading....')
    const [openDialog, setOpenDialog] = useState(false)


    function onValueFirstName(e) {
        // console.log(e.target.value);
        setFirstName(e.target.value.trim());
    }

    function onValueLastName(e) {
        setLastName(e.target.value.trim());
    }

    function onValuePhone(e) {
        setPhone(e.target.value.trim());
    }

    function onValueEmail(e) {
        setEmail(e.target.value.trim());
    }

    function onValuePassword(e) {
        setPassword(e.target.value.trim());
    }

    function validateAndSaveData(e) {
        e.preventDefault();
        let shopKeeperData = {
            name: firstName.trim() + ' ' + lastName.trim(),
            phone: phone.trim(),
            email: email.trim(),

        };
        console.log(shopKeeperData);

        for (var d in shopKeeperData) {
            if (shopKeeperData[d] === '') {
                setSnackbarOpen(true)
                setSnackbarMessage("Some fields are missing!")
                setVariant('error')
                return;
                break;
            }
        }


        firebase.auth().createUserWithEmailAndPassword(email, password).then(function (data) {
            setOpenDialog(true)
            shopKeeperData.shopkeeperId = data.user.uid
            let url = 'https://salesman-back.herokuapp.com/shopkeeper/add'
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(shopKeeperData),
                headers: {
                    "content-type": "application/json",
                }
            }).then((data) => {
                data.json().then((response) => {
                    console.log(response);
                    setOpenDialog(false)

                    console.log(shopKeeperData);
                    setFirstName('')
                    setLastName('')
                    setPhone('')
                    setEmail('')
                    setPassword('')

                    setSnackbarOpen(true)
                    setSnackbarMessage("Successfully Done!")
                    setVariant('success')


                    history.push("/signin");


                })


            })
                .catch((error) => {
                    console.log(error);
                    setOpenDialog(true)
                    setDialogText('Please check your Internet connection')

                });

        }).catch(function (error) {
            console.log(error);
            alert(error.message)

        });


    }


    return (
        <div className={classes.main}>
            <Container className={classes.container} component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <form onSubmit={validateAndSaveData}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                onChange={onValueFirstName}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required={true}
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                onChange={onValueLastName}

                                autoComplete="lname"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required={true}
                                fullWidth
                                id="phone"
                                label="Phone"
                                name="phone"
                                type="number"
                                onChange={onValuePhone}

                                autoComplete="phone"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required={true}
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                type={email}
                                onChange={onValueEmail}

                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required={true}
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                onChange={onValuePassword}

                                autoComplete="current-password"
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
                        Sign Up
                    </Button>
                    </form>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="signin" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>

                </div>
                <Box mt={5}>
                    <Copyright/>
                </Box>
            </Container>


            <Snackbar style={{bottom: "10px"}}
                      anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                      }}
                      open={snackbarOpen}
                // autoHideDuration={3000}
                      onClose={function () {
                          setSnackbarOpen(false)
                      }}
            >
                <Alert onClose={function () {
                    setSnackbarOpen(false)
                }} severity={variant}>
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
