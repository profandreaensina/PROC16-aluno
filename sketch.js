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
  
  //01. carregar sons do salto, da colisao e dos pontos
  
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
  
  grupoCactos = createGroup();
  grupoNuvens = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("rectangle",0,0,100,trex.height);
  trex.debug = false;
  
  pontos = 0;
  
}

function draw() {
  
  background(180);

  text("Pontuaçao: "+ pontos, 500,50);
  
  if(gameState === PLAY){
    
    gameOver.visible = false;
    restart.visible = false;
    
    solo.velocityX = -(4 + 3* pontos/100)

    pontos = pontos + Math.round(frameRate()/60);
    
    if(pontos > 0 && pontos % 100 === 0){
       //02. play no som dos pontos
      
    }
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
  
    if(keyDown("space") && trex.y >= 140) {
        trex.velocityY = -12;
        //03. play no som do salto
    }
    
    trex.velocityY = trex.velocityY + 0.8;
    
    gerarNuvens();
    gerarCactos();
    
    if(grupoCactos.isTouching(trex)){
        gameState = 0;
        //04. play no som da colisao
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      solo.velocityX = 0;
      trex.velocityY = 0;
  
      trex.changeAnimation("collided", trex_colidiu);
     
      grupoCactos.setLifetimeEach(-1);
      grupoNuvens.setLifetimeEach(-1);
     
      grupoCactos.setVelocityXEach(0);
      grupoNuvens.setVelocityXEach(0);
   }
  
  trex.collide(soloInvisivel);
  
  drawSprites();
}

function gerarCactos(){
 if (frameCount % 60 === 0){
   var cacto = createSprite(610,165,10,40);
   cacto.velocityX = -(6 + pontos/100);

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
           
    cacto.scale = 0.5;
    cacto.lifetime = 300;

    grupoCactos.add(cacto);
 }
}

function gerarNuvens() {

  if (frameCount % 60 === 0) {
    var nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemNuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
 
    nuvem.lifetime = 300;

    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    grupoNuvens.add(nuvem);
    }
}
