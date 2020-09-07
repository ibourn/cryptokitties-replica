import React, {useState } from 'react';

import Cat from '../Cat/Drawing/Cat'


export default function HomeCard(props) {




    return( 
        <div className="homeCatBox" >
         <div style={{position: 'relative'}}>
    <Cat dna={props.dna} size={props.size}></Cat>
    </div>
    </div>
    );

}