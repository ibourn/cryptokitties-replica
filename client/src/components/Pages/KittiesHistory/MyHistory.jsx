import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Web3Context from '../../Connection/Web3Context';
import CreationTable from '../../Tables/CreationTable';
import BreedingTable from '../../Tables/BreedingTable';


/**
 * tables of the actions of the user
 * 
 * @todo style and add user's events
 */
export default function MyHistrory() {
    const [creationList, setCreationList] = useState();
    const [breedingList, setBreedingList] = useState();
    const { connection, requestConnection } = useContext(Web3Context);
    const history = useHistory();

    /**
     * fetches gen0 creation events of the user
     */
    const fetchKittiesCreations = useCallback(async () => {
        let tab = [];

        connection.instance.getPastEvents('Birth', {
            filter: { owner: connection.user},
            fromBlock: 0,
            toBlock: 'latest'
        }, logError)
            .then(function (events) {
                tab = events.map(event => {
                    if(event.returnValues.generation == 0){
                    return ({
                        id: event.returnValues.kittenId,
                        genes: event.returnValues.genes,
                        birthTime: event.returnValues.birthTime,
                        mumId: event.returnValues.mumId,
                        dadId: event.returnValues.dadId,
                        generation: event.returnValues.generation
                    })
                } else {
                    return null;
                }
                });
                setCreationList(tab);
            });
    }, [connection.instance, connection.user]);


    /**
     * fetches breeding events of the user
     */
    const fetchKittiesBreeding = useCallback(async () => {
        let tab = [];

        connection.instance.getPastEvents('Birth', {
            filter: { owner: connection.user},
            fromBlock: 0,
            toBlock: 'latest'
        }, logError)
            .then(function (events) {
                tab = events.map(event => {
                    if(event.returnValues.generation != 0){
                    return ({
                        id: event.returnValues.kittenId,
                        genes: event.returnValues.genes,
                        birthTime: event.returnValues.birthTime,
                        mumId: event.returnValues.mumId,
                        dadId: event.returnValues.dadId,
                        generation: event.returnValues.generation
                    })
                } else {
                    return null;
                }
                });
                setBreedingList(tab);
            });
    }, [connection.instance, connection.user]);


    /**
     * Logs the errors
     * 
     * @param {*} dna 
     */
    const logError = (error) => {
        if (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!creationList && !breedingList) {
            requestConnection();
            if (connection.instance && connection.isUnlocked) {
                fetchKittiesCreations();
                fetchKittiesBreeding();
            } else {
                history.push('/Home');
            }
        }
    }, [creationList, breedingList, requestConnection, fetchKittiesBreeding, fetchKittiesCreations, connection.instance, connection.isUnlocked, history])

    
    return (
        <div style={{ minHeight: '75vh' }}>
            <CreationTable creationList={creationList}></CreationTable>

            <BreedingTable breedingList={breedingList}></BreedingTable>

        </div>
    );
}