import React from 'react';

import HomeCard from '../Cards/HomeCard';
import { Random } from '../../assets/modules/utils';

import '../../assets/css/home.css';



/**
 * Landing Page
 */
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
        const loadRandomKitties = (n) => {
                let kittiesList = [];
                for (let i = 0; i <= n; i++) {
                        kittiesList.push({
                                "headColor": Random.inRange(10, 100),
                                "mouthColor": Random.inRange(10, 100),
                                "eyesColor": Random.inRange(10, 100),
                                "earsColor": Random.inRange(10, 100),
                                "eyesShape": Random.inRange(1, 7),
                                "decorationPattern": Random.inRange(1, 9),
                                "decorationMidcolor": Random.inRange(10, 100),
                                "decorationSidescolor": Random.inRange(10, 100),
                                "animation": Random.inRange(1, 7),
                                "lastNum": Random.inRange(1, 10)
                        });
                }
                return kittiesList;
        }

        const kittiesList = loadRandomKitties(4);
        const catSize = '3px';

        return (<div className="trick">
                <div className="container-fluid home__background " >
                        <div className="particle-1"></div>
                        <div className="particle-2"></div>
                        <div className="particle-3"></div>
                        <div className="particle-4"></div>
                        <div className="container home__container" >


                                <div className="middleBox">
                                        <div className="catGroup">
                                                <div className="cat0">
                                                        <HomeCard key={0} dna={kittiesList[0]} size={catSize}></HomeCard>
                                                </div>
                                                <div className="cat1">
                                                        <HomeCard key={1} dna={defaultDNA} size={catSize} ></HomeCard>
                                                </div>
                                                <div className="cat2">
                                                        <HomeCard key={2} dna={kittiesList[1]} size={catSize}></HomeCard>
                                                </div>
                                                <div className="cat3">
                                                        <HomeCard key={3} dna={kittiesList[2]} size={catSize}></HomeCard>
                                                </div>
                                                <div className="cat4">
                                                        <HomeCard key={4} dna={defaultDNA} size={catSize}></HomeCard>
                                                </div>
                                                <div className="cat5">
                                                        <HomeCard key={5} dna={kittiesList[3]} size={catSize}></HomeCard>
                                                </div>
                                                <div className="cat6">
                                                        <HomeCard key={6} dna={kittiesList[0]} size={catSize}></HomeCard>
                                                </div>
                                                <div className="cat7">
                                                        <HomeCard key={7} dna={kittiesList[4]} size={catSize}></HomeCard>
                                                </div>
                                                <div className="cat8">
                                                        <HomeCard key={8} dna={kittiesList[2]} size={catSize}></HomeCard>
                                                </div>
                                        </div>

                                        <div className="banner">
                                                <p> Collect and breed furrever friends!</p>
                                                <button className="white-btn">Get your own kitty</button>
                                        </div>
                                </div>
                        </div>
                </div>
        </div>);
}