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
    
        <div class="pawn pawn-rear_left">
            <div class="calw"></div>
        </div>
        <div class="pawn pawn-rear_right">
            <div class="calw"></div>
        </div>
    
        <div class="pawn pawn-front_left">
            <div class="claw"></div>
        </div>
    
    
        <div class="pawn pawn-front_right">
            <div class="claw"></div>
        </div>
    
        <div class="limb-front limb-left">
            <div class="limb-bottom"></div>
        </div>
        <div class="limb-front limb-right">
        <div class="limb-bottom"></div>
        </div>
    </div>
    )
}