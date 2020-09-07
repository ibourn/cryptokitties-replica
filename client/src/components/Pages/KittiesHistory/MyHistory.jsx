import React, { useState, useContext, useEffect } from 'react';

import Web3Context from '../../Connection/Web3Context';
import BirthRow from '../../Rows/BirthRow';


/**
 * tables of the actions of the user
 * 
 * @todo style
 */
export default function MyHistrory() {
    const [kittiesList, setKittiesList] = useState();
    const { connection, requestConnection } = useContext(Web3Context);

    useEffect(() => {
        if (!kittiesList) {
            fetchKittiesCreations();
        }
    })

    const fetchKittiesCreations = async () => {
        let tab = [];

        requestConnection();
        if (connection.instance && connection.isUnlocked) {

            connection.instance.getPastEvents('birthEvent', {
                filter: { owner: connection.user },
                fromBlock: 0,
                toBlock: 'latest'
            }, logError)
                .then(function (events) {
                    tab = events.map(event => {
                        return ({
                            id: event.returnValues.kittenId,
                            genes: event.returnValues.genes,
                            birthTime: event.returnValues.birthTime,
                            mumId: event.returnValues.mumId,
                            dadId: event.returnValues.dadId,
                            generation: event.returnValues.generation
                        })
                    });
                    setKittiesList(tab);
                });

        }
    }


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


    return (
        <div style={{ minHeight: '75vh' }}>
            <table className="table table-primary table-bordered">
                <caption>Creation of Gen0</caption>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>genes</th>
                        <th>date of birth</th>
                        <th>mum Id</th>
                        <th>dad Id</th>
                        <th>generation</th>
                    </tr>
                </thead>
                <tbody>
                    {kittiesList ?
                        kittiesList.map(({ id, owner, genes, birthTime, mumId, dadId, generation }) =>
                            <BirthRow
                                key={id}
                                id={id}
                                genes={genes}
                                birthTime={birthTime}
                                mumId={mumId}
                                dadId={dadId}
                                generation={generation}
                            />
                        ) : null
                    }
                </tbody>
            </table>
        </div>
    );
}