import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import '../../config/Config'
import firebase from "firebase";

import {useHistory,Link} from "react-router-dom";
import Background from "../../backgroundImage/sidebar-2.d30c9e30.jpg";


// let db = firebase.firestore();

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}

            {new Date().getFullYear()}
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
        height: '80vh',
        width: '40%',
        borderRadius: '20px',
        boxShadow: ' 0px 0px 22px 0px rgba(46, 50, 50, 0.69)',
        margin:'10px'

    },
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: '#0984e3',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    textField: {
        border: '1 px solid #fff',
    }

}));

export default function SignIn() {
    const classes = useStyles();
    let history = useHistory();

    function handleClick() {
        history.push('/dashboard')
        window.location.reload()
    }

    function dologIn() {
        firebase.auth().signInWithEmailAndPassword(email, password).then(function (userData) {
            localStorage.setItem("shopKeeper", userData.user.uid);
            console.log(userData);
            handleClick()
        }).catch(function (error) {
            console.log(error);
            alert(error.message);
        });


    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function onValueEmail(e) {
        setEmail(e.target.value);
    }

    function onValuePassword(e) {
        setPassword(e.target.value);
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
                        Sign in
                    </Typography>
                    {/*<form className={classes.form} noValidate>*/}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={onValueEmail}
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={onValuePassword}

                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary"/>}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={dologIn}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <a href="#" variant ="body2">
                                Forgot password?
                            </a>
                        </Grid>
                        <Grid item>
                            <Link  to="signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </div>
                <Box mt={8}>
                    <Copyright/>
                </Box>
            </Container>
        </div>
    );
}