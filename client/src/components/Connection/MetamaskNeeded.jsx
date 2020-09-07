import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';

import styled from 'styled-components';

import Web3Context from './Web3Context';


/**
 * styled components
 */
const A = styled.a`
 color: white;
 :hover{
    color: white;
    text-decoration: none; 
 }
`

/**
 * Pops up when a connexion to ethereum is needed and that no provider is detected
 * 
 * - modal box asking to download metamask or to allow access to the dapp
 * 
 * - triggered cause a button calls 'requestConnection' from Web3Context
 * - if no provider : Web3Context set 'requestMetamask' to true and trigger 'setShow' 
 * 
 */
export default function MetamaskNeeded() {
    const [show, setShow] = useState(false);
    const { requestMetamask, setRequestMetamask } = useContext(Web3Context);

    const handleClose = () => {
        setShow(false);
        setRequestMetamask(false);
    }

    useEffect(() => {
        if (requestMetamask) {
            setShow(true);
        }
    }, [requestMetamask])


    return (
        <Modal show={show} onHide={handleClose} animation={false} size="lg"
            aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    No provider detected</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                In order to communicate with the blockchain you need a provider
               such as Metamask.
               <br /><hr />
               Please allow Metamask for this site or install it.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    close
                </Button>
                <Button variant="secondary" onClick={handleClose} >
                    <Navbar.Text style={{ margin: "0", padding: "0" }}>
                        <A href="https://metamask.io" target="_blank">download Metamask</A>
                    </Navbar.Text>
                </Button>
            </Modal.Footer>
        </Modal>
    );
}