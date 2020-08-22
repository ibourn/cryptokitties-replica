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
        <div class="mustache mustache-left"></div>
        <div class="mustache mustache-right"></div>
    </div>
    )
}