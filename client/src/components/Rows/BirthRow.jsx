import React from 'react';

import { Time } from '../../assets/modules/utils';

// import PropTypes from 'prop-types';
// import styled, { keyframes } from 'styled-components';


export default function CatLine(props) {

 

  
    return (
        <>
            <tr>
                <td>
                    {props.id}
                </td>
                <td>
                    {props.genes}
                </td>
                <td>
                    {Time.fromTimestamp(props.birthTime)}
                </td>
                <td>
                    {props.mumId}
                </td>
                <td>
                    {props.dadId}
                </td>
                <td>
                    {props.generation}
                </td>
   
                </tr>
        </>
    ); 
    }

// .propTypes = {
//   
// }
 