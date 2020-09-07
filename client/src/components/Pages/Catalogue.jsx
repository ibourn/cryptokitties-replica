import React, { useState, useContext, useEffect } from 'react';

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
    const { connection, requestConnection } = useContext(Web3Context);

    useEffect(() => {
        if (!kittiesOwnerList) {
            fetchKittiesOfOwner();
        }
    }, [kittiesOwnerList])


    /**
     * loads list of kitties of the user
     * 
     * - checks the connection, if available :
     * - gets the number of tokens of the user
     * - then fetches each kitty
     */
    const fetchKittiesOfOwner = async () => {
        console.log("TEST");
        requestConnection();

        if (connection.instance && connection.isUnlocked) {
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
        }
    }


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


    const temp = true;
    return (<>
        {
            kittiesOwnerList ?
                <div className="catalogue__background container-fluid">
                    <div className="catalogue__container container d-flex">
                        <div className="row justify-content-around">
                            {
                                kittiesOwnerList.map((kitty) => {
                                    const genes = Genes.dnaStrToObj(kitty.genes);
                                    return <CatalogueCard
                                        key={kitty.id}
                                        dna={genes}
                                        data={kitty}
                                        size={'3px'}>
                                    </CatalogueCard>;
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