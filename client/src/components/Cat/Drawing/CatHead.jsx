import React from 'react';


import CatEars from './CatEars';
import CatHair from './CatHair';
import CatFurHead from './CatFurHead';
import CatFace from './CatFace';
/************************************
 * 
 * Composition of head's cat
 * 
 * ******************************** */
export default function CatHead(props) {

   
    return (
    <>
        <CatEars></CatEars>

        <CatHair></CatHair>
        <CatFurHead></CatFurHead>
        
        <CatFace dna={props.dna}></CatFace>
       </> 
    )
}