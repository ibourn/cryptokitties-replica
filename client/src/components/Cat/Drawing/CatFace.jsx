import React from 'react';

import CatEyes from './CatEyes';
/************************************
 * 
 * Kitties Factory Page
 * 
 * ******************************** */
import styled from 'styled-components';





export default function CatFace(props) {

    
    return (
    
        <div class="face">
        <div class="muzzle"></div>
    
        <CatEyes></CatEyes>
        <div class="truffle"></div>
        <div class="mouth"></div>
        <div class="tongue"></div>
        <div class="mustache left_mustache"></div>
        <div class="mustache right_mustache"></div>
    </div>
    )
}