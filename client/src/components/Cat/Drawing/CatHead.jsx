import React from 'react';


import CatEars from './CatEars';
import CatHair from './CatHair';
import CatFurHead from './CatFurHead';
import CatFace from './CatFace';
/************************************
 * 
 * Kitties Factory Page
 * 
 * ******************************** */
import styled from 'styled-components';





export default function CatHead(props) {

   
    return (
    <>
        <CatEars></CatEars>

        <CatHair></CatHair>
        <CatFurHead></CatFurHead>
        
        <CatFace></CatFace>
       </> 
    )
}