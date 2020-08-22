import styled from 'styled-components';

import { allColors } from '../modules/colors';
import { Color as clr } from '../modules/utils';

/*
set of available colors
*/
const colors = Object.values(allColors());

/**
 * style of cat
 */
export const StyledCat = styled.div`

/**********************************************************
color variables
*********************************************************/
//head and body
--headColor:  ${props => clr.formatHex(colors[props.dna.headColor])};
//belly, muzzle and tail
--bellyColor: ${props => clr.formatHex(colors[props.dna.mouthColor])};
//pupils
--eyesColor: ${props => clr.formatHex(colors[props.dna.eyesColor])};
//ears and paws
--earsColor: ${props => clr.formatHex(colors[props.dna.earsColor])};
//glint...
--whiteColor: #ffffff;
//whiskers
--darkColor: #363434;
//claw
--blackColor: #000000;
//outline of body and pawns when same color behind
--outlineColor: ${props => clr.contrast(colors[props.dna.headColor], 'contrast')};
--outlinePawnColor: ${props => clr.contrast(colors[props.dna.earsColor], 'contrast')};
// inside of ears, truffle, tongue
--rawColor: rgb(250,153,108,1);
//shadows
--shadowMidColor: rgba(145,101,81,1);
--shadowEndColor: rgba(41,27,21,1);
--shadowBellyMidColor: ${props => clr.contrast(colors[props.dna.headColor], 'midDarken')};
--shadowBellyEndColor: ${props => clr.contrast(colors[props.dna.headColor], 'darken')};

/**********************************************************
adapt the size of the cat to make it responsive
*********************************************************/
font-size: ${props => props.size};

position: relative;
.essai{
    position: relative;
}

/**********************************************************
colors
*********************************************************/
.face, .hair, .fur, .fur:before, .fur:after, .front, .limb-front{
    background-color: var(--headColor);
}
.muzzle, .tail{
    background-color: var(--bellyColor);
 }
.pupils{
   background-color: var(--eyesColor);
 }
 .ear, .pawn{
  background-color: var(--earsColor);
 }
 .eye, .glint{
    background-color: #ffffff;
 }
.claw, .claw:after, .claw:before{
    background-color: #000000;
}
/**********************************************************
color gradient
*********************************************************/




/**********************************************************
general
*********************************************************/
.container{
    margin-top: 10%;
    margin-left: 30%;
}
.cat{
    position: relative;
}


/*********************************************************
face and muzzle
*********************************************************/
.face {
    border-bottom: 0.1em solid var(--outlineColor);//rgb(223, 193, 94);
    width: 22em;
    height: 20em;
    border-radius: 50%;
    position: relative;
    z-index: 1;
    border-left: none;
}
.muzzle{
    position: absolute;
    border-radius: 50%;    
    height: 10em;
    width: 18em;
    top: 9em;
    left: 2em; 
    z-index: 1;   
}

/*********************************************************
truffle, mouth, mustache
*********************************************************/
.truffle{
    position: absolute;
    border-radius: 20%;
    height : 0;
    width : 0;
    border-top : 2em solid var(--rawColor);//rgb(250,153,108,1);
    border-right : 1em solid transparent;
    border-left : 1em solid transparent;
    top: 11em;
    left: 10em; 
    z-index: 1;
}
.mouth{
    position: absolute;
    width: 3.5em;
    height: 4em;
    border-radius: 50%;
    box-shadow: 0em 0.2em 0 0 var(--blackColor);
    left: 7.5em;
    z-index: 1;
}
.mouth:after{
    position: absolute;
    content: "";
    width: 3.5em;
    height: 4em;
    border-radius: 50%;
    box-shadow: 0em 0.2em 0 0 var(--blackColor);
    left: 3.5em;
}
.tongue{
    position: absolute;
    height : 0;
    width : 0;
    border-bottom : 1em solid var(--rawColor);
    border-right : 0.3em solid transparent;
    border-left : 0.3em solid transparent;
    left: 10.7em;
    top: 13.8em;
    z-index: 1;
}

.mustache{
    position: absolute;
        width: 8em;
        height: 4em;
        border-radius: 50%;
        box-shadow: 0em 0.1em 0 0 var(--darkColor);
        left: 18em;
        transform-origin: left;
        transform: rotate(-15deg);
        z-index: 1;
}
.mustache:before, .mustache:after{
    position: absolute;
    content: "";
        width: 8em;
        height: 4em;
        border-radius: 50%;
        box-shadow: 0em 0.1em 0 0 var(--blackColor);
        transform-origin: left;
}
.mustache:before{
   
        transform: rotate(-15deg);
        top: -0.5em;

}
.mustache:after{
    
        transform: rotate(15deg);
        top: 0.5em;
}
.mustache-left{
        left: 4em;
        transform: scale(-1,1) rotate(-15deg);
}

/*********************************************************
eyes, pupils and glint
*********************************************************/
.eyes{
    position: relative;
    top: 3em;
    display: flex;
    z-index: 2;

}
.eye{
    border-radius: 50%;
    width: 6em;
    height: 6em;
    margin: 2.5em;
    position: relative;
}
.pupils{
    width: 5.2em;
    height: 5.2em;
    border-radius: 50%;
    position: absolute;
    top: 0.4em;
    left: 0.4em;
}
.glint{
    border-radius: 50%;
    position: absolute;
}
.glint-sup{
    width: 1.5em;
    height: 1.5em;
    top: 1.5em;
    left: 1.5em;
}
.glint-inf{
    width: 0.8em;
    height: 0.8em;
    top: 3em;
    left: 1.5em;

}
/*********************************************************
ears and inside ears
*********************************************************/
.ears{
    position: relative;
}
.ear{
    border-radius: 90% 0 90% 0;
    height: 15em;
    width: 15em;
    top: -2em;
    position: absolute;
    transform: rotate(-10deg);    
}
.ear-left{
    left: -3em;
    transform: scale(1,-1) rotate(-10deg);
}
.ear-right{
    left: 10em;
}
.ear-inside{
    border-radius: 90% 0 90% 0;
    height: 13.3em;
    width: 12.9em;
    top: 1em;
    position: absolute;
    transform: rotate(5deg);
    left: 1em;
    background: linear-gradient(133deg, var(--shadowEndColor) 0%, var(--shadowMidColor) 30%, var(--rawColor) 52%, var(--rawColor) 100%);
}
.ear-inside_left{
    background: linear-gradient(129deg, var(--rawColor) 0%, var(--rawColor) 45%, var(--shadowMidColor) 75%, var(--shadowEndColor) 100%);
}

/*********************************************************
fur top
*********************************************************/
.head-hair{
    position: relative;
    top: -0.5em;
}
.hair {
  position: absolute;
}
.hair-left, .hair-middle, .hair-right{
    border-radius: 100% 00% 100% 100%;
    width: 2em;
    transform: rotate(-45deg);
}
.hair-left {
    display: none;
    top: 0.5em;
    left: 8em;
    height: 1.5em;
  }
  .hair-middle {
    top: 0em;
    left: 10em;
    height: 2em;
  }
  .hair-right {
      display: none;
    top: 0.5em;
    left: 12em;
    height: 1.5em;
  }

/*********************************************************
fur left and right
*********************************************************/
  .head-fur{
    position: absolute;
    top: 13.5em;
    left: 0.7em;
    transform: rotate(-135deg);
}
.fur {
    position: absolute;
    border-radius: 100% 0 100% 100%;
    width: 2em;
    height: 2em;
    top: 0.8em;
    left: 0.9em;  
}
.fur:before, .fur:after{
    position: absolute;
    content: "";
    border-radius: 100% 0 100% 100%;
    width: 2em;
    height: 2em;
}
.fur:before {
    top: -0.5em;
    left: -1em;
    height: 1em;
  }
  .fur:after {
    top: 1em;
    left: 0.8em;
    height: 1em;
  }

  .fur-right{
    position: absolute;
      transform: scale(-1, -1);
      top: 15.5em;
      left: -13.5em;
  }

/*********************************************************
body => front = trunk, belly, rear
*********************************************************/
.body{
    position: relative;
    top: -1em;
}
  .front{
    position: absolute;
    border-radius: 30% 30% 50% 50% / 40% 40% 50% 50%;
    height: 25em;
    width: 18em;
    top: -1em;
    left: 2em;
  }
  .rear{
    position: absolute;
    background: radial-gradient(circle, var(--shadowEndColor) 0%, var(--shadowEndColor) 50%, var(--headColor) 65%, var(--headColor) 100%);
    border-bottom: 0.1em solid var(--outlineColor);
    border-radius: 27% 27% 20% 20% / 35% 35% 65% 67%;
    height: 16em;
    width: 22em;
    top: 8.9em;
  }
  .belly{
    position: absolute;
    border-radius: 40% 40% 0 0/ 95% 95% 0 0;
    background: linear-gradient(180deg, var(--bellyColor) 0%, var(--bellyColor) 20%, var(--shadowBellyMidColor) 85%, var(--shadowBellyEndColor) 95%);
    height: 21em;
    width: 13em;
    top: 4em;
    left: 2.5em; 
    z-index: 1;
  }
.tail{
    position: absolute;
    border-radius: 30% 30% 30% 30% /0 0 80% 50%;
    border-left: 0.5em solid var(--bellyColor);
    height: 21em;
    width: 3em;
    top: 23em;
    left: 11em;
    transform-origin: top left;
    transform: rotate(-90deg);
}

/*********************************************************
limb
*********************************************************/
  .limb-front{
    position: absolute;
    //border-top: 0.5em solid var(--headColor);
    border-bottom: 0.1em solid var(--outlineColor);
    border-left: 0.1em solid var(--outlineColor);
    border-right: 0.1em solid var(--outlineColor);
    // border-radius: 20% 20% 0 0;
    height: 20em;
    width: 5em;
    top: 5em;
    left: 0em;
    z-index: 3;
  } 
  .limb-bottom{
    position: absolute;
    width: 4.5em;
    height: 12em;
    background: linear-gradient(180deg, var(--headColor) 0%,  var(--earsColor) 70%, var(--earsColor) 100%);
    top: 7.9em;
    z-index: 3;
  }
   .limb-left{
    left: 3em;
    transform: rotate(-5deg);  
    border-radius: 20% 50% 80% 90% / 50% 50% 10% 10%;
  }   
  .limb-right{
    left: 14em;
    transform: rotate(5deg); 
    border-radius: 50% 20% 90% 80% / 50% 50% 10% 10%; 
  }

/*********************************************************
pawn, claw, front and rear pawn
*********************************************************/
  .pawn{
    position: absolute;
    border-top: 0.1em solid var(--outlinePawnColor);
    border-radius: 40% 40% 20% 20%;
    height: 2.5em;
    width: 6em;
    top: 23em;
    z-index: 2;
  }
  .claw{
    position: absolute;
    width: 0.2em;
    height: 1.5em;
    top: 0.5em;
    left: 3em;
    z-index: 3;
  }
  .claw:after, .claw:before{
    position: absolute;
    content: ' ';
    width: 0.2em;
    height: 1.2em;
    top: 0.3em;
  } 
   .claw:before{
    left: -2em;
  }
  .claw:after{
    left: 2em;
  }

  .pawn-rear_left{
    position: absolute;
    border-left: 0.1em solid var(--outlineColor);
    height: 2.5em;
    top: 22.5em;
    left: 2.5em;
  } 
  .pawn-rear_right{
    position: absolute;
    border-right: 0.1em solid var(--outlineColor);
    height: 2.5em;
    top: 22.5em;
    left: 13.5em;
  }
  .pawn-front_left{
    border-left: 0.1em solid var(--outlinePawnColor);
    border-right: 0.1em solid var(--outlineColor);
    z-index: 4;
    left: 3.5em;
  } 
  .pawn-front_right{
    border-left: 0.1em solid var(--outlineColor);
    border-right: 0.1em solid var(--outlinePawnColor);
    z-index: 4;
    left: 12.5em;
  }
/* .cursor {
    position: absolute;
    height: 23em;
    width: 23em;
    border: none;
    border-radius: 50%;
    background: #b40660;
    transform: translateX(-50%) translateY(-50%);
    z-index: 4000;
} */


`