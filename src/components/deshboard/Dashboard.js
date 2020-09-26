import React from 'react';
import './styles/dashboard.css'
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Collapse from '@material-ui/core/Collapse';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ChatIcon from '@material-ui/icons/Chat';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Background from '../backgroundImage/sidebar-2.d30c9e30.jpg'
import {NavLink,useRouteMatch} from "react-router-dom";
import HistoryIcon from '@material-ui/icons/History';

import Main from "../main/Main";

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,

        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    nested: {
        paddingLeft: theme.spacing(9),
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,

    drawerPaper: {
        width: drawerWidth,


    },

    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        background:'#ccd7d9'
    },
}));

function Dashboard(props) {
    const {window} = props;
    const classes = useStyles();
    let {path, url} = useRouteMatch();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [openProduct, setOpenProduct] = React.useState(false);
    const [openSelsMen, setOpenSelsMen] = React.useState(false);



    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (

        <div>

                        <div  className={classes.toolbar}> </div>
                    <Divider/>
                    <List>


                        <div className='list'>

                            <ListItem button onClick={()=> setOpenProduct(!openProduct)}>
                                <ListItemIcon>
                                    <ShoppingCartIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Products"/>
                                {openProduct ? <ExpandLess/> : <ExpandMore/>}
                            </ListItem>
                        </div>
                        <Collapse in={openProduct} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <NavLink activeClassName="activeLink" className='link list' to={`${url}/allproducts`}>
                                    <ListItem button className={classes.nested}>
                                        <ListItemText primary="All Products"/>
                                    </ListItem>
                                    </NavLink>
                                    <NavLink activeClassName="activeLink" className='link' to={`${url}/addproducts`}>
                                    <ListItem button className={classes.nested}>

                                        <ListItemText primary="Add Products"/>
                                    </ListItem>
                                    </NavLink>
                                </List>
                            </Collapse>

                        <div className='list'>
                            <ListItem button onClick={()=> setOpenSelsMen(!openSelsMen)} >
                                <ListItemIcon> <MailIcon/></ListItemIcon>
                                <ListItemText primary={'Sales Men'}/>
                                {openSelsMen ? <ExpandLess/> : <ExpandMore/>}

                            </ListItem>
                        </div>
                        <Collapse in={openSelsMen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <NavLink activeClassName="activeLink" className='link' to={`${url}/selsmendetail`}>
                                <ListItem button className={classes.nested}>
                                    <ListItemText primary="Sales Men Detail"/>
                                </ListItem>
                                </NavLink>
                                <NavLink activeClassName="activeLink" className='link' to={`${url}/hiresalesmen`}>
                                <ListItem  button className={classes.nested}>
                                    <ListItemText primary="Hire Sales Men"/>
                                </ListItem>
                                </NavLink>
                            </List>
                        </Collapse>
                        <div className='list'>
                            <ListItem button>
                                <ListItemIcon> <LocalAtmIcon/></ListItemIcon>
                                <ListItemText primary={'Income'}/>
                            </ListItem>
                        </div>
                    </List>
                    <Divider/>
                    <List>
                        <div className='list'>
                            <NavLink activeClassName="activeLink" className='link' to={`${url}/chat`}>
                            <ListItem button>
                                <ListItemIcon> <ChatIcon/></ListItemIcon>
                                <ListItemText primary={'Chat'}/>
                            </ListItem>
                            </NavLink>
                        </div>
                        <div className='list'>
                            <NavLink activeClassName="activeLink" className='link' to={`${url}`}>
                                <ListItem button>
                                    <ListItemIcon> <HistoryIcon/></ListItemIcon>
                                    <ListItemText primary={'History'}/>
                                </ListItem>
                            </NavLink>
                        </div>
                    </List>
                </div>

    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Responsive drawer
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                    <div className={classes.toolbar}/>
               <Main/>
            </main>
        </div>
    );
}

Dashboard.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default Dashboard;
