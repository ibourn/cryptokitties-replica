import React from 'react';

import CatEars from './CatEars';
import CatHead from './CatHead';
import CatBody from './CatBody';

import styled from 'styled-components';

import { StyledCat } from '../../../assets/sc/StyledCat';
/************************************
 * 
 * Kitties Factory Page
 * 
 * ******************************** */
import { allColors } from '../../../assets/modules/colors';



const colors = Object.values(allColors());
export default function Cat(props) {

    const contianerStyle = {
        marginTop: '12vh',
        marginBottom: '10vh'
    }
    const fontSize = '4px';
    
    return (
        <>
              <StyledCat class="cat" size={fontSize} dna={props.dna}>
              <CatHead></CatHead>

<CatBody></CatBody>
                </StyledCat>




        </>

    );

}


