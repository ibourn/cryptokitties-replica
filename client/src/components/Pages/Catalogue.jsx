import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import CatalogueCard from '../Cards/CatalogueCard';
import BreedingRoom from '../BreedingRoom/BreedingRoom';
import Web3Context from '../Connection/Web3Context';
import TxContext from '../Transactions/TxContext';

import LoadingCat from '../Loader/LoadingCat';

import { Genes } from '../../assets/modules/utils';

import '../../assets/css/catalogue.css';


/**
 * Displays the catalogue of user's cats
 * 
 */
export default function Catalogue() {
    const [kittiesOwnerList, setKittiesOwnerList] = useState();
    const [showBreedingRoom, setShowBreedingRoom] = useState(false);

    const { connection, requestConnection } = useContext(Web3Context);
    const { setCelebrate } = useContext(TxContext);
    const history = useHistory();

    /**
     * loads list of kitties of the user
     * 
     * - checks the connection, if available :
     * - gets the number of tokens of the user
     * - then fetches each kitty
     */
    const fetchKittiesOfOwner = useCallback(async () => {

        /*gets the list of token Id*/
        const tokenIdList = await connection.instance.methods.getKittiesOf(connection.user)
            .call({}, logOutPut);

        /*maps the list of token Id to get each kitty*/
        let promises = tokenIdList.map(async (id) => {
            const kitty = await connection.instance.methods.getKitty(id)
                .call({}, logOutPut);
            kitty.id = id;
            return kitty;
        })
        const kittiesList = await Promise.all(promises)
        setKittiesOwnerList(kittiesList)
    }, [connection.instance, connection.user]);


    /**
     * logs messages of error
     * 
     * @param {*} error 
     */
    const logOutPut = (error) => { //(error, result)
        if (error) {
            console.log(error);
        }
    }

    /**
     * to open and close the room
     */
    const openBreddingRoom = () => {
        setCelebrate(null);
        setShowBreedingRoom(true);
    }
    const onCloseBreedingRoom = () => {
        setShowBreedingRoom(false);
    }

    /**
     * to transfer data of the dragged kitty
     * @param {*} e 
     */
    const onDragStart = (e) => {
        e.dataTransfer.setData('text/plain', e.target.id)
    }
    /**
     * refresh the catalogue if a new kitten is born
     */
    const newBirth = () => {
        if (connection.instance && connection.isUnlocked) {
            fetchKittiesOfOwner();
        }
    }


    useEffect(() => {
        if (!kittiesOwnerList) {
            requestConnection();
            if (connection.instance && connection.isUnlocked) {
                fetchKittiesOfOwner();
            } else {
                history.push('/Home');
            }
        }
    }, [kittiesOwnerList, requestConnection, fetchKittiesOfOwner, connection.instance, connection.isUnlocked, history])



    return (<>
        {
            kittiesOwnerList ?
                <div className="catalogue__background container-fluid">
                    {
                        showBreedingRoom ?
                            <BreedingRoom kittiesOwnerList={kittiesOwnerList} onCloseBreedingRoom={onCloseBreedingRoom} newBirth={newBirth}></BreedingRoom>
                            :
                            <button className="btn btn-light room__btn white-btn" onClick={openBreddingRoom}>Breeding room</button>
                    }
                    <div className="catalogue__container container d-flex pt-0">
                        <div className="row justify-content-around">
                            {
                                kittiesOwnerList.map((kitty) => {
                                    const genes = Genes.dnaStrToObj(kitty.genes);
                                    return <div key={kitty.id}
                                        id={kitty.id}
                                        onDragStart={onDragStart}
                                        draggable="true"
                                        dna={genes}
                                        data={kitty}
                                        style={{ margin: '0', padding: '0' }} >
                                        <CatalogueCard
                                            id={kitty.id}
                                            key={kitty.id}
                                            dna={genes}
                                            data={kitty}
                                            size={'3px'}>
                                        </CatalogueCard>
                                    </div>;
                                })
                            }
                        </div>
                    </div>
                </div>
                :
                <div className="cat__container container-fluid">
                    <LoadingCat></LoadingCat>
                </div>
        }
    </>);
}