import React from 'react';

import HomeCard from '../Cards/HomeCard';

import '../../assets/css/home.css';

export default function HomePage() {


    const defaultDNA = {
        "headColor": 10,
        "mouthColor": 13,
        "eyesColor": 96,
        "earsColor": 10,
        //Cattributes
        "eyesShape": 1,
        "decorationPattern": 1,
        "decorationMidcolor": 13,
        "decorationSidescolor": 13,
        "animation": 1,
        "lastNum": 1
    }

    return(<>
    <div className="container-fluid home__container" >
        <div className="catGroup" style={{position: 'relative', margin: '50px 0 200px 0'}}>
<HomeCard key={1} dna={defaultDNA} size={'2px'} style={{}}></HomeCard>
<HomeCard key={2} dna={defaultDNA} size={'2px'} style={{left: '50px',paddingLeft: '300px', marginLeft: '100px'}}></HomeCard>

<HomeCard key={3} dna={defaultDNA} size={'2px'} style={{top: '200px',left: '500px'}}></HomeCard>

<HomeCard key={4} dna={defaultDNA} size={'2px'} style={{position: 'absolute',margin: '50px',left: '60%'}}></HomeCard>

<HomeCard key={5} dna={defaultDNA} size={'2px'} style={{position: 'absolute',left: '80%'}}></HomeCard>


        </div>
        <div className="banner">
Collect and breed furrever friends
<button>Get your own kitty</button>

</div>
</div>
        </>);
}