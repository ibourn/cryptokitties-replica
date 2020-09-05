import React, { useState } from 'react';

import TxManager from './TxManager';
import EventManager from './EventManager';


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
    /*events*/
    const [event, setEvent] = useState({
        status: "",
        instance: null,
        name: ""
    });


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
     * @param {web3} instance 
     * @param {string} name 
     */
    const subscribeEvent = (instance, name) => {
        setEvent({
                processing: true,
                instance: instance,
                name: name,
            })
    }

  /**
     * set the status of show event to false (processing = false)
     * 
     * @param {number} id 
     */
    const closeEvent = (id) => {
        // setEventArray((oldArray) => {
        //     const newArray = [...oldArray];
        //     newArray[id].processing = false;
        //     return newArray;
        // })
    }

    return (
        <>
            <TxContext.Provider value={{ initTx, subscribeEvent }}>
                {props.children}
                {
                    event.processing ?
                        <EventManager  data={event} close={closeEvent}></EventManager>
                    :
                         null
                }
                { 
                txArray ? txArray.map((tx) => {
                        if (tx.processing) {
                            return <TxManager key={tx.id} data={tx} close={closeTx}></TxManager>
                        }
                        else {
                            return null;
                        }
                    }) : null
                }
            </TxContext.Provider>
        </>
    );
}

export default TxContext;