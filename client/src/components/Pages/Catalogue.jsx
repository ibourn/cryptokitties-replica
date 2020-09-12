import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import CatalogueCard from '../Cards/CatalogueCard';
import BreedingRoom from '../BreedingRoom/BreedingRoom';
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
    // const [sire, setSire] = useState(null);
    // const [dame, setDame] = useState(null);
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
// const onDragOver = (ev) => {
//     ev.preventDefault();
// }
const onDragStart = (e) => {
    console.log('dragstart', e, e.target.id);
//     e.dataTransfer.setData('txt', {
//     txt: e.target.id,
// dna: {...e.target.dna},
// data: {...e.target.data}});
e.dataTransfer.setData('txt', e.target.id)
    e.dataTransfer.setData('data', kittiesOwnerList[e.target.id])
        e.dataTransfer.setData('dna', kittiesOwnerList[e.target.id].genes)
        console.log(e.target.id,kittiesOwnerList[e.target.id],kittiesOwnerList[e.target.id].genes);
}

const newBirth = () => {
    if (connection.instance && connection.isUnlocked) {
        fetchKittiesOfOwner();
    }
}
const onCloseBreedingRoom = () => {

setShowBreedingRoom(false);
}

const test = "chariot"+ (showBreedingRoom ? " open" : " close");
    return (<>
        {
            kittiesOwnerList ?
                <div className="catalogue__background container-fluid">

                    
                    {/* <div className={test}>
                                        <BreedingRoom kittiesOwnerList={kittiesOwnerList} onCloseBreedingRoom={onCloseBreedingRoom} newBirth={newBirth}></BreedingRoom>

                    </div> */}
                    {/* <div></div> */}
                    {
                    showBreedingRoom ?
            //    null
                <BreedingRoom kittiesOwnerList={kittiesOwnerList} onCloseBreedingRoom={onCloseBreedingRoom} newBirth={newBirth}></BreedingRoom>
                    : 

                    <button className="btn btn-light room__btn white-btn" onClick={openBreddingRoom}>Breeding room</button>
           
                   }

                    <div className="catalogue__container container d-flex pt-0">
                        <div className="row justify-content-around">
                            {
                                kittiesOwnerList.map((kitty) => {
                                    const genes = Genes.dnaStrToObj(kitty.genes);
                                    return <div  key={kitty.id}
                                    id={kitty.id}
                                    onDragStart={onDragStart}
                                   draggable="true"
                                   
                                        dna={genes}
                                        data={kitty}
                                    style={{margin: '0', padding: '0'}}>
                                        <CatalogueCard
                                    id={kitty.id}
                                //     onDragStart={onDragStart}
                                //    draggable="true"
                                   
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