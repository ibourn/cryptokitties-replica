import React, { useState, useLayoutEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import Alert from 'react-bootstrap/Alert';



/**
 * Manages one transaction
 * 
 * - display alert with 3 states : initialised / processed / failed
 * - triggered by initTx from TxContext
 * 
 * @param {any} props 
 */
export default function TxManager(props) {
    const [data, setData] = useState();
    const [show, setShow] = useState({
        status: false,
        type: "",
        msg: ""
    });

    /**
     * initializes a tx following the desired function call
     */
    const initTansaction = useCallback(function() {
        setData(props.data);
        const status = true;
        const type = "secondary";
        let msg;

        switch (props.data.type) {
            case 'createKittyGen0':
                msg = "Transaction initialized : create a Kitty Generation 0";
                props.data.instance.methods.createKittyGen0(props.data.params).send({}, handleTx);
                break;
            default:
                break;
        }
        setShow({
            status: status,
            type: type,
            msg: msg
        })
    },[props.data]);

    /**
     * handles result of the tx 
     */
    const handleTx = (error, txHash) => {
        const status = true;
        let type, msg;

        if (error) {
            //available info : error.code, error.msg
            let cause = "";
            switch (error.code) {
                case -32603:
                    cause = "the contract rejected the transaction";
                    break;
                case 4001:
                case 4100:
                    cause = "transaction or account not authorized by the user";
                    break;
                case 4200:
                case 4900:
                case 4901:
                    cause = "provider not connected or not supporting the method";
                    break;
                    default:
                    break;
            }
            type = "danger";
            msg = "Transaction failed : " + cause;
        } else {
            type = "success";
            msg = "Transaction processed / txHash : " + txHash;
        }
        setShow({
            status: status,
            type: type,
            msg: msg
        })
    }

    /**
     * handles the closure of the alert
     */
    const handleOnClose = () => {
        setShow({
            status: false,
            type: "",
            msg: null
        });
        props.close(props.data.id)
    }


    
    useLayoutEffect(() => {
        if (data !== props.data) {
            initTansaction();
        }
    }, [data, props.data, initTansaction]);


    return (
        <>
            {
                show.status ?
                    <Alert variant={show.type} onClose={handleOnClose} dismissible>
                        {show.msg}
                    </Alert>
                    : null
            }
        </>
    );
}

TxManager.propTypes = {
    data: PropTypes.object,
    close: PropTypes.func
};