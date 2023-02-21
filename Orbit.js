/*TO-DO:
- refine psychs
*/
const canvas = document.getElementById("OrbSim");
var context = canvas.getContext('2d');
const xCenter = canvas.width / 2;
const yCenter = canvas.height / 2;
var days = 0
var gameon = true;

var planets = [
    {
        "src": "assets/sunPA.png",
        "img": null,
        "size": 8 / 100,
        "start": 0,
        "orbitRad": 0 / 300,
        "delta": 0
    },
    {
        "src": "assets/mercuryPA.png",
        "img": null,
        "size": 5 / 100,
        "start": 150,
        "orbitRad": 39 / 300,
        "delta": 365 / 88
    },
    {
        "src": "assets/venusPA.png",
        "img": null,
        "size": 6 / 100,
        "start": 200,
        "orbitRad": 72 / 300,
        "delta": 365 / 255
    },
    {
        "src": "assets/earthPA.png",
        "img": null,
        "size": 6 / 100,
        "start": 25,
        "orbitRad": 100 / 300,
        "delta": 365 / 365
    },
    {
        "src": "assets/marsPA.png",
        "img": null,
        "size": 6 / 100,
        "start": 50,
        "orbitRad": 153 / 300,
        "delta": 365 / 687
    },
    {
        "src": "assets/asteroidPA.png",
        "img": null,
        "size": 5 / 100,
        "start": 180,
        "orbitRad": 292 / 300,
        "delta": 365 / 1821,
        "currentx": 0,
        "currenty": 0
    },
    {
        "src": "assets/rocket.png",
        "img": null,
        "size": 6 / 100,
        "start": 25,
        "orbitRad": 100 / 300,
        "delta": 365 / 365,
        "currentx": 0,
        "currenty": 0,
        "gravCenter": [xCenter, yCenter]
    }
];

const bgImg = new Image();
bgImg.src = "assets/starBG.jpg";

//you can only change the radius arc so many times- finite fuel.
var radChanges = 0;

var gameon = true;

document.getElementById("OrbiterInBtn").onclick = function () {
    if (radChanges < 10 ) {
        planets[6].orbitRad = planets[6].orbitRad - 1 / 50;
        radChanges++;
    }
};

document.getElementById("OrbiterOutBtn").onclick = function () {
    if (radChanges < 10 ) {
        planets[6].orbitRad = planets[6].orbitRad + 1 / 50;
        console.log(planets[6].orbitRad)
        radChanges++;
    }
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

    //frontloading images
    for (let i = 0; i < planets.length; i++) {
        const pImg = new Image();
        pImg.src = planets[i].src;
        planets[i].img = pImg;
    }

    //Timer for updating the canvas every 1ms
    setInterval(function () {
        context.clearRect(0, 0, canvas.height, canvas.width); //Clearing the canvas
        context.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        for (let i = 0; i < planets.length - 2; i++) {
            try {
                //Current position in degrees
                let currentPos = planets[i].start + (days * planets[i].delta)
                //Current length of radius (refers to size of canvas)
                let orb = planets[i].orbitRad * canvas.width * 5 / 8
                //Current size of planet (refers to length of canvas)
                let size = planets[i].size * canvas.width

                //all the planets but psyche are fairly simple drawimages
                context.drawImage(planets[i].img, findX(orb, currentPos) - size / 2, findY(orb, currentPos) - size / 2, size, size);

            } catch (error) {
                console.log(planets[i].src)
                console.error(error);
            }
        }

        drawPsyche()

        drawOrbiter()

        let ardistance = findDistance(planets[5].currentx,planets[5].currenty, planets[6].currentx, planets[6].currenty)

        if (ardistance < 30) {
            gameon = false;
            planets[6].gravCenter = [planets[5].currentx, planets[5].currenty]
            planets[6].orbitRad = ardistance / 300
            context.fillStyle='white';
            context.font = "30px Arial";
            context.fillText("SUCCESS", xCenter - 60, yCenter + 10);
            drawOrbiter()
        }

        let sundistance = findDistance(xCenter, yCenter, planets[6].currentx, planets[6].currenty)

        if (sundistance > canvas.width / 2) {
            gameon = false;
            context.fillStyle='white';
            context.font = "30px Arial";
            context.fillText("MISSION FAILED", xCenter - 120, yCenter + 10);
            drawOrbiter()
        }

        drawRotated(6, planets[6].currentx, planets[6].currenty, planets[6].size * canvas.width);

        days = days + 1
    }, 1);
}

function findX(radius, angle) {
    return xCenter + (radius * Math.cos(angle * Math.PI / 180) * .75)
}

function findY(radius, angle) {
    return yCenter + (radius * Math.sin(angle * Math.PI / 180) * .75)
}

//Calculates the orbiter position along it's preset trajectory
function drawOrbiter() {
        if (days % 5 == 0 && gameon) {
            console.log("log")
            planets[6].orbitRad = planets[6].orbitRad + 1 / 300;
        }
        else if (!gameon) {
            planets[6].gravCenter = [planets[5].currentx, planets[5].currenty]
        }
        let orb = planets[6].orbitRad * canvas.width / 2;
        //Current position in degrees
        let currentPos = planets[6].start + (days * planets[6].delta)
    
        planets[6].currentx = planets[6].gravCenter[0] + (orb * Math.cos(currentPos * Math.PI / 180) * .75);
        planets[6].currenty = planets[6].gravCenter[1] + (orb * Math.sin(currentPos * Math.PI / 180) * .75);
}

//Psyche needs its own draw function because I need to make sure the lit side stays facing the sun
function drawPsyche() {
    let i = 5;
    //Current position in degrees
    let currentPos = planets[i].start + (days * planets[i].delta)
    //Current length of radius (refers to size of canvas)
    let orb = planets[i].orbitRad * canvas.width * 5 / 8
    //Current size of planet (refers to length of canvas)
    let size = planets[i].size * canvas.width

    //calculate the coordinates of asteroid
    planets[i].currentx = findX(orb, currentPos) - size / 2;
    planets[i].currenty = findY(orb, currentPos) - size / 2;

    //now we need to rotate it toward the sun
    drawRotated(i, planets[i].currentx, planets[i].currenty, size);
}

function drawRotated(i, xcor, ycor, size) {
    //math: rad is how much the object should be rotated
    var rad = (days * planets[i].delta % 360) * Math.PI / 180;

    //Translate the canvas so that the posision of object is the origin
    context.translate(xcor, ycor);
    //Rotate the canvas the invers that Object is supposed to
    context.rotate(rad);
    //draw object
    context.drawImage(planets[i].img, 6 - size / 2, 6 - size / 2, size, size);
    //Rotate and translate canvas back
    context.rotate(0 - rad);
    context.translate(0 - xcor, 0 - ycor);
}

function findDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
} 