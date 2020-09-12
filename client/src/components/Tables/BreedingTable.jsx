import React from 'react';

import BirthRow from '../Rows/BirthRow';


/**
 * tables of breeding events
 * 
 * @todo style and add user's events
 */
export default function BreedingTable(props) {



    return(
        <table className="table table-primary table-bordered">
        <caption>Breeding</caption>
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
            {props.breedingList ?
                props.breedingList.map((kitty) => {
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