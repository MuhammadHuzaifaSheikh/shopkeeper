import React, {useEffect, useState} from "react";
import {IconButton, Avatar, CircularProgress, Typography, Paper, Menu, MenuItem, Fade} from "@material-ui/core";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import './chatSheet.css'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

import {useParams} from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import {firebase} from "../../../config/Config";
import {Recorder} from 'react-voice-recorder'
import 'react-voice-recorder/dist/index.css'
import Loader from './UploadLoader'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {withStyles} from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import CloseIcon from '@material-ui/icons/Close';

import SimpleReactLightbox, {SRLWrapper} from 'simple-react-lightbox'

const styles = (theme) => ({
    root: {margin: 0, padding: theme.spacing(2),},
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const options = {
    settings: {
        autoplaySpeed: 1500,
        transitionSpeed: 900,
    },
    buttons: {
        backgroundColor: 'rgba(30,30,36,0.8)',
        iconColor: 'rgba(255, 255, 255, 0.8)',
        iconPadding: '5px',
        showAutoplayButton: true,
        showCloseButton: true,
        showDownloadButton: true,
        showFullscreenButton: true,
        showNextButton: true,
        showPrevButton: true,
        size: '40px'
    }

};
var storageRef = firebase.storage().ref();
const DialogTitle = withStyles(styles)((props) => {
    const {children, classes, onClose, ...other} = props;
    return (<MuiDialogTitle disableTypography className={classes.root} {...other}><Typography
        variant="h6">{children}</Typography>{onClose ? (<IconButton aria-label="close" className={classes.closeButton}
                                                                    onClick={onClose}><CloseIcon/></IconButton>) : null}
    </MuiDialogTitle>);
});
export default function ChatSheet({getConversation, messages,socket}) {
    let {id} = useParams();
    const [userDetail, setuserDetail] = useState([]);
    const [messageValue, setMessageValue] = useState('');
    const [openLoading, setOpenLoading] = useState(false);
    const [senderInformation, setSenderInformation] = useState('');

    const [audioDetails, setAudioDetails] = useState({
        url: null,
        blob: null,
        chunks: null,
        duration: {h: 0, m: 0, s: 0}
    });
    const [open, setOpen] = React.useState(false);
    const [src, setSrc] = useState('');
    const [progress, setProgress] = useState(0);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openSelect = Boolean(anchorEl);

    const onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files);
            if (!e.target.files[0].type.match("image.*")) {
                alert("Please select image only.");
            } else {
                setOpenLoading(true)
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                        setSrc(reader.result)
                    }
                );
                reader.readAsDataURL(e.target.files[0], e.target.files[0].name);


                fileUpload(e.target.files[0],`image/${e.target.files[0].name}`)

                console.log(e.target.files[0]);
            }


        }
    };

    const fileUpload = (file, fileName) => {
        console.log(file);


        var uploadTask = storageRef.child('chat/' + fileName).put(file);
        uploadTask.on('state_changed', (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            setProgress(Math.floor(progress))
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, (error) => {
            // Handle unsuccessful uploads
        }, () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);


                setSrc(downloadURL);
                if (file?.type?.match("image.*")) {
                    sendMessage('image', downloadURL);
                } else {
                    sendMessage('audio', downloadURL);
                }
            });
        });
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        handleRest()
    };
    const handleAudioStop = (data) => {
        console.log(data.blob.type)
        setAudioDetails(data)
    };
    const handleAudioUpload = (file) => {
        console.log(file);
        setOpenLoading(true)
        setSrc(file);

        fileUpload(file,`/audio/audio${Math.random()}`)
        const reset = {
            url: null,
            blob: null,
            chunks: null,
            duration: {
                h: 0,
                m: 0,
                s: 0
            }
        };
        setAudioDetails(reset)
    };
    const handleRest = () => {
        const reset = {url: null, blob: null, chunks: null, duration: {h: 0, m: 0, s: 0}};
        setAudioDetails(reset)
    };
    useEffect(() => {
        getConversation(id)
        conversationDetail()
        getSenderInformation()
    }, [id])

    useEffect(() => {
        getSenderInformation()
    }, [messages])

    function conversationDetail() {
        setOpenLoading(true)
        let conversation = {
            _id: id
        }

        let url = 'https://salesman-back.herokuapp.com/conversation/getOne'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(conversation),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                response.data.members.forEach((v, i) => {
                    if (v !== localStorage.getItem('shopKeeper')) {
                        getUserDetail(v)
                    }

                    setOpenLoading(false)


                })


            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');

            });
    }

    function getUserDetail(salesmanId) {
        let url = 'https://salesman-back.herokuapp.com/salesman/getSalesman'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({salesmanId}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                setuserDetail(response.data)
            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');
            });
    }

    function sendMessage(type, Url) {
        setOpenLoading(false)
        handleClose()
        console.log(Url);
        let messageData;
        if (type === 'message') {

            if (messageValue === '') {
                alert('Please Type a Value')
            } else {
                messageData = {
                    conversationId: id,
                    senderId: localStorage.getItem('shopKeeper'),
                    messageText: messageValue,
                    type: 'message',
                    messageTime: Date.now(),
                }
                messages.push(messageData)
            }

        }
        if (type === 'image') {
            messageData = {
                conversationId: id,
                senderId: localStorage.getItem('shopKeeper'),
                imageUrl: Url,
                type: 'image',
                messageTime: Date.now(),

            }
        }
        if (type === 'audio') {
            messageData = {
                conversationId: id,
                senderId: localStorage.getItem('shopKeeper'),
                audioUrl: Url,
                type: 'audio',
                messageTime: Date.now(),

            }
        }


        let url = 'https://salesman-back.herokuapp.com/messages/add'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(messageData),
            headers: {
                "content-type": "application/json",
            }
        }).then((data) => {
            data.json().then((response) => {
                setSrc('')
                if (response.data) {
                    messages.forEach((item, index) => {
                        if (item.messageTime === messageData.messageTime) {
                            messages.splice(index, 1)

                        }
                    })
                }


            })
        }).catch((error) => {
            console.log(error);
            console.log('error is running');


        });
        setMessageValue('')
    }

    const getSenderInformation = () => {
        let senderInfo = {}
        let senderIds = []
        messages.forEach((item) => {
            if (senderIds.indexOf(item.senderId) === -1) {
                senderIds.push(item.senderId)
            }
        })
        senderIds.forEach((item) => {
            if (item === localStorage.getItem('shopKeeper')) {
                let url = 'https://salesman-back.herokuapp.com/shopkeeper/get'
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({shopkeeperId: {$in: senderIds}}),
                    headers: {"content-type": "application/json",}
                }).then((data) => {
                    data.json().then((response) => {
                        console.log('shopkeeper', response.data);
                        if (response.data) {
                            senderInfo[response.data.shopkeeperId] = response.data
                            setSenderInformation(senderInfo)
                        }

                    })
                })
            } else {

                let url = 'https://salesman-back.herokuapp.com/salesman/getSalesman'
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({salesmanId: {$in: senderIds}}),
                    headers: {"content-type": "application/json",}
                }).then((data) => {
                    data.json().then((response) => {
                        console.log('salesman', response.data);
                        if (response.data) {
                            senderInfo[response.data.salesmanId] = response.data
                            setSenderInformation(senderInfo)

                        }
                    })
                })
            }
        })


    }


    return (
        <div className="chatSheet">
            <div className="chat_header">
                {userDetail ?
                    <>
                        <Avatar src={userDetail.photoUrl}/>
                        <div className="chat_headerInfo">
                            <h3>{userDetail.name}</h3>
                            <p>{userDetail.isOnline ? 'Online' : `Last Seen ${new Date(userDetail?.lastSeen).toLocaleTimeString()}`}</p>
                        </div>
                    </>
                    : <CircularProgress color="primary"/>
                }

                <div className="chat_headerRight">
                    <IconButton><SearchOutlinedIcon/></IconButton>

                    <input style={{display: 'none'}} id="outlined-button-file" type="file" onChange={onSelectFile}/>

                    <IconButton
                        aria-controls="fade-menu" aria-haspopup="true"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        edge="start"
                    >
                        <AttachFileIcon/>
                    </IconButton>

                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={openSelect}
                        onClose={() => setAnchorEl(null)}
                        TransitionComponent={Fade}

                        PaperProps={{
                            style: {
                                width: '20ch',
                            },
                        }}
                    >
                        <label htmlFor="outlined-button-file">
                            <MenuItem style={{display: 'flex', justifyContent: 'flex-start'}}
                                      onClick={() => setAnchorEl(null)}> <PhotoCameraIcon
                                style={{marginRight: '10px', color: 'grey'}}/> Photos</MenuItem>
                        </label>

                    </Menu>


                    <IconButton><MoreVertIcon/></IconButton>
                </div>
            </div>
            <div className="chat_body2">
                <SimpleReactLightbox>
                    <SRLWrapper options={options}>
                        {messages.map((item, index) => {

                            if (item.type === 'message') {
                                return (
                                    <p key={index}
                                       className={`chat_message  ${item.senderId === localStorage.getItem('shopKeeper') && "chat_receiver"}`}>
                            <span
                                className="chat_name">{senderInformation[item.senderId] ? senderInformation[item.senderId].name : 'name'} </span>
                                        <span className='message'> {item.messageText}</span>
                                        <span
                                            className="chat_timestamp">{new Date(item.messageTime).toLocaleString()}</span>
                                        <span className='send_message_status'>

                                {
                                    (() => {
                                        if (item?.messageSent && item.senderId === localStorage.getItem('shopKeeper'))
                                            return <DoneIcon fontSize='small'/>
                                        else if (item?.messageReceived && item.senderId === localStorage.getItem('shopKeeper'))
                                            return <DoneAllIcon style={{color: 'deepskyblue'}} fontSize='small'/>
                                        else if (item?.messageRead && item.senderId === localStorage.getItem('shopKeeper'))
                                            return <DoneAllIcon color='primary' fontSize='small'/>
                                    })()
                                }


                            </span>
                                    </p>
                                )
                            } else if (item.type === 'image') {
                                return (
                                    <p key={index}
                                       className={`chat_message  ${item.senderId === localStorage.getItem('shopKeeper') && "chat_receiver"}`}>
                            <span
                                className="chat_name">{senderInformation[item.senderId] ? senderInformation[item.senderId].name : 'name'} </span>
                                        <img className='message_image' src={item?.imageUrl}
                                             alt={new Date(item.messageTime)}/>
                                        <span
                                            className="chat_timestamp">{new Date(item.messageTime).toLocaleString()}</span>
                                        <span className='send_message_status'>

                                {
                                    (() => {
                                        if (item?.messageSent && item.senderId === localStorage.getItem('shopKeeper'))
                                            return <DoneIcon fontSize='small'/>
                                        else if (item?.messageReceived && item.senderId === localStorage.getItem('shopKeeper'))
                                            return <DoneAllIcon style={{color: 'deepskyblue'}} fontSize='small'/>
                                        else if (item?.messageRead && item.senderId === localStorage.getItem('shopKeeper'))
                                            return <DoneAllIcon color='primary' fontSize='small'/>
                                    })()
                                }


                            </span>
                                    </p>
                                )
                            } else if (item.type === 'audio') {
                                return (
                                    <p key={index}
                                       className={`chat_message  ${item.senderId === localStorage.getItem('shopKeeper') && "chat_receiver"}`}>
                            <span
                                className="chat_name">{senderInformation[item.senderId] ? senderInformation[item.senderId].name : 'name'} </span>
                                        <audio controls>
                                            <source src={item?.audioUrl}/>
                                        </audio>
                                        <span
                                            className="chat_timestamp">{new Date(item.messageTime).toLocaleString()}</span>
                                        <span className='send_message_status'>

                                {
                                    (() => {
                                        if (item?.messageSent && item.senderId === localStorage.getItem('shopKeeper'))
                                            return <DoneIcon fontSize='small'/>
                                        else if (item?.messageReceived && item.senderId === localStorage.getItem('shopKeeper'))
                                            return <DoneAllIcon style={{color: 'deepskyblue'}} fontSize='small'/>
                                        else if (item?.messageRead && item.senderId === localStorage.getItem('shopKeeper'))
                                            return <DoneAllIcon color='primary' fontSize='small'/>
                                    })()
                                }


                            </span>
                                    </p>
                                )
                            }

                        })}
                    </SRLWrapper>
                </SimpleReactLightbox>


            </div>
            <div className="chat_footer">
                <InsertEmoticonIcon fontSize='large'/>
                <div onKeyDown={(e) => {
                    console.log(e.key);
                    e.key === 'Enter' && sendMessage('message')
                }}>
                    <input value={messageValue} onChange={(e) => setMessageValue(e.target.value)}
                           placeholder='Type a message' type="text"/>
                    <button type="submit">Send a message</button>
                </div>
                <IconButton onClick={handleClickOpen}>
                    <MicIcon fontSize='large'/>
                </IconButton>
            </div>


            <Dialog fullWidth onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle  id="customized-dialog-title" onClose={handleClose}>
                    Send Voice
                </DialogTitle>
                <IconButton>
                </IconButton>
                <DialogContent style={{background: ' #212121'}} dividers>
                    <Recorder
                        record={true}
                        audioURL={audioDetails?.url}
                        showUIAudio
                        handleAudioStop={data => handleAudioStop(data)}
                        handleAudioUpload={data => handleAudioUpload(data)}
                        handleRest={handleRest}/>

                </DialogContent>

            </Dialog>


            <Dialog
                open={openLoading}
                onClose={() => setOpenLoading(openLoading)}
                PaperProps={src?'':{

                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none'
                    },

                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogContent style={{textAlign: "center", paddingTop: "30px"}}>
                    {src?
                        <Loader  value={progress}/>
                        :
                        <img style={{width: '60px', height: '60px'}} src="https://i.gifer.com/ZZ5H.gif" alt=""/>

                    }

                </DialogContent>
            </Dialog>

        </div>
    )
}
