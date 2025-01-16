

import Phaser from 'phaser';

import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH * 0.1, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}

const Scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y : 200 }
    }
  },
  scene: {
    preload :preload,
    create: create,
    update :update
  }
};


new Phaser.Game(config);
function preload()
{
this.load.image('sky', 'assets/sky.png');
this.load.image('bird','assets/bird.png');
this.load.image('pipe','assets/pipe.png');
}
let bird ;
let pipeHorizontalDistanceRange= [500,550];
let pipeVerticalDistanceRange = [150,250];
let pipeHorizontalDistance = 0;
let pipeVerticalDistance = 0;
let pipes = null;
let pipeVerticalPositionRange = [20,config.height - 20 - pipeVerticalDistance];
let lastPipeSpawnTime =0;
function create(){
this.add.image(400,300,'sky');
bird = this.physics.add.sprite(100,200,'bird');
pipes = this.physics.add.group();
}
function placePipe(uPipe,lPipe){
  const rightMostX = getRightMostPipe();
  const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  const pipeVerticalPosition = Phaser.Math.Between(20,config.height - 20 - pipeVerticalDistance);
  const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);
 uPipe.x =rightMostX + pipeHorizontalDistance;
lPipe.x = uPipe.x
uPipe.y = pipeVerticalPosition;
lPipe.y = uPipe.y + pipeVerticalDistance;
lPipe.body.velocity.x = -200;
uPipe.body.velocity.x = -200;
lPipe.body.allowGravity = false;
uPipe.body.allowGravity = false;

}
function getRightMostPipe(){
  let rightMostX = 0;
  pipes.getChildren().forEach(function(pipe){
    rightMostX = Math.max(pipe.x,rightMostX);
  })
  return rightMostX;
}
function restartBirdPosition() {
  bird.x = 100;
  bird.y = 200;
  bird.body.velocity.y = 0
}
function recyclePipes(){
  const tempPipes = [];
  pipes.getChildren().forEach(Pipe => {
    if(pipe.getBounds().right <=0) {
      tempPipes.push(pipe);
      if(tempPipes.length === 2){
        placePipes(...temppPipes);
      }
    }
  })
}
function update(time,delta){
this.cursors = this.input.keyboard.createCursorKeys();
const { space, up }  = this.cursors;
if(space.isDown || up.isDown){
  bird.setVelocityY(-100);
}
if(bird.y> config.height || bird.y < 0){
  restartBirdPosition();
}


if (time - lastPipeSpawnTime > 2000){
  const upperPipe = this.physics.add.sprite(0,0,'pipe').setOrigin(0,1)
  const lowerPipe = this.physics.add.sprite(0,0,'pipe').setOrigin(0,0)
  pipes.add(upperPipe);
  pipes.add(lowerPipe);
  placePipe(upperPipe,lowerPipe);
 lastPipeSpawnTime = time;
}
}
