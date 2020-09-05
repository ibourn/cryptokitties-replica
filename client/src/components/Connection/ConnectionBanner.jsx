import React, { useContext } from 'react';

import Button from 'react-bootstrap/Button';

import styled from 'styled-components';

import Web3Context from './Web3Context';

/**
 * styles
 */
const Div = styled.div`
    font-weight: lighter;
    background-color: rgba(238,238,238,1);
    box-shadow: 0px 16px 35px 0px rgba(0, 0, 2, 0.08);

    button{
        color: black;
    }
    button:hover{
        border-color: #ffffff;
        color: #ffffff;
        background-image: -webkit-linear-gradient(0deg, #f14437 0%, #ed5b0d 99%);
        transition: 0.3s ease-in;
    }
`;

const P = styled.p`
 font-size: 0.7rem;
 margin: 0 0 2px 0;
 padding: 2px 4px;
 font-weight: lighter;

 background-image: -webkit-linear-gradient(0deg, #f14437 0%, #ed5b0d 99%);
 color: #ffffff;

 .span-account{
    @media (max-width: 500px){
        display: none; 
      } 
 }
`;



/**
 * Display information about ethereum connection 
 * 
 * - if no connection : display a 'connect' button
 * - else display : provider, network, user's account
 * 
 */
const ConnectionBanner = () => {

    const { connection, requestConnection } = useContext(Web3Context);

    const connectionTxt =  "no connection : " +
        (connection.isEnabled ? "account locked" : "no provider detected");


    return (
        <Div className="m-0 px-3 px-md-5">
            { !connection.isUnlocked ?
                <>
                    <Button className="p-0 px-1 mr-2"
                    variant="outline-dark" size="sm" onClick={requestConnection}>
                        Connect
                     </Button>
                    <P className="badge badge-pill">
                        {connectionTxt}
                    </P>
                </> :
                <>
                    <P className="badge badge-pill mr-2">
                        <span>{`network : `}</span>
                        <span>{` ${connection.network}`}</span>
                    </P>
                    <P className="badge badge-pill">
                        <span className="span-account"> {`connected account : `} </span>
                        <span >{` ${connection.user}`}</span>
                    </P>         
                </>
            }
            </Div>
    );
}

export default ConnectionBanner;