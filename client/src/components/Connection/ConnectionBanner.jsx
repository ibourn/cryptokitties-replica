import React, { useContext } from 'react';

import Button from 'react-bootstrap/Button';

import Web3Context from './Web3Context';


/**
 * Display information about ethereum connection 
 * 
 * - if no connection : display a 'connect' button
 * - else display : provider, network, user's account
 * 
 * @param {any} props 
 */
export default function ConnectionBanner(props) {

    const { connection, requestConnection } = useContext(Web3Context);

    const connectionTxt = "no connection : " +
        (connection.isEnabled ? "account locked" : "no provider detected");
    return (
        <>
            {!connection.isUnlocked ?
                <>
                    <Button variant="outline-dark" size="sm" onClick={requestConnection}>
                        Connect
                     </Button>
                    <span className="badge badge-primary ml-2">
                        {connectionTxt}
                    </span>
                </> :
                <>
                    <span className="badge badge-primary ml-2">
                        {connection.network}
                    </span>
                    <span className="badge badge-primary ml-2">
                        {connection.user}
                    </span>
                </>
            }
        </>
    );
}