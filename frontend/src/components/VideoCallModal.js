import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Input,
} from "@chakra-ui/react";
import { CopyToClipboard } from "react-copy-to-clipboard"
import { PhoneIcon, AddIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
const VideoCallModal = (props) => {
  const{ 
    myVideo,
    callAccepted,
    callEnded,
    userVideo,
    setName,
    name,
    idToCall,
    setIdToCall,
    leaveCall,
    callUser,
    answerCall,
    stream,
    me,
    receivingCall

  }  = props
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = React.useState('md')

  const handleSizeClick = (newSize) => {
    setSize(newSize)
    onOpen()
  }

  const sizes = ['lg']

  return (
    <>
      {sizes.map((size) => (
        <IconButton
          onClick={() => handleSizeClick(size)}
          key={size}
          m={4}
          icon={<i className="fa fa-video-camera" aria-hidden="true" />
          }
        >{`Open ${size} Modal`}</IconButton>
      ))}

      <Modal onClose={onClose} size={size} isOpen={isOpen}  >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="container">
            
              <div className="myId">
                <Input
                  id="filled-basic"
                  label="Name"
                  variant="filled"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ marginBottom: "20px" }}
                  placeholder='Enter Your Name'
                />
                <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
                  <Button variant="contained" color="primary" startIcon={<AddIcon fontSize="large" />}>
                    Copy ID
                  </Button>
                </CopyToClipboard>

                <Input
                  id="filled-basic"
                  label="ID to call"
                  variant="filled"
                  value={idToCall}
                  placeholder='Enter Your ID'
                  onChange={(e) => setIdToCall(e.target.value)}
                />
                <Box className="call-button" mt={2}>
                  {callAccepted && !callEnded ? (
                    <Button variant="contained" color="secondary" onClick={leaveCall} >
                      End Call
                    </Button>
                  ) : (
                    <IconButton color="primary" aria-label="call" onClick={() => {
                      callUser(idToCall)
                    }}>
                      <PhoneIcon fontSize="large" />
                    </IconButton>
                  )}
                  {idToCall}
                </Box>
              </div>
              <div className="video-container">
                <div className="video">
                  {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
                </div>
                <div className="video">
                  {callAccepted && !callEnded ?
                    <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} /> :
                    null}
                </div>
              </div>
              <div>
                {receivingCall && !callAccepted ? (
                  <div className="caller">
                    <h1 >{name} is calling...</h1>
                    <Button variant="contained" color="primary" onClick={answerCall}>
                      Answer
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>

          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VideoCallModal;
