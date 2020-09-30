var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, laserGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, shield;
var laserImage, obsLaserImage;

var score=0;

var gameOver, restart;


function preload(){
  trex_running =   loadImage("Images/sprite_0.png");
  //trex_collided = loadAnimation("trex_collided.png");
  
  bgImage = loadImage("Images/space-2.jpg");

  shieldImg = loadImage("Images/shield2.png")
  
  cloudImage = loadImage("Images/powerupBlue_bolt.png");
  
  obstacle1 = loadImage("Images/spaceShips_001.png");
  obstacle2 = loadImage("Images/spaceShips_002.png");
  obstacle3 = loadImage("Images/spaceShips_003.png");
  obstacle4 = loadImage("Images/spaceShips_004.png");
  obstacle5 = loadImage("Images/spaceShips_005.png");
  obstacle6 = loadImage("Images/spaceMeteors_002.png");

  obsLaserImage = loadImage("Images/laserRed07.png");
  laserImage = loadImage("Images/laserBlue16.png");
  
  gameOverImg = loadImage("Images/Game Over.jpg");
  restartImg = loadImage("Images/restart3.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3"); 
}

function setup() {
  createCanvas(displayWidth - 100, displayHeight - 150);
  
  trex = createSprite(50,400,20,50);
  trex.addImage(trex_running);
  trex.scale = 0.8;
  
  //bgImage = createSprite(200,180,400,20);
  //ground.addImage("ground",groundImage);
  //ground.x = ground.width /2;
  //ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(displayWidth/2 - 50, displayHeight/4);
  gameOver.addImage(gameOverImg);

  shield = createSprite(trex.x , trex.y);
  shield.addImage(shieldImg);
  shield.visible = false;
  
  restart = createSprite(displayWidth/2 - 50, displayHeight/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.4;
  restart.scale = 1;

  gameOver.visible = false;
  restart.visible = false;
  
  // invisibleGround = createSprite(200,190,400,10);
  // invisibleGround.visible = false;*/
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  laserGroup = new Group(); 
  
  score = 0;
}

function draw() {
  background(bgImage);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY || gameState === "shielded"){
    score = score + Math.round(getFrameRate()/60);
    
    shield.x = trex.x;
    shield.y = trex.y;
  
    if(keyWentDown("space")) {
      //Release bullets
      shoot();
    }
  
    // if (ground.x < 0){
    //   ground.x = ground.width/2;
    // }
  
    spawnClouds();
    if(keyDown(UP_ARROW)){
      trex.y = trex.y - 10;
    }

    if(keyDown(DOWN_ARROW)){
      trex.y = trex.y + 10;
    }
    spawnObstacles();
    
    if (score>0 && score%100 === 0){
      checkPointSound.play();
    }
  
    if(obstaclesGroup.isTouching(trex)){
      dieSound.play();  
      gameState = END;
        
    }
    if(cloudsGroup.isTouching(trex)){
      gameState = "shielded"
      shield.visible = true;
 
    }
    if(gameState === "shielded"){
      var maxEnemy = obstaclesGroup.maxDepth();
      for (var i = 0; i <= maxEnemy; i++){
        var temp_enemy = obstaclesGroup.get(i);
        if(temp_enemy!=null && shield.isTouching(temp_enemy)){
          temp_enemy.destroy();
          //laserGroup.destroyEach();
          //score = score + 10;
        }
      }
    }
    if(frameCount%150 === 0){
      shield.visible = false;
      gameState = PLAY;
    }
    // if(laserGroup.isTouching(obstaclesGroup)){
    //   obstaclesGroup.destroyEach();
    //   laserGroup.destroyEach();
    // }
    var maxEnemy = obstaclesGroup.maxDepth();
    for (var i = 0; i <= maxEnemy; i++){
      var temp_enemy = obstaclesGroup.get(i);
      if(temp_enemy!=null && laserGroup.isTouching(temp_enemy)){
        temp_enemy.destroy();
        laserGroup.destroyEach();
        //score = score + 10;
      }
    }//for close

  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    //ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    //trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    //cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  
  if (frameCount % 300 === 0) {
    var cloud = createSprite(displayWidth - 100,100,10,40);
    cloud.y = Math.round(random(50,displayHeight - 50));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -6;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 50 === 0) {
    var obstacle = createSprite(displayWidth - 100,100,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.y =  Math.round(random(80,displayHeight - 200));

    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;        

      default: break;

    }
    var bullet = createSprite(obstacle.x, obstacle.y, 10,10);
    bullet.addImage(obsLaserImage);
    bullet.velocityX = -(6 + 5*score/100);
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    obstaclesGroup.add(bullet);
  }
}

function reset(){
  gameState = PLAY;
  //ground.velocityX = -(6 + 3*score/100);
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  //cloudsGroup.destroyEach();
  
  //trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}

function shoot(){
  var laser = createSprite(20,20,20,20);
  laser.x = trex.x + 10;
  laser.y = trex.y;
  laser.addImage(laserImage);
  laser.velocityX = 10;
  laserGroup.add(laser);
}