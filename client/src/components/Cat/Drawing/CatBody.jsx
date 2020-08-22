import React from 'react';


/************************************
 * 
 * Kitties Factory Page
 * 
 * ******************************** */
import styled from 'styled-components';





export default function CatBody(props) {

 
    return (
    
        <div class="body">
        <div class="tail"></div>
        <div class="front">
            <div class="belly"></div>
        </div>
        <div class="rear"></div>
    
        <div class="pawn rear_left_pawn">
            <div class="calw"></div>
        </div>
        <div class="pawn rear_right_pawn">
            <div class="calw"></div>
        </div>
    
        <div class="pawn front_left_pawn">
            <div class="claw"></div>
        </div>
    
    
        <div class="pawn front_right_pawn">
            <div class="claw"></div>
        </div>
    
        <div class="front_limb left_limb"></div>
        <div class="front_limb right_limb"></div>
    </div>
    )
}