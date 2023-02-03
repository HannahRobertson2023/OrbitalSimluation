/*TO-DO:
- refine psychs
*/
const canvas2 = document.getElementById("OrbSim");
var context = canvas2.getContext('2d');
const xCenter = canvas2.width / 2;
const yCenter = canvas2.height / 2;
var days = 0

//Planet information: initial position, size, color, orbital radius, movement per day
//TODO: get better infomration about position of planets relative to each other
//Maybe ask Cassie about that. 
//Current positions estimated from:
//https://theskylive.com/where-is-psyche
//https://www.theplanetstoday.com/
const planetStart = [0, 150, 200, 25, 50, 175, 176, 177, 178, 179, 180]
const planetSizes = [10, 2, 3, 4, 5, 1, 1, 1, 1, 1, 2]
const planetColors = ["yellow", "orange", "tan", "blue", "red", "lightblue", "lightblue", "lightblue", "lightblue", "lightblue", "brown"]
const planetOrbits = [0 / 300, 39 / 300, 72 / 300, 100 / 300, 153 / 300, 292 / 300, 292 / 300, 292 / 300, 292 / 300, 292 / 300, 292 / 300]
const planetDelta = [0, 365 / 88, 365 / 255, 365 / 365, 365 / 687, 365 / 1821, 365 / 1821, 365 / 1821, 365 / 1821, 365 / 1821, 365 / 1821]

//orbiter information: original position and spiral movement (rise/run)
//starts on earth
const orbiterStart = planetStart[3];
//radius increases every x days
var changeBy = 1;
//you can only change the radius arc so many times- finite fuel.
var radChanges = 0;
var orbiterRadius = 100;
var currentPositions = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]

var currentXPos = 0;
var currentYPos = 0;
var gameon = true;

document.getElementById("OrbiterInBtn").onclick = function () {
    changeBy = changeBy - 1;
};

document.getElementById("OrbiterOutBtn").onclick = function () {
    changeBy = changeBy + 1;
};

/***
 * How the game works:
 * You have a button for inner and a button for outer
 * Each button changes the radius arc- how fast hte radius of orbiter increases
 * You have a set amount of changes to make (to account for fuel conservation)
 * Avoid Mars, but hit psyche
 */
window.onload = orbSim;

function orbSim() {
    //Timer for updating the canvas2 every 1ms
    setInterval(function () {
        if (gameon) {
            context.clearRect(0, 0, canvas2.height, canvas2.width); //Clearing the canvas2
            for (let i = 0; i < planetDelta.length; i++) {
                let currentPos = planetStart[i] + (days * planetDelta[i]);
                days = days + 1;

                var orb = planetOrbits[i] * canvas2.width / 2;

                if (i == 3 || i == 4) {
                    currentPositions[i - 3][0] = findX(orb, currentPos);
                    currentPositions[i - 3][1] = findY(orb, currentPos);
                }

                currentXPos = findX(orb, currentPos);
                currentYPos = findY(orb, currentPos);

                drawPlanet(currentXPos, currentYPos,
                    planetSizes[i], planetColors[i])
            }
            findOrbiterPosition()
        }
    }, 100);
}

function drawPlanet(x, y, r, color) {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

function findX(radius, angle) {
    return xCenter + (radius * Math.cos(angle * Math.PI / 180) * .75)
}

function findY(radius, angle) {
    return yCenter + (radius * Math.sin(angle * Math.PI / 180) * .75)
}

function drawOrbiter(x, y) {
    context.beginPath();
    context.arc(x, y, 1, 0, 2 * Math.PI, false);
    context.fillStyle = "black";
    context.fill();
    context.closePath();
}

//Calculates the orbiter position along it's preset trajectory
function findOrbiterPosition() {
    if (days % 3 == 0) {
        orbiterRadius = orbiterRadius + changeBy;
    }
    let orb = orbiterRadius / 300 * canvas2.width / 2;
    let currentPos = orbiterStart + (days * 365 / 365);

    x = xCenter + (orb * Math.cos(currentPos * Math.PI / 180) * .75);/*TO-DO:
    - refine psychs
    */
    const orbCanvas = document.getElementById("OrbSim");
    var orbContext = orbCanvas.getContext('2d'); 
    const xCenter = orbCanvas.width / 2;
    const yCenter = orbCanvas.height / 2;
    var days = 0
    
    //Planet information: initial position, size, color, orbital radius, movement per day
    //TODO: get better infomration about position of planets relative to each other
    //Maybe ask Cassie about that. 
    //Current positions estimated from:
    //https://theskylive.com/where-is-psyche
    //https://www.theplanetstoday.com/
    
    const bgImg = new Image();
    bgImg.src = "AsteroidAssets/orbSimAssets/starBG.jpg";
    
    //Took a leaf out of Sakan's book and made one big object array instead of small arrays
    var planets = [
        {"src": "AsteroidAssets/orbSimAssets/sunPA.png",
        "img": null, 
        "size": 10 / 100,
        "start": 0,
        "orbitRad": 0 / 300, 
        "delta": 0},
        {"src": "AsteroidAssets/orbSimAssets/mercuryPA.png",
        "img": null, 
        "size": 3 / 100,
        "start": 150,
        "orbitRad": 39 / 300, 
        "delta": 365 / 88},
        {"src": "AsteroidAssets/orbSimAssets/venusPA.png",
        "img": null, 
        "size": 4 / 100,
        "start": 200,
        "orbitRad": 72 / 300, 
        "delta": 365 / 255},
        {"src": "AsteroidAssets/orbSimAssets/earthPA.png",
        "img": null, 
        "size": 4 / 100,
        "start": 25,
        "orbitRad": 100 / 300, 
        "delta": 365 / 365},
        {"src": "AsteroidAssets/orbSimAssets/marsPA.png",
        "img": null, 
        "size": 5 / 100,
        "start": 50,
        "orbitRad": 153 / 300, 
        "delta": 365 / 687},
        {"src": "AsteroidAssets/orbSimAssets/asteroidPA.png",
        "img": null, 
        "size": 4 / 100,
        "start": 180,
        "orbitRad": 292 / 300, 
        "delta": 365 / 1821}
        ];
    
    //made the orbSim a global function to be called in other js files.
    window.orbSim = function orbSim() {
    
        //frontloading images
        for (let i = 0; i < planets.length; i++) { 
            const pImg = new Image();
            pImg.src = planets[i].src;
            planets[i].img = pImg;
        }
    
        //Timer for updating the canvas every 1ms
        setInterval(function() {
            orbContext.clearRect(0,0,orbCanvas.height,orbCanvas.width); //Clearing the canvas
            orbContext.drawImage(bgImg,0,0,orbCanvas.width, orbCanvas.height);
            for (let i = 0; i < planets.length; i++) { 
                //Current position in degrees
                let currentPos = planets[i].start + (days * planets[i].delta)
                //Current length of radius (refers to size of canvas)
                let orb = planets[i].orbitRad * orbCanvas.width / 2
                //Current size of planet (refers to length of canvas)
                let size = planets[i].size * orbCanvas.width
                try {
                    if (i == planets.length - 1) {
                        //It's onerous enought that it needed its own function
                       drawPsyche(i, orb, currentPos, size)
                    }
                    else {
                        //all the planets but psyche are fairly simple drawimages
                        orbContext.drawImage(planets[i].img, findX(orb, currentPos) - size / 2, findY(orb, currentPos) - size / 2, size, size);
                    }
                  } catch (error) {
                    console.log(planets[i].src)
                    console.error(error);
                  }
            }
            days = days + 1
        }, 20);
    }
    
    //Psyche needs its own draw function because I need to make sure the lit side stays facing the sun
    function drawPsyche(i, orb, currentPos, size) {
        //math: rad is how much the asteroid should be rotated
        var rad = (days * planets[i].delta % 360) * Math.PI / 180;
        //xcor and ycor are simply for reference, as I need to do and undo a canvas transformation 
        //and I need to save the undo coords
        let xcor = findX(orb, currentPos) - size / 2
        let ycor = findY(orb, currentPos) - size / 2
    
        //Translate the canvas so that the posision of Psyche is the origin
        orbContext.translate(xcor, ycor);
        //Rotate the canvas the invers that Psyche is supposed to
        orbContext.rotate(rad);
        //draw Psyche
        orbContext.drawImage(planets[i].img, 6 - size / 2, 6 - size / 2, size, size);
        //Rotate and translate canvas back
        orbContext.rotate(0 - rad);
        orbContext.translate(0 - xcor, 0 - ycor);
    }
    
    //Finds the x coordinate given radius and angle
    function findX(radius, angle) {
        return xCenter + (radius * Math.cos(angle * Math.PI / 180) * .75)
    }
    
    //Find the y coordinates given radius and angle
    function findY(radius, angle) {
        return yCenter + (radius * Math.sin(angle * Math.PI / 180) * .75)
    }
    y = yCenter + (orb * Math.sin(currentPos * Math.PI / 180) * .75);

    drawOrbiter(x, y);

    //the current_Pos are global for this reason and this reason only
    //Psyche was the last object to have its position calculated on these variables
    //This way I don't have to recalculate it again.
    if (checkDistance(x, y, currentXPos, currentYPos)) {
        // you win! congrats!
        context.font = "30px Arial";
        context.textAlign = "center";
        context.fillText("You Won", xCenter, yCenter);
        gameon = false;
    }
}

// find the distance between two sets of coords
function checkDistance(x1, y1, x2, y2) {
    xdiff = x1 - x2
    ydiff = y1 - y2
    if (Math.sqrt((xdiff * xdiff) + (ydiff * ydiff)) < 15) {
        return true
    }
    return false
}