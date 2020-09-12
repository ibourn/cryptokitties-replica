import React, { useState } from 'react';

import TxManager from './TxManager';
import EventManager from './EventManager';
import InvalidTx from './InvalidTx';


const TxContext = React.createContext();

/**
 * Manages the queue of transactions
 * 
 * - stores the transactions and their status
 * - triggers TxManager to initiate a new Tx
 * 
 * - stores events binded to transacations and their status
 * - triggers TxEvent to initiate a new event listener 
 * 
 * - forwards the result of an event if needed
 * 
 * @param {any} props 
 */
export function TxProvider(props) {
    /*array of transactions*/
    const [txArray, setTxArray] = useState([{
        id: 0,
        processing: false,
        instance: null,
        type: "",
        params: null
    }]);
    /*tx validation state*/
    const [alertInvalidTx, setAlertInvalidTx] = useState("");
    /*events*/
    const [event, setEvent] = useState({
        status: "",
        instance: null,
        name: ""
    });
    /*resutl of event to forward (only breeding at the moment)*/
    const [celebrate, setCelebrate] = useState(null);
   
    /**
     * stores and triggers new transactions
     * 
     * @param {web3} instance 
     * @param {string} type 
     * @param {any} params 
     */
    const initTx = (instance, type, params) => {

        setTxArray((oldArray) => {
            const newArray = [...oldArray];
            newArray.push({
                id: oldArray.length,
                processing: true,
                instance: instance,
                type: type,
                params: params
            })
            return newArray;
        })
    }

    /**
     * set the status of tx to done (processing = false)
     * 
     * @param {number} id 
     */
    const closeTx = (id) => {
        setTxArray((oldArray) => {
            const newArray = [...oldArray];
            newArray[id].processing = false;
            return newArray;
        })
    }

    /**
     * set an event listener 
     * 
     * - callback is used when we need to exploit/forward the event result
     * 
     * @param {web3} instance 
     * @param {string} name 
     */
    const subscribeEvent = (instance, name, callback = null) => {
        setEvent({
            processing: true,
            instance: instance,
            name: name,
            // callback: callback
        })
    }

    /**
     * manage the result of a birth by breeding (forward/close)
     * 
     * @param {*} newKitty 
     */
    const forwardCelebration = (newKitty) => {
        setCelebrate(newKitty);
    }

    const closeCelebration = () => {
        setCelebrate(null);
    }


    return (
        <>
            <TxContext.Provider value={{
                initTx, subscribeEvent,
                celebrate, setCelebrate, closeCelebration, alertInvalidTx, setAlertInvalidTx
            }}>
                <InvalidTx></InvalidTx>

                {props.children}

                <div className="row">
                    <div className="col-6">
                        {
                            txArray ? txArray.map((tx) => {
                                if (tx.processing) {
                                    return <TxManager key={tx.id} data={tx}
                                        setAlertInvalidTx={setAlertInvalidTx}
                                        close={closeTx} style={{ fontSize: '0.2em' }}></TxManager>
                                }
                                else {
                                    return null;
                                }
                            }) : null
                        }
                    </div>
                    <div className="col-6">
                        {
                            event.processing ?
                                <EventManager data={event} forwardCelebration={forwardCelebration}
                                    style={{ fontSize: '0.2em' }}></EventManager>
                                :
                                null
                        }
                    </div>
                </div>
            </TxContext.Provider>
        </>
    );
}

export default TxContext;