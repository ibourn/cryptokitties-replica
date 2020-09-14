import React, { useState, useContext, useLayoutEffect } from 'react';

import CatalogueCard from '../Cards/CatalogueCard';
import Web3Context from '../Connection/Web3Context';
import TxContext from '../Transactions/TxContext';

import { Genes } from '../../assets/modules/utils';

import '../../assets/css/breedingroom.css';


/**
 * Displays the breedingroom 
 * 
 * - kitties are drag&drop in the boxes
 * - when breed is clicked, curtains will begin to close
 * - if the tx is not valid, a modal box displays the reason (see TxContext)
 */
export default function BreddingRoom(props) {
    /*data of the kitten if dropped in the boxes*/
    const [dad, setDad] = useState(null);
    const [mum, setMum] = useState(null);
    const [kitten, setKitten] = useState(null);
    /*state of the naimation of the curtain*/
    const [move, setMove] = useState(null);

    /*contexts, 'celebrate' will get the result of the breed event*/
    const { connection, requestConnection } = useContext(Web3Context);
    const { initTx, subscribeEvent, celebrate, closeCelebration } = useContext(TxContext);


    const onDragOver = (e) => {
        e.preventDefault();
    }

    const onDropDad = (e) => {
        const id = e.dataTransfer.getData('text');
        e.dataTransfer.clearData();

        setDad({
            id: id,
            dna: Genes.dnaStrToObj(props.kittiesOwnerList[id].genes),
            data: props.kittiesOwnerList[id]
        });
    }

    const onDropMum = (e) => {
        const id = e.dataTransfer.getData('text');
        e.dataTransfer.clearData();

        setMum({
            id: id,
            dna: Genes.dnaStrToObj(props.kittiesOwnerList[id].genes),
            data: props.kittiesOwnerList[id]
        });
    }


    const onCancel = () => {
        setDad(null);
        setMum(null);
    }

    const onQuit = () => {
        props.onCloseBreedingRoom();
        closeCelebration();
        setKitten(null);
    }

    /**
     * init the breed Tx, the result is given by the event
     * 
     */
    const breed = async () => {
        if (mum && dad) {
            requestConnection();
            if (connection.instance && connection.isUnlocked) {

                initTx(connection.instance, 'breed', { dadId: dad.id, mumId: mum.id });

                setMove(true);

                subscribeEvent(connection.instance, 'Birth', true);
            }
        }
    }



    useLayoutEffect(() => {

        if (celebrate !== kitten) {
            if (!mum || !dad) {
                setKitten(null)
            } else {
                if (celebrate) {
                    setKitten(celebrate);
                    props.newBirth();
                    setMove(false);
                }
            }
        }
    }, [celebrate, kitten, mum, dad, props]);



    const curtainRight = "curtain-right" + (move == null ? " begin" : (move ? " close" : " open"));
    const curtainLeft = "curtain-left" + (move == null ? " begin" : (move ? " close" : " open"));


    return (
        <div className="container-fluid sticky-top m-0 p-0" >
            <div className="row breedingroom m-0 p-0">

                <div className={curtainLeft}></div>

                <div className="row cards__container" >
                    <div className='col mr-1 cards__column'
                        onDragOver={(e) => onDragOver(e)}
                        onDrop={(e) => onDropDad(e)}>
                        {
                            dad ?
                                <CatalogueCard
                                    dna={dad.dna}
                                    data={dad.data}
                                    size={'2px'}>
                                </CatalogueCard>
                                :
                                <p className="instruction">{"drag&drop dad"}</p>
                        }
                    </div>
                    <div className='col mr-1 cards__column'
                        onDragOver={(e) => onDragOver(e)}
                        onDrop={(e) => onDropMum(e)}>
                        {
                            mum ?
                                <CatalogueCard
                                    dna={mum.dna}
                                    data={mum.data}
                                    size={'2px'}>
                                </CatalogueCard>
                                :
                                <p className="instruction">{"drag&drop mum"}</p>
                        }
                    </div>
                    <div className='col mr-1'>
                        {
                            !kitten ?
                                <div className='btn__container m-0 p-0'>
                                    <button className="btn btn-light room__btn white-btn" onClick={breed}>breed</button>
                                    <button className="btn btn-light room__btn white-btn" onClick={onCancel}>cancel</button>
                                </div>
                                :
                                <div className='cards__column'>
                                    <CatalogueCard
                                        dna={Genes.dnaStrToObj(kitten.genes)}
                                        data={kitten}
                                        size={'2px'}>
                                    </CatalogueCard>
                                </div>
                        }
                    </div>
                </div>
                <div className={curtainRight}></div>
            </div>
            <button className="btn btn-light room__btn white-btn" onClick={onQuit}>Close the room</button>
        </div>

    )
}