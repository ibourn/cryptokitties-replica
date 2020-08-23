import { keyframes } from 'styled-components';

export const moveHead = keyframes` 
0% {
  transform: rotate(0deg);
}
30% {
  transform: rotate(-10deg);
}
60% {
  transform: rotate(10deg);
}
100% {
  transform: rotate(0deg);
}
`;


export const moveTail = keyframes` 
0% {
  transform: rotate(-90deg);   
}
60% {
  transform: rotate(-145deg);
}
100% {
  transform: rotate(-90deg);
}
`;


export const moveEars = keyframes` 
0% {
  transform: skewY(0deg);;

}
20% {
  transform: skewY(5deg);
}
30% {
  transform: skewY(6deg);
}
50% {
  transform: skewY(0deg);
}
70% {
  transform: skewY(-5deg);
}
80% {
  transform: skewY(-6deg);
}
100% {
  transform: skewY(0deg);
}
`;


export const moveTruffle = keyframes` 
0% {
  transform: translateX(0);   
}
30% {
    transform: translateX(-0.2em);   
  }
70% {
  transform: translateX(0.3em);
}
100% {
  transform: translateX(0);
}
`;