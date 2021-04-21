var PLAY = 1;
var END = 0;
var gameState = PLAY;

var doaremon, doaremon_running, doaremon_collided,
    doaremonflying;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4,point1,point2,point3;

var score;
var points;
var sun,background1;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  
  doaremonflying=loadAnimation("20210421_140654.png")
  doaremon_running = loadAnimation("doaremon1.png","doaremon2.png",
"doaremon3.png","doaremon4.png","doaremon5.png",
"doaremon6.png","doaremon7.png","doaremon8.png",
"doaremon9.png","doaremon10.png","doaremon11.png");
  doaremon_collided = loadAnimation("doaremonout.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png.png");
  
  
  
  obstacle1 = loadImage("mouse1.png");
  obstacle2 = loadImage("mouse2.png");
  obstacle3 = loadImage("gyan1.png");
  obstacle4 = loadImage("Polish_20210421_135328526.png");
  
  
  point1 = loadImage("Bambucopter.png");
  point2 = loadImage("biglight.png");
  point3 = loadImage("small light.png");
  point4 = loadImage("smalltunnal.png");
  
  
   restartImg = loadImage("restart5.png.png")
  gameOverImg = loadImage("gameover.png.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  
  sunImage=loadImage("sun.png");
  backgroundImage=loadImage("background.jpg");
}

function setup() {
  createCanvas(600, 400);
  
  background=createSprite(310,200,20,20);
  background.addImage(backgroundImage);
  background.scale=1.5
  
  var message = "This is a message";
 console.log(message)
  
  sun=createSprite(520,100,20,20);
  sun.addImage(sunImage);
  sun.scale=0.1
  
  doaremon = createSprite(50,300,20,50);
  doaremon.addAnimation("running", doaremon_running);
  doaremon.addAnimation("collided" ,doaremon_collided);
  doaremon.scale = 0.12;
  
  ground = createSprite(200,390,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  doaremon2=createSprite(520,100,20,20);
  doaremon2.addAnimation(doaremonflying);
  doaremon2.scale=0.1
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,150);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.3;
  restart.scale = 0.05;
  
  invisibleGround = createSprite(200,380,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  pointsGroup = createGroup();
  
  console.log("Hello" + 5);
  
doaremon.setCollider("rectangle",0,0,doaremon.width,doaremon.height);
  doaremon.debug = true
  
  score = 0;
  points = 0;
  
  
  
}

function draw() {
  
  //background(180);
  
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(4 + 3* score/100)
    
    //scoring
     score = score + Math.round(getFrameRate()/60);
    
    if (doaremon.isTouching(pointsGroup)){
      pointsGroup.destroyEach();
      points=points+2;
    }
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& doaremon.y >= 100) { 
        doaremon.velocityY = -12;
      jumpSound.play();
    }
    
    //add gravity
    doaremon.velocityY = doaremon.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
     //spawn the points
    spawnpoints();
    if(obstaclesGroup.isTouching(doaremon)){
        jumpSound.play();
        gameState = END;
        dieSound.play()
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      doaremon.velocityY = 0
     
      //change the trex animation
doaremon.changeAnimation("collided",doaremon_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    pointsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     pointsGroup.setVelocityXEach(0);
     
     if(mousePressedOver(restart)) {
      reset();
    }
   }
  
 
  //stop trex from falling down
  doaremon.collide(invisibleGround);
  
  
  
  
  drawSprites();
  
  //displaying score
  fill("black")
  text("Score: "+ score, 500,50);
  //displaying points
  fill("black")
  text("points: "+ points, 400,50);
  
}

function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  //doaremon.changeAnimation("running","doaremon_running);
  doaremon.changeAnimation("running", doaremon_running);
  score=0;
  points=0;

}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,355,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,190));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = doaremon.depth;
    doaremon.depth = doaremon.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
function spawnpoints(){
 if (frameCount % 60 === 0){
   var point = createSprite(300,245,10,40);
   point.velocityX = -(8 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: point.addImage(point1);
              break;
      case 2: point.addImage(point2);
              break;
      case 3: point.addImage(point3);
              break;
      case 4: point.addImage(point4);
              break;
     
      
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    point.scale = 0.1;
    point.lifetime = 300;
   
   //add each obstacle to the group
    pointsGroup.add(point);
 }
}
