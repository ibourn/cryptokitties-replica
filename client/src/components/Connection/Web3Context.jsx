import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const Web3Context = React.createContext();

//conversion from hex codes (from window.ethereum) to network names
const idToNetwork = {
    '0x01': "Ethereum Main Network",
    '0x1': "Ethereum Main Network",
    '0x02': "Morden Test network",
    '0x2': "Morden Test network",
    '0x03': "Ropsten Test Network",
    '0x3': "Ropsten Test Network",
    '0x04': "Rinkeby Test Network",
    '0x4': "Rinkeby Test Network",
    '0x05': "Goerli Test Network",
    '0x5': "Goerli Test Network",
    '0x2a': "Kovan Test Network",
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
    /* to load data first time*/
    const [init, setInit] = useState(true);
    /* connection elements*/
    const [connection, setConnection] = useState({
        web3: null,
        isEnabled: false,
        isUnlocked: false,
        user: "",
        network: ""
    });


    useEffect(() => {
        if (init) {
            setInit(false);
            loadConnectionData();
        }

    })


    /**
     * - checks connection when dapp is launched
     * - add events listeners
     */
    const loadConnectionData = async () => {
        let web3 = connection.web3;
        let isUnlocked = connection.isUnlocked;
        let account = connection.user;
        let network = connection.network;

        let isEnabled = checkProvider();

        if (isEnabled) {

            web3 = new Web3(Web3.givenProvider)

            /*gets user's account if he unlocked it already, without pop up*/
            account = await web3.eth.getAccounts();
            isUnlocked = account.length > 0;

            network = await loadNetwork();

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }
        setConnection({
            web3: web3,
            isEnabled: isEnabled,
            isUnlocked: isUnlocked,
            user: account,
            network: network
        })
    }

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
     * checks and sets the network if it changed
     * 
     * @param {hex} chainId 
     */
    const handleChainChanged = (chainId) => {
        let network = connection.network;

        if (connection.network !== idToNetwork[chainId]) {
            network = idToNetwork[chainId]
        }

        setConnection(oldConnection => {
            let newConnection = { ...oldConnection };
            newConnection.network = network;
            return newConnection;
        })
    }

    /**
     * checks and sets the user's account if it changed
     * 
     * trigerred if :
     * - account changed
     * - user locks/unlocks metamask
     * 
     * @param {string} chainId 
     */
    const handleAccountsChanged = (accounts) => {
        let isUnlocked = connection.isUnlocked;
        let account = connection.user;

        if (accounts.length === 0) {
            isUnlocked = false;
            account = "";

        } else if (connection.user !== accounts[0]) {
            isUnlocked = true;
            account = accounts[0];
        }
        setConnection(oldConnection => {
            let newConnection = { ...oldConnection };
            newConnection.isUnlocked = isUnlocked;
            newConnection.user = account;
            return newConnection;
        })
    }

    /**
     * checks unlocked account and if needed requests user to connect an account
     * 
     * - triggered by a button whose functionality requires an ethereum connection 
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
        let account = "";
        let network = "";
        let isUnlocked = connection.isUnlocked;
        let isEnabled = checkProvider();

        if (!isEnabled) {
            /*triggers MetamaskNeeded component*/
            setRequestMetamask(true);
        }
        else if (!isUnlocked) {
            /*pops up metamask to allow the user to unlock it*/
            account = await loadAccount();
            isUnlocked = account !== "";
            network = await loadNetwork();
        }
        else {
            account = connection.user;
            network = connection.network;
        }

        setConnection(oldConnection => {
            let newConnection = { ...oldConnection };
            newConnection.user = account;
            newConnection.isEnabled = isEnabled;
            newConnection.isUnlocked = isUnlocked;
            newConnection.network = network;
            return newConnection;
        })
    }



    return (
        <Web3Context.Provider value={{ connection, requestMetamask, setRequestMetamask, requestConnection, setConnection }}>
            {props.children}
        </Web3Context.Provider>



    );
}






// export { Web3Provider };
export default Web3Context;