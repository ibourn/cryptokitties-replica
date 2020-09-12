import React, { useState } from 'react';

import Cat from '../Cat/Drawing/Cat'

import { Time } from '../../assets/modules/utils';
import { Genes } from '../../assets/modules/utils';

/**
 * displays a cat card for the catalogue
 * 
 * @param {any} props 
 */
export default function CatalogueCard(props) {
    const [scale, setScale] = useState(false);

    const toggleClick = () => {
        setScale(!scale)
    }

    const cardClass = "miniCatBox col-6 col-md-4 col-lg-3 " + (!scale ? "" : "scale");
    const divAttributesClass = !scale ? "AttributesSummary" : "AttributesDetail";
    const divDetailClass = !scale ? "noDetails" : "detailsSize";
    const divSummaryClass = !scale ? "summarySize" : "detailsSize";

    const animation = Genes.convertValue('animation', props.dna.animation);
    const animationTxt = animation === 'none' ? 'no anmation' : animation;

    return (
        <div className={cardClass} onClick={toggleClick} >
            <div className="row">

                <div className="CatCol col-4 p-0">
                    <Cat dna={props.dna} size={props.size}></Cat>
                </div>

                <div className="col-8">
                    <div className={divAttributesClass}>
                        <div className={divSummaryClass}>
                            <span>id :</span>
                            <span className="badge badge-dark">{props.data.id}</span>
                        </div>
                        <div className={divSummaryClass}>
                            <span>generation :</span>
                            <span className="badge badge-dark">{props.data.generation}</span>
                        </div>
                        <hr className={divDetailClass} />
                        <div className={divDetailClass}>
                            <span>genes :</span>
                            <span className="badge badge-dark">{props.data.genes}</span>
                        </div>
                        <div className={divDetailClass}>
                            <span>mum id :</span>
                            <span className="badge badge-dark">{props.data.mumId}</span>
                        </div>
                        <div className={divDetailClass}>
                            <span>dad id :</span>
                            <span className="badge badge-dark">{props.data.dadId}</span>
                        </div>
                        <div className={divDetailClass}>
                            <span>bday :</span>
                            <span className="badge badge-dark">{Time.fromTimestamp(props.data.birthTime)}</span>
                        </div>
                        <hr />
                        <div className={divSummaryClass}>
                            <span>{scale ? `eyes shape :` : `eyes:`}</span>
                            <span className="badge badge-dark">
                                {Genes.convertValue(
                                    'eyesShape', props.dna.eyesShape)}
                            </span>
                        </div>
                        <div className={divSummaryClass}>
                            <span>{scale ? `decoration :` : `deco.:`}</span>
                            <span className="badge badge-dark">
                                {Genes.convertValue(
                                    'decorationPattern', props.dna.decorationPattern)}
                            </span>
                        </div>
                        <div className={divSummaryClass}>
                            <span className="badge badge-dark">{animationTxt}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}