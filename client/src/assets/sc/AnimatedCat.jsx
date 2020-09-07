import styled, { keyframes } from 'styled-components';


/**
 * animation adapted from the work of Johan Mouchet
 * 
 * 'Pure CSS cat animation' / https://codepen.io/johanmouchet/pen/OXxvqr
 * 
 */


const blink = keyframes` 
        0% { height: 0; }
		90% { height: 0; }
		92.5% { height: 100%; }
		95% { height: 0; }
		97.5% { height: 100%; }
		100% { height: 0; }
}
`;
const lookAround = keyframes` 
        0% { transform: translate(0) }
        5% { transform: translate(50%, -25%) }
        10% { transform: translate(50%, -25%) }
        15% { transform: translate(-100%, -25%) }
        20% { transform: translate(-100%, -25%) }
        25% { transform: translate(0, 0) }
        100% { transform: translate(0, 0) }
}
`;


/**
 * style of the cat and animation
 */
export const AnimatedCat = styled.div`

span{
	position: absolute;
	top: 10%;
	left: 15%;
	width: 85%;
	padding-right: 10%;
	font-size: 15px;
	line-height: 15px;
	color: white;
}


--colorBlack: #161616;
--colorWhite: #fff;
--size: 100px; // (Fully responsive)

// Cat
.cat {
	position: relative;
	height: var(--size);
	width: calc(var(--size) * 1.13);
}

// Ears
.ear {
	position: absolute;
	top: 27%;
	height: 25%;
	width: 9%;
	background: var(--colorWhite);
	
	// Ear hair
	&::before,
	&::after {
		content: '';
		position: absolute;
		bottom: 33%;
		height: 10%;
		width: 5%;
		border-radius: 50%;
		background: var(--colorBlack);
	}
	
	&::after {
		transform-origin: 50% 100%;
	}
}

.ear--left {
	left: 29%;
	border-radius: 70% 30% 0% 0% / 100% 100% 0% 0%;
	transform: rotate(-15deg);
	&::before,
	&::after {
		right: 10%;
	}
	
	&::after {
		transform: rotate(-45deg);
	}
}

.ear--right {
	left: 49%;
	border-radius: 30% 70% 0% 0% / 100% 100% 0% 0%;
	transform: rotate(15deg);
	
	&::before,
	&::after {
		left: 10%;
	}
	
	&::after {
		transform: rotate(45deg);
	}
}

// Face
.face {
	position: absolute;
	height: 40%;
	width: 27%;
	background: var(--colorBlack);
	border-radius: 50%;

	top: 40%;
	left: 30%;
}

// Eyes
.eye {
	position: absolute;
	top: 35%;
	height: 30%;
	width: 31%;
	background: var(--colorWhite);
	border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
	
	// Eyelids
	::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		height: 0;
		width: 100%;
		border-radius: 0 0 50% 50% / 0 0 40% 40%;
		background: var(--colorBlack);
		animation: ${blink} 4s infinite ease-in;
	}
	
	
	// Tips of the eyes
	&::before {
		content: '';
		position: absolute;
		top: 60%;
		height: 10%;
		width: 15%;
		background: var(--colorWhite);
		border-radius: 50%;
	}
}

.eye--left {
	left: 0;
	
	&::before {
		right: -5%;
	}
}

.eye--right {
	right: 0;
	
	&::before {
		left: -5%;
	}
}

// Pupils
.eye-pupil {
	position: absolute;
	top: 25%;
	left: 50%;
	height: 50%;
	width: 20%;
	background: var(--colorBlack);
	border-radius: 50%;
	animation: ${lookAround} 4s infinite;

	
	.eye--left & {
		right: 30%;
	}
	
	.eye--right & {
		left: 30%;
	}
	
	// Glare on the pupil
	&::after {
		content: '';
		position: absolute;
		top: 30%;
		right: -5%;
		height: 20%;
		width: 35%;
		border-radius: 50%;
		background: var(--colorWhite);
	}
}

// Muzzle
.muzzle {
	position: absolute;
	top: 60%;
	left: 50%;
	height: 6%;
	width: 10%;
	background: var(--colorWhite);
	transform: translateX(-50%);
	border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
}


`