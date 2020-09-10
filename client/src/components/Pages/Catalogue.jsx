import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import CatalogueCard from '../Cards/CatalogueCard';
import Web3Context from '../Connection/Web3Context';
import LoadingCat from '../Loader/LoadingCat';

import { Genes } from '../../assets/modules/utils';

import '../../assets/css/catalogue.css';


/**
 * Displays the catalogue of user's cats
 * 
 */
export default function Catalogue() {
    const [kittiesOwnerList, setKittiesOwnerList] = useState();
    const [showBreedingRoom,setShowBreedingRoom] = useState(false);
    const { connection, requestConnection } = useContext(Web3Context);
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



    const openBreddingRoom = () => {
        setShowBreedingRoom(true);
    }
const onDragOver = (ev) => {
    ev.preventDefault();
}
const onDragStart = (e) => {
    console.log('dragstart', e, e.target.id);
    e.dataTransfer.setData('txt',e.target.id);

}
const onDrop = (e, el) => {
    console.log(e, el);
    let id = e.dataTransfer.getData('txt');
    console.log(id);
}

    return (<>
        {
            kittiesOwnerList ?
                <div className="catalogue__background container-fluid">

                    { 
                    showBreedingRoom ?
                <div className="container-fluid sticky-top" style={{height: '35vh', background: 'grey'}}
                onDragOver={(e) => onDragOver(e)}
                onDrop={(e) => onDrop(e, 'complete')}>



                </div>
                
                    : 
                    <button onClick={openBreddingRoom}>Breeding room</button>
                    }

                    <div className="catalogue__container container d-flex">
                        <div className="row justify-content-around">
                            {
                                kittiesOwnerList.map((kitty) => {
                                    const genes = Genes.dnaStrToObj(kitty.genes);
                                    return <div  key={kitty.id}
                                    id={kitty.id}
                                     onDragStart={onDragStart}
                                    draggable="true"
                                    style={{margin: '0', padding: '0'}}>
                                        <CatalogueCard
                                    
                                   
                                        key={kitty.id}
                                        dna={genes}
                                        data={kitty}
                                        size={'3px'}>
                                    </CatalogueCard></div>;
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