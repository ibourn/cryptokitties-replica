import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';

import { contractAddress, abi } from '../../assets/modules/contract';

const Web3Context = React.createContext();

//conversion from hex codes (from window.ethereum) to network names
const idToNetwork = {
    '0x01': "Ethereum MainNet",
    '0x1': "Ethereum MainNet",
    '0x02': "Morden Testnet",
    '0x2': "Morden Testnet",
    '0x03': "Ropsten Testnet",
    '0x3': "Ropsten Testnet",
    '0x04': "Rinkeby Testnet",
    '0x4': "Rinkeby Testnet",
    '0x05': "Goerli Testnet",
    '0x5': "Goerli Testnet",
    '0x2a': "Kovan Testnet",
    '0xNaN': "Local Network",
    '0x539': "Ganache Local Network"
}

/**
 * Manages and provides elements about connection
 * 
 * - 'connection' state allows access to user's account, network, web3 instance
 * 
 * - ethereum.enable() is deprecated, and it's recommended to ask connection only when needed
 * so : each button needing an ethereum connection calls 'requestConnection'to :
 *  - check if a provider is detected
 *  - ask user to connect if no account is available
 * 
 * @todo check web3 when isEnabled false => true
 * and remove Event Listeners
 * 
 * @param {any} props 
 */
export function Web3Provider(props) {
    /* to trigger modal box if metamask is not installed*/
    const [requestMetamask, setRequestMetamask] = useState(false);
    /* to trigger modal box if metamask is locked*/
    const [requestUnlock, setRequestUnlock] = useState(false);
    /* to load data first time*/
    const [init, setInit] = useState(true);
    /* connection elements*/
    const [connection, setConnection] = useState({
        web3: null,
        instance: null,
        isEnabled: false,
        isUnlocked: false,
        user: "",
        network: ""
    });


    /**
     * checks and sets the network if it changed
     * 
     * @param {hex} chainId 
     */
    const handleChainChanged = useCallback(function (chainId) {
        let network = connection.network;

        if (connection.network !== idToNetwork[chainId]) {
            network = idToNetwork[chainId]
        }

        setConnection(oldConnection => {
            let newConnection = { ...oldConnection };
            newConnection.network = network;
            return newConnection;
        })
    }, [connection.network]);


    /**
     * checks and sets the user's account if it changed
     * 
     * trigerred if :
     * - account changed
     * - user locks/unlocks metamask
     * 
     * @param {string} chainId 
     */
    const handleAccountsChanged = useCallback(function (accounts) {
        let newConnection = { ...connection };

        if (accounts.length === 0) {
            newConnection.isUnlocked = false;
            newConnection.account = "";

        } else if (newConnection.user !== accounts[0]) {
            newConnection.isUnlocked = true;
            newConnection.user = accounts[0];
            if (!newConnection.web3) {
                newConnection.web3 = new Web3(Web3.givenProvider);
            }
            newConnection.instance = new newConnection.web3.eth.Contract(
                abi, contractAddress, { from: newConnection.user });

        }
        setConnection(newConnection);
    }, [connection]);


    /**
     * - checks connection when dapp is launched
     * - add events listeners
     */
    const loadConnectionData = useCallback(async function () {
        let newConnection = { ...connection };

        newConnection.isEnabled = checkProvider();

        if (newConnection.isEnabled) {
            newConnection.web3 = new Web3(Web3.givenProvider);

            /*gets user's account if he unlocked it already, without pop up*/
            const account = await newConnection.web3.eth.getAccounts();
            newConnection.isUnlocked = account.length > 0;
            newConnection.user = account[0];

            /*get instance of the KittyContract*/
            if (newConnection.web3 && newConnection.user) {
                newConnection.instance = new newConnection.web3.eth.Contract(
                    abi, contractAddress, { from: newConnection.user });
            }

            newConnection.network = await loadNetwork();

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }
        setConnection(newConnection);

    }, [connection, handleAccountsChanged, handleChainChanged]);


    /**
     * checks if an ethereum provider is detected 
     * 
     * - manages only metamask at the moment
     */
    const checkProvider = () => {
        return window.ethereum && window.ethereum.isMetaMask;
    }


    /**
     * returns the network connected to metamask
     */
    const loadNetwork = async () => {
        let network = "";
        try {
            const idnetwork = await window.ethereum.send('eth_chainId');
            network = idToNetwork[idnetwork.result];
        } catch (error) {
            console.error(error);
        }
        return network;
    }


    /**
     * pops up metamask to unlock it
     * 
     * returns unlocked account 
     */
    const loadAccount = async () => {
        let account = "";
        try {
            const accounts = await window.ethereum.send('eth_requestAccounts');
            account = accounts.result[0];

        } catch (error) {
            //shouldn't be triggered as accounts.length == 0 is checked 
            if (error.code === 4001) {
                // EIP 1193 userRejectedRequest error
                console.log('Please connect to MetaMask');
            } else {
                console.error(error);
            }
        }
        return account;
    }


    /**
     * checks unlocked account and if needed requests user to connect an account
     * 
     * - triggered by a button whose functionality requires an ethereum connection 
     * 
     * - get an instance of the contract with user's address to interact with
     *
     * - checks:
     *  - if the provider is still detected, if not : triggers MetamaskNeeded component
     *  - if an account is unlocked, if not : pops up metamask to unlock
     * 
     * - handles cases when :
     *  - the user removed metamask or disallowed it or locked metamask
     *  - the account is still not unlocked since dapp is launched
     */
    const requestConnection = async () => {
        let newConnection = { ...connection };
        newConnection.isEnabled = checkProvider();

        if (!newConnection.isEnabled) {
            /*triggers MetamaskNeeded component*/
            setRequestMetamask(true);
        }
        else if (!newConnection.isUnlocked) {
            /*pops up metamask to allow the user to unlock it*/
            setRequestUnlock(true);
            newConnection.user = await loadAccount();
            newConnection.isUnlocked = newConnection.user !== "";
            newConnection.network = await loadNetwork();

            if (!newConnection.web3) {
                newConnection.web3 = new Web3(Web3.givenProvider);
            }
            newConnection.instance = new newConnection.web3.eth.Contract(
                abi, contractAddress, { from: newConnection.user });
        }

        setConnection(newConnection);
    }



    useEffect(() => {
        if (init) {
            setInit(false);
            loadConnectionData();
        }
    }, [init, loadConnectionData])


    return (
        <Web3Context.Provider value={{ connection, requestMetamask, setRequestMetamask,
         requestUnlock, setRequestUnlock, requestConnection, setConnection }}>
            {props.children}
        </Web3Context.Provider>
    );
}

export default Web3Context;
