import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';


import Web3Context from '../../Connection/Web3Context';
import BirthRow from '../../Rows/BirthRow';


/**
 * displays all kitten created
 * 
 * @todo style
 */
export default function RegisterOfBirths() {
    const [kittiesList, setKittiesList] = useState();
    const { connection, requestConnection } = useContext(Web3Context);
    const history = useHistory();

    /**
     * fetches all births
     */
    const fetchBirths = useCallback(async () => {

            const totalOfKitties = await connection.instance.methods.totalSupply()
                .call({}, logError);

            let list = new Array(totalOfKitties);
            for (let i = 0; i < totalOfKitties; i++) {
                list[i] = i;
            }
            const promises = list.map(async (id) => {
                const kitty = await connection.instance.methods.getKitty(id)
                    .call({}, logError);
                kitty.id = id;
                return kitty;
            })
            const listOfKitties = await Promise.all(promises);

            setKittiesList(listOfKitties);
    }, [connection.instance]);

    /**
     * Logs the errors
     * 
     */
    const logError = (error) => {
        if (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        if (!kittiesList) {
            requestConnection();
            if (connection.instance && connection.isUnlocked) {
                fetchBirths();
            } else {
                history.push('/Home');
            }
        }
    }, [kittiesList, requestConnection, fetchBirths, connection.instance, connection.isUnlocked, history])



    return (
        <div style={{ minHeight: '75vh' }}>
            <table className="table table-primary table-bordered">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>genes</th>
                        <th>date of birth</th>
                        <th>mumId</th>
                        <th>dadId</th>
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