/*

The Game Project 

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var gameScore;
var flagpole;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var trees_y;

var canyons;
var collectables;

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    
    //Initialise game mechanics
    gameScore = 0;
    flagpole = {
        x_pos: 2650,
        isReached: false
    };

	// Initialise arrays of scenery objects.
    trees_x = [450, 750, 1050, 1350, 1650, 1900, 2200, 2500];
    trees_y = floorPos_y - 141;
    
    clouds = [
        {
        x_pos: 200,
        y_pos: 180,
        size: 1.3},
        {
        x_pos: 800,
        y_pos: 240,
        size: 1},
        {
        x_pos: 500,
        y_pos: 110,
        size: 1.5},
        {
        x_pos: 1200,
        y_pos: 180,
        size: 1.3},
        {
        x_pos: 1800,
        y_pos: 240,
        size: 1},
        {
        x_pos: 1500,
        y_pos: 110,
        size: 1.5},
        {
        x_pos: 2200,
        y_pos: 180,
        size: 1.3},
        {
        x_pos: 2800,
        y_pos: 240,
        size: 1},
        {
        x_pos: 2500,
        y_pos: 110,
        size: 1.5}
    ];
    
    mountains = [
        {
        x_pos: 350,
        y_pos: floorPos_y,
        size: 1.8},
        {
        x_pos: 950,
        y_pos: floorPos_y,
        size: 1.8},
        {
        x_pos: 2150,
        y_pos: floorPos_y,
        size: 1.4}
    ];
    
    canyons = [
        {
        x_pos: 180,
        width: 70},
        {
        x_pos: 850,
        width: 70},
        {
        x_pos: 1450,
        width: 70},
        {
        x_pos: 1950,
        width: 70}
    ];
    
    collectables = [
        {
        x_pos: 150,
        y_pos: 415,
        size: 0.8,
        isFound: false},
        {
        x_pos: 350,
        y_pos: 415,
        size: 0.8,
        isFound: false},
        {
        x_pos: 550,
        y_pos: 415,
        size: 0.8,
        isFound: false},
        {
        x_pos: 750,
        y_pos: 415,
        size: 0.8,
        isFound: false},
        {
        x_pos: 950,
        y_pos: 415,
        size: 0.8,
        isFound: false},
        {
        x_pos: 1150,
        y_pos: 415,
        size: 0.8,
        isFound: false},
        {
        x_pos: 1350,
        y_pos: 415,
        size: 0.8,
        isFound: false},
        {
        x_pos: 1550,
        y_pos: 415,
        size: 0.8,
        isFound: false},
        {
        x_pos: 1750,
        y_pos: 415,
        size: 0.8,
        isFound: false},
        {
        x_pos: 1950,
        y_pos: 415,
        size: 0.8,
        isFound: false}
    ];
}

function draw()
{
	background(98,199,209); // fill the sky blue

	noStroke();
	fill(62,80,104);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos, 0);

    drawClouds();

    drawMountains();

    drawTrees();
    
	// Draw canyons.
    for(var g = 0; g < canyons.length; g++)
    {
        drawCanyon(canyons[g]);
        checkCanyon(canyons[g]);
    };

	// Draw collectable items.
    for(var f = 0; f < collectables.length; f++)
    {
        if(collectables[f].isFound == false)
        {
            drawCollectable(collectables[f]);
            checkCollectable(collectables[f]);
        }
    };
    
    renderFlagpole();
    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }
    
    pop();
    
    noStroke;
    fill(255,255,240);
    text('Score: ' + gameScore, 10, height - 10);

	drawGameChar();

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 3;
		}
		else
		{
			scrollPos += 3;
		}
	}
	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 3;
		}
		else
		{
			scrollPos -= 3; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {
        isFalling = true;
        gameChar_y += 2;
    }
    else
    {
        isFalling = false;
    };
    
    if(isPlummeting)
    {
        gameChar_y += 5;
    }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}

function keyPressed()
{
    if(keyCode == 65)
    {
        isLeft = true;
    }
    
    if(keyCode == 68)
    {
        isRight = true;
    }
    
    if(keyCode == 32 && gameChar_y == floorPos_y)
    {
        gameChar_y -= 100;
    };
}

function keyReleased()
{
    if(keyCode == 65)
    {
        isLeft = false;
    }
    
    if(keyCode == 68)
    {
        isRight = false;
    }
}

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
        //body
        fill(255,255,240);
        ellipse(gameChar_x, gameChar_y - 42, 24, 37);
        //head
        fill(255,255,240);
        ellipse(gameChar_x, gameChar_y - 65, 18.5, 22.5);
        //eyes
        fill(147,112,219);
        ellipse(gameChar_x - 3.75, gameChar_y - 66.5, 3.75, 6.75);
        //feet
        fill(245,245,230);
        ellipse(gameChar_x - 6, gameChar_y - 30, 7.5, 18);
        ellipse(gameChar_x + 6, gameChar_y - 25, 7.5, 18);
	}
	else if(isRight && isFalling)
	{
        //body
        fill(255,255,240);
        ellipse(gameChar_x, gameChar_y - 42, 24, 37);
        //head
        fill(255,255,240);
        ellipse(gameChar_x, gameChar_y - 65, 18.5, 22.5);
        //eyes
        fill(147,112,219);
        ellipse(gameChar_x + 3.75, gameChar_y - 66.5, 3.75, 6.75);
        //feet
        fill(245,245,230);
        ellipse(gameChar_x - 6, gameChar_y - 25, 7.5, 18);
        ellipse(gameChar_x + 6, gameChar_y - 30, 7.5, 18);
	}
	else if(isLeft)
	{
        //body
        fill(255,255,240);
        ellipse(gameChar_x, gameChar_y - 28.5, 20, 48);
        //head
        fill(255,255,240);
        ellipse(gameChar_x, gameChar_y - 57, 18.5, 22.5);
        //eyes
        fill(147,112,219);
        ellipse(gameChar_x - 4.75, gameChar_y - 58.5, 3.75, 6.75);
        //feet
        fill(245,245,230);
        ellipse(gameChar_x - 5, gameChar_y - 12, 7.5, 18);
        ellipse(gameChar_x + 4, gameChar_y - 6, 7.5, 18);
	}
	else if(isRight)
	{
        //body
        fill(255,255,240);
        ellipse(gameChar_x, gameChar_y - 28.5, 20, 48);
        //head
        fill(255,255,240);
        ellipse(gameChar_x, gameChar_y - 57, 18.5, 22.5);
        //eyes
        fill(147,112,219);
        ellipse(gameChar_x + 4.75, gameChar_y - 58.5, 3.75, 6.75);
        //feet
        fill(245,245,230);
        ellipse(gameChar_x + 5, gameChar_y - 12, 7.5, 18);
        ellipse(gameChar_x - 4, gameChar_y - 6, 7.5, 18);
	}
	else if(isFalling || isPlummeting)
	{
        //body
        fill(255,255,240);
        ellipse(gameChar_x, gameChar_y - 42, 28, 37);
        //head
        fill(255,255,240);
        ellipse(gameChar_x, gameChar_y - 65, 22.5, 22.5);
        //eyes
        fill(147,112,219);
        ellipse(gameChar_x - 3.75, gameChar_y - 66.5, 3.75, 6.75);
        ellipse(gameChar_x + 3.75, gameChar_y - 66.5, 3.75, 6.75);
        //feet
        fill(245,245,230);
        ellipse(gameChar_x - 6, gameChar_y - 25, 7.5, 18);
        ellipse(gameChar_x + 6, gameChar_y - 25, 7.5, 18);
	}
	else
	{
        //body
        fill(255,255,240);
        ellipse(gameChar_x, gameChar_y - 28.5, 24, 48);
        //head
        fill(255,255,240);
        ellipse(gameChar_x, gameChar_y - 57, 22.5, 22.5);
        //eyes
        fill(147,112,219);
        ellipse(gameChar_x - 3.75, gameChar_y - 58.5, 3.75, 6.75);
        ellipse(gameChar_x + 3.75, gameChar_y - 58.5, 3.75, 6.75);
        //feet
        fill(245,245,230);
        ellipse(gameChar_x - 6, gameChar_y - 6, 7.5, 18);
        ellipse(gameChar_x + 6, gameChar_y - 6, 7.5, 18);
	}
}

// Function to draw cloud objects.
function drawClouds()
{
    for(var c = 0; c < clouds.length; c++)
    {
        noStroke();
        fill(255,220,220);
        ellipse(clouds[c].x_pos, clouds[c].y_pos, 25*clouds[c].size, 15*clouds[c].size);
        ellipse(clouds[c].x_pos, clouds[c].y_pos + 25*clouds[c].size, 40*clouds[c].size, 15*clouds[c].size);
        ellipse(clouds[c].x_pos + 30*clouds[c].size, clouds[c].y_pos + 10*clouds[c].size, 60*clouds[c].size, 45*clouds[c].size);
        ellipse(clouds[c].x_pos + 60*clouds[c].size, clouds[c].y_pos + 20*clouds[c].size, 60*clouds[c].size, 30*clouds[c].size);
        ellipse(clouds[c].x_pos + 90*clouds[c].size, clouds[c].y_pos + 25*clouds[c].size, 40*clouds[c].size, 15*clouds[c].size);
    };
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var m = 0; m < mountains.length; m++)
    {
        noStroke();
        fill(254,253,248);
        beginShape();
        vertex(mountains[m].x_pos,mountains[m].y_pos); 
        vertex(mountains[m].x_pos + 50*mountains[m].size,mountains[m].y_pos - 42*mountains[m].size); 
        vertex(mountains[m].x_pos + 63*mountains[m].size,mountains[m].y_pos - 56*mountains[m].size);
        vertex(mountains[m].x_pos + 82*mountains[m].size,mountains[m].y_pos - 63*mountains[m].size);
        vertex(mountains[m].x_pos + 100*mountains[m].size,mountains[m].y_pos - 79*mountains[m].size);
        vertex(mountains[m].x_pos + 110*mountains[m].size,mountains[m].y_pos - 84*mountains[m].size);
        vertex(mountains[m].x_pos + 118*mountains[m].size,mountains[m].y_pos - 96*mountains[m].size);
        vertex(mountains[m].x_pos + 136*mountains[m].size,mountains[m].y_pos - 99*mountains[m].size);
        vertex(mountains[m].x_pos + 139*mountains[m].size,mountains[m].y_pos - 105*mountains[m].size);
        vertex(mountains[m].x_pos + 145*mountains[m].size,mountains[m].y_pos - 105*mountains[m].size);
        vertex(mountains[m].x_pos + 149*mountains[m].size,mountains[m].y_pos - 99*mountains[m].size);
        vertex(mountains[m].x_pos + 154*mountains[m].size,mountains[m].y_pos - 89*mountains[m].size);
        vertex(mountains[m].x_pos + 175*mountains[m].size,mountains[m].y_pos - 72*mountains[m].size);
        vertex(mountains[m].x_pos + 187*mountains[m].size,mountains[m].y_pos - 61*mountains[m].size);
        vertex(mountains[m].x_pos + 190*mountains[m].size,mountains[m].y_pos - 50*mountains[m].size);
        vertex(mountains[m].x_pos + 205*mountains[m].size,mountains[m].y_pos - 37*mountains[m].size); 
        vertex(mountains[m].x_pos + 221*mountains[m].size,mountains[m].y_pos - 17*mountains[m].size); 
        vertex(mountains[m].x_pos + 250*mountains[m].size,mountains[m].y_pos); 
        endShape();
        fill(150,160,180);
        beginShape();
        vertex(mountains[m].x_pos,mountains[m].y_pos); 
        vertex(mountains[m].x_pos + 50*mountains[m].size,mountains[m].y_pos - 42*mountains[m].size); 
        vertex(mountains[m].x_pos + 63*mountains[m].size,mountains[m].y_pos - 56*mountains[m].size);
        vertex(mountains[m].x_pos + 82*mountains[m].size,mountains[m].y_pos - 63*mountains[m].size);
        vertex(mountains[m].x_pos + 100*mountains[m].size,mountains[m].y_pos - 79*mountains[m].size);
        vertex(mountains[m].x_pos + 110*mountains[m].size,mountains[m].y_pos - 84*mountains[m].size);
        vertex(mountains[m].x_pos + 140*mountains[m].size,mountains[m].y_pos - 82*mountains[m].size);
        vertex(mountains[m].x_pos + 155*mountains[m].size,mountains[m].y_pos - 63*mountains[m].size);
        vertex(mountains[m].x_pos + 153*mountains[m].size,mountains[m].y_pos - 82*mountains[m].size);
        vertex(mountains[m].x_pos + 175*mountains[m].size,mountains[m].y_pos - 72*mountains[m].size);
        vertex(mountains[m].x_pos + 187*mountains[m].size,mountains[m].y_pos - 61*mountains[m].size);
        vertex(mountains[m].x_pos + 190*mountains[m].size,mountains[m].y_pos - 50*mountains[m].size);
        vertex(mountains[m].x_pos + 205*mountains[m].size,mountains[m].y_pos - 37*mountains[m].size); 
        vertex(mountains[m].x_pos + 221*mountains[m].size,mountains[m].y_pos - 17*mountains[m].size); 
        vertex(mountains[m].x_pos + 250*mountains[m].size,mountains[m].y_pos); 
        endShape();
        fill(62,80,104);
        beginShape();
        vertex(mountains[m].x_pos,mountains[m].y_pos); 
        vertex(mountains[m].x_pos + 50*mountains[m].size,mountains[m].y_pos - 42*mountains[m].size); 
        vertex(mountains[m].x_pos + 70*mountains[m].size,mountains[m].y_pos - 37*mountains[m].size);
        vertex(mountains[m].x_pos + 60*mountains[m].size,mountains[m].y_pos - 22*mountains[m].size);
        vertex(mountains[m].x_pos + 85*mountains[m].size,mountains[m].y_pos - 36*mountains[m].size);
        vertex(mountains[m].x_pos + 112*mountains[m].size,mountains[m].y_pos - 32*mountains[m].size);
        vertex(mountains[m].x_pos + 136*mountains[m].size,mountains[m].y_pos - 34*mountains[m].size);
        vertex(mountains[m].x_pos + 163*mountains[m].size,mountains[m].y_pos - 27*mountains[m].size);
        vertex(mountains[m].x_pos + 205*mountains[m].size,mountains[m].y_pos - 37*mountains[m].size); 
        vertex(mountains[m].x_pos + 221*mountains[m].size,mountains[m].y_pos - 17*mountains[m].size); 
        vertex(mountains[m].x_pos + 250*mountains[m].size,mountains[m].y_pos); 
        endShape();
    };
}
// Function to draw trees objects.
function drawTrees()
{
    for(var t = 0; t < trees_x.length; t++)
    {
        noStroke();
        fill(127,78,55);
        beginShape();
        vertex(trees_x[t], trees_y);
        vertex(trees_x[t] - 4, trees_y + 11);
        vertex(trees_x[t] + 21, trees_y + 9);
        vertex(trees_x[t] + 46, trees_y + 25);
        vertex(trees_x[t] + 40, trees_y + 51);
        vertex(trees_x[t] + 37, trees_y + 31);
        vertex(trees_x[t] + 19, trees_y + 22);
        vertex(trees_x[t] - 13, trees_y + 29);
        vertex(trees_x[t] - 16, trees_y + 34);
        vertex(trees_x[t] - 26, trees_y + 54);
        vertex(trees_x[t] - 6, trees_y + 54);
        vertex(trees_x[t] + 3, trees_y + 57);
        vertex(trees_x[t] + 5, trees_y + 59);
        vertex(trees_x[t] + 4, trees_y + 74);
        vertex(trees_x[t] - 6, trees_y + 79);
        vertex(trees_x[t], trees_y + 74);
        vertex(trees_x[t] - 1, trees_y + 64);
        vertex(trees_x[t] - 21, trees_y + 64);
        vertex(trees_x[t] - 31, trees_y + 69);
        vertex(trees_x[t] - 36, trees_y + 79);
        vertex(trees_x[t] - 31, trees_y + 129);
        vertex(trees_x[t] - 11, trees_y + 144);
        vertex(trees_x[t] - 4, trees_y + 157);
        vertex(trees_x[t] - 18, trees_y + 151);
        vertex(trees_x[t] - 34, trees_y + 150);
        vertex(trees_x[t] - 46, trees_y + 141);
        vertex(trees_x[t] - 56, trees_y + 146);
        vertex(trees_x[t] - 66, trees_y + 144);
        vertex(trees_x[t] - 106, trees_y + 149);
        vertex(trees_x[t] - 61, trees_y + 129);
        vertex(trees_x[t] - 56, trees_y + 69);
        vertex(trees_x[t] - 58, trees_y + 59);
        vertex(trees_x[t] - 61, trees_y + 54);
        vertex(trees_x[t] - 66, trees_y + 57);
        vertex(trees_x[t] - 65, trees_y + 60);
        vertex(trees_x[t] - 61, trees_y + 58);
        vertex(trees_x[t] - 65, trees_y + 63);
        vertex(trees_x[t] - 68, trees_y + 59);
        vertex(trees_x[t] - 66, trees_y + 54);
        vertex(trees_x[t] - 61, trees_y + 51);
        vertex(trees_x[t] - 56, trees_y + 54);
        vertex(trees_x[t] - 53, trees_y + 59);
        vertex(trees_x[t] - 44, trees_y + 44);
        vertex(trees_x[t] - 43, trees_y + 19);
        vertex(trees_x[t] - 48, trees_y - 1);
        vertex(trees_x[t] - 66, trees_y);
        vertex(trees_x[t] - 76, trees_y + 4);
        vertex(trees_x[t] - 78, trees_y + 19);
        vertex(trees_x[t] - 65, trees_y + 21);
        vertex(trees_x[t] - 66, trees_y + 14);
        vertex(trees_x[t] - 61, trees_y + 24);
        vertex(trees_x[t] - 64, trees_y + 26);
        vertex(trees_x[t] - 81, trees_y + 26);
        vertex(trees_x[t] - 86, trees_y + 24);
        vertex(trees_x[t] - 91, trees_y - 1);
        vertex(trees_x[t] - 81, trees_y - 11);
        vertex(trees_x[t] - 49, trees_y - 21);
        vertex(trees_x[t] - 46, trees_y - 41);
        vertex(trees_x[t] - 51, trees_y - 46);
        vertex(trees_x[t] - 56, trees_y - 46);
        vertex(trees_x[t] - 59, trees_y - 41);
        vertex(trees_x[t] - 51, trees_y - 39);
        vertex(trees_x[t] - 61, trees_y - 37);
        vertex(trees_x[t] - 64, trees_y - 41);
        vertex(trees_x[t] - 61, trees_y - 49);
        vertex(trees_x[t] - 59, trees_y - 50);
        vertex(trees_x[t] - 51, trees_y - 51);
        vertex(trees_x[t] - 48, trees_y - 50);
        vertex(trees_x[t] - 41, trees_y - 43);
        vertex(trees_x[t] - 43, trees_y - 22);
        vertex(trees_x[t] - 36, trees_y - 19);
        vertex(trees_x[t] - 31, trees_y + 9);
        vertex(trees_x[t] - 11, trees_y - 21);
        vertex(trees_x[t] - 6, trees_y - 61);
        vertex(trees_x[t] - 16, trees_y - 76);
        vertex(trees_x[t] - 4, trees_y - 69);
        vertex(trees_x[t] - 1, trees_y - 91);
        vertex(trees_x[t] - 21, trees_y - 106);
        vertex(trees_x[t] - 36, trees_y - 96);
        vertex(trees_x[t] - 33, trees_y - 73);
        vertex(trees_x[t] - 44, trees_y - 98);
        vertex(trees_x[t] - 21, trees_y - 116);
        vertex(trees_x[t] - 1, trees_y - 101);
        vertex(trees_x[t] + 9, trees_y - 111);
        vertex(trees_x[t] + 4, trees_y - 99);
        vertex(trees_x[t] + 6, trees_y - 94);
        vertex(trees_x[t] + 5, trees_y - 76);
        vertex(trees_x[t] + 3, trees_y - 56);
        vertex(trees_x[t] + 29, trees_y - 83);
        vertex(trees_x[t] + 49, trees_y - 85);
        vertex(trees_x[t] + 62, trees_y - 71);
        vertex(trees_x[t] + 46, trees_y - 79);
        vertex(trees_x[t] + 34, trees_y - 78);
        vertex(trees_x[t] + 17, trees_y - 60);
        vertex(trees_x[t] + 3, trees_y - 44);
        vertex(trees_x[t] + 3, trees_y - 27);
        vertex(trees_x[t] + 1, trees_y - 14);
        vertex(trees_x[t] + 42, trees_y - 28);
        vertex(trees_x[t] + 35, trees_y - 45);
        vertex(trees_x[t] + 52, trees_y - 27);
        vertex(trees_x[t] + 49, trees_y - 19);
        endShape();
        fill(255,167,166,200);
        ellipse(trees_x[t] + 20,trees_y - 56,50,50);
        ellipse(trees_x[t] - 86,trees_y + 10,50,50);
        ellipse(trees_x[t] + 50,trees_y - 24,50,50);
        ellipse(trees_x[t] - 49,trees_y + 19,50,50);
        ellipse(trees_x[t] + 31,trees_y - 47,50,50);
        ellipse(trees_x[t] - 13,trees_y - 88,50,50);
        ellipse(trees_x[t] + 34,trees_y - 68,50,50);
        fill(241,84,119, 200);
        ellipse(trees_x[t] - 71,trees_y - 30,50,50);
        ellipse(trees_x[t] - 94,trees_y - 6,50,50);
        ellipse(trees_x[t] - 25,trees_y - 96,50,50);
        ellipse(trees_x[t] - 20,trees_y + 26,50,50);
        ellipse(trees_x[t] + 50,trees_y + 20,50,50);
        ellipse(trees_x[t] - 10,trees_y - 50,50,50);
        fill(255,167,166,200);
        ellipse(trees_x[t] - 4,trees_y - 84,50,50);
        ellipse(trees_x[t] - 79,trees_y + 20,50,50);
        ellipse(trees_x[t] - 29,trees_y - 5,50,50);
        ellipse(trees_x[t] - 44,trees_y - 81,50,50);
        ellipse(trees_x[t] + 35,trees_y - 16,50,50);
        ellipse(trees_x[t] - 40,trees_y + 28,50,50);
        ellipse(trees_x[t] - 26,trees_y + 43,50,50);
        ellipse(trees_x[t] + 30,trees_y + 25,50,50);
    };
}

// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
        noStroke();
        fill(98,199,209);
        beginShape();
        vertex(t_canyon.x_pos,floorPos_y);
        vertex(t_canyon.x_pos + t_canyon.width,floorPos_y);
        vertex(t_canyon.x_pos + t_canyon.width + 15,floorPos_y + 29);
        vertex(t_canyon.x_pos + t_canyon.width + 10,floorPos_y + 60);
        vertex(t_canyon.x_pos + t_canyon.width + 15,floorPos_y + 86);
        vertex(t_canyon.x_pos + t_canyon.width + 8,floorPos_y + 110);
        vertex(t_canyon.x_pos + t_canyon.width + 10,floorPos_y + 128);
        vertex(t_canyon.x_pos + t_canyon.width + 5,floorPos_y + 144);
        vertex(t_canyon.x_pos - 10,floorPos_y + 144);
        vertex(t_canyon.x_pos - 20,floorPos_y + 108);
        vertex(t_canyon.x_pos - 15,floorPos_y + 68);
        vertex(t_canyon.x_pos - 20,floorPos_y + 43);
        endShape();
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
    if((gameChar_world_x > t_canyon.x_pos && (gameChar_world_x < t_canyon.x_pos + t_canyon.width)) && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
    }
}

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
    noStroke();
    fill(255,167,166);
    ellipse(t_collectable.x_pos, t_collectable.y_pos - 9*t_collectable.size,12*t_collectable.size,12*t_collectable.size);
    ellipse(t_collectable.x_pos - 8*t_collectable.size, t_collectable.y_pos - 3*t_collectable.size,12*t_collectable.size,12*t_collectable.size);
    ellipse(t_collectable.x_pos + 8*t_collectable.size, t_collectable.y_pos - 3*t_collectable.size,12*t_collectable.size,12*t_collectable.size);
    ellipse(t_collectable.x_pos - 5*t_collectable.size, t_collectable.y_pos + 6*t_collectable.size,12*t_collectable.size,12*t_collectable.size);
    ellipse(t_collectable.x_pos + 5*t_collectable.size, t_collectable.y_pos + 6*t_collectable.size,12*t_collectable.size,12*t_collectable.size);
    fill(241,84,119);
    ellipse(t_collectable.x_pos, t_collectable.y_pos,12*t_collectable.size,12*t_collectable.size);
    fill(251,238,72);
    ellipse(t_collectable.x_pos, t_collectable.y_pos - 3*t_collectable.size,2*t_collectable.size,2*t_collectable.size);
    ellipse(t_collectable.x_pos - 2*t_collectable.size, t_collectable.y_pos,2*t_collectable.size,2*t_collectable.size);
    ellipse(t_collectable.x_pos + 2*t_collectable.size, t_collectable.y_pos + 1*t_collectable.size,2*t_collectable.size,2*t_collectable.size);
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 20)
    {
        t_collectable.isFound = true;
        gameScore += 1;
    };
}

function renderFlagpole()
{
    strokeWeight(3);
    stroke(130,140,160);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
    noStroke();
    fill(255,167,166);
    if(flagpole.isReached == true)
    {
        rect(flagpole.x_pos, floorPos_y - 200, 50, 30);
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y - 30, 50, 30);
    }
}

function checkFlagpole()
{
    if(dist(gameChar_world_x, gameChar_y, flagpole.x_pos, floorPos_y) < 20)
    {
        flagpole.isReached = true;
    }
}
