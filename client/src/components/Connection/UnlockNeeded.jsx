import React, { useState, useLayoutEffect, useContext } from 'react';

import Modal from 'react-bootstrap/Modal';
import Web3Context from './Web3Context';

/**
 * Pops up when a connexion to ethereum is needed and that metamask is locked
 * 
 * - modal box asking to unlock metamask 
 * 
 * - triggered cause a button calls 'requestConnection' from Web3Context
 * 
 */
export default function UnlockNeeded() {
    const [show, setShow] = useState(false);
    const { requestUnlock, setRequestUnlock } = useContext(Web3Context);

    const handleClose = () => {
        setShow(false);
        setRequestUnlock(false);
    }

    useLayoutEffect(() => {
        if (requestUnlock) {
            setShow(true);
        }
    }, [requestUnlock])


    return (
        <Modal show={show} onHide={handleClose} animation={false} size="lg"
            aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Please unlock metamask first
                    </Modal.Title>
            </Modal.Header>  
        </Modal>
    );
}