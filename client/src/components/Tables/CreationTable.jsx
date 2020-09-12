import React from 'react';

import BirthRow from '../Rows/BirthRow';


/**
 * tables gen0 creation events
 * 
 * @todo style and add user's events
 */
export default function CreationTable(props) {



    return(
        <table className="table table-primary table-bordered">
        <caption>Creation of Gen0</caption>
        <thead>
            <tr>
                <th>id</th>
                <th>genes</th>
                <th>date of birth</th>
                <th>mum Id</th>
                <th>dad Id</th>
                <th>generation</th>
            </tr>
        </thead>
        <tbody>
            {props.creationList ?
                props.creationList.map((kitty) => {
                if(kitty){
                    return <BirthRow
                        key={kitty.id}
                        id={kitty.id}
                        genes={kitty.genes}
                        birthTime={kitty.birthTime}
                        mumId={kitty.mumId}
                        dadId={kitty.dadId}
                        generation={kitty.generation}
                    />
                } else {
                    return null;
                }
            }) : null
            }
        </tbody>
    </table>
    )
}