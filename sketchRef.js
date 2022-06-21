var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_correndo, trex_colidiu;
var solo, soloInvisivel, imagemSolo;

var grupoNuvens, imagemNuvem;
var grupoCactos, cacto1, cacto2, cacto3, cacto4, cacto5, cacto6;

var pontos;

var imgGameOver, imgRestart
var somSalto , somPontos, somColisao

function preload(){
  trex_correndo = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_colidiu = loadImage("trex_collided.png");
  
  imagemSolo = loadImage("ground2.png");
  
  imagemNuvem = loadImage("cloud.png");
  
  cacto1 = loadImage("obstacle1.png");
  cacto2 = loadImage("obstacle2.png");
  cacto3 = loadImage("obstacle3.png");
  cacto4 = loadImage("obstacle4.png");
  cacto5 = loadImage("obstacle5.png");
  cacto6 = loadImage("obstacle6.png");
  
  imgRestart = loadImage("restart.png")
  imgGameOver = loadImage("gameOver.png")
  
  somSalto = loadSound("jump.mp3")
  somColisao = loadSound("die.mp3")
  somPontos = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.scale = 0.5;
  
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemSolo);
  solo.x = solo.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(imgGameOver);
  
  restart = createSprite(300,140);
  restart.addImage(imgRestart);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  soloInvisivel = createSprite(200,190,400,10);
  soloInvisivel.visible = false;
  
  //criar grupos de obstáculos e nuvens
  grupoCactos = createGroup();
  grupoNuvens = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("rectangle",0,0,400,trex.height);
  trex.debug = true
  
  pontos = 0;
  
}

function draw() {
  
  background(180);
  //exibir pontuação
  text("Pontuaçao: "+ pontos, 500,50);
  
  console.log("isto é ",gameState)
  
  
  if(gameState === PLAY){
    //mover o solo
    gameOver.visible = false;
    restart.visible = false;
    
    solo.velocityX = -(4 + 3* pontos/100)
    //pontuação
    pontos = pontos + Math.round(frameRate()/60);
    
    if(pontos > 0 && pontos % 100 === 0){
       somPontos.play() 
    }
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //pular quando a tecla de espaço for pressionada
    if(keyDown("space") && trex.y >= 100) {
        trex.velocityY = -12;
        somSalto.play();
    }
    
    //adicione gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no solo
    spawnObstacles();
    
    if(grupoCactos.isTouching(trex)){
        trex.velocityY = -12;
        somSalto.play();
        // gameState = END;
        // dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      solo.velocityX = 0;
      trex.velocityY = 0
      //mudar a animação do trex
      trex.changeAnimation("collided", trex_colidiu);
     
      //definir a vida útil dos objetos do jogo para que nunca sejam destruídos
    grupoCactos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);
     
     grupoCactos.setVelocityXEach(0);
     grupoNuvens.setVelocityXEach(0);
   }
  
 
  //impedir que o trex caia
  trex.collide(soloInvisivel);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var cacto = createSprite(400,165,10,40);
   cacto.velocityX = -(6 + pontos/100);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: cacto.addImage(cacto1);
              break;
      case 2: cacto.addImage(cacto2);
              break;
      case 3: cacto.addImage(cacto3);
              break;
      case 4: cacto.addImage(cacto4);
              break;
      case 5: cacto.addImage(cacto5);
              break;
      case 6: cacto.addImage(cacto6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo              
    cacto.scale = 0.5;
    cacto.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    grupoCactos.add(cacto);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    var nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemNuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de vida à variável
    nuvem.lifetime = 200;
    
    //ajustar a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
    grupoNuvens.add(nuvem);
    }
}

