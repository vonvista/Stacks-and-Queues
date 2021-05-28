const boxSize = 40
const easing = 0.05
const controlsHeight = document.getElementById("controlPanel").offsetHeight 
const stackOffsetX = 30; stackOffsetY = 60;
const queueOffsetX = 30; queueOffsetY = 180;

let pushButton = document.getElementById("pushButton");
let popButton = document.getElementById("popButton");

let queueButton = document.getElementById("queueButton");
let dequeueButton = document.getElementById("dequeueButton");

class Block {
  constructor(value, x, y) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.boxSize = 0;
    this.toggleMove = false;
    this.toggleSpawnAnim = true;
  }
  
  draw() {
    if(this.toggleSpawnAnim == true){
      spawnBox(this, boxSize);
      this.toggleSpawnAnim = false
    }
    stroke(28, 42, 53)
    fill(41, 89, 126)
    rect(this.x + boxSize/2, this.y + boxSize/2, this.boxSize, this.boxSize)

    noStroke()
    fill(255)
    text(this.value, this.x + boxSize/2, this.y + boxSize/2)
  }
}

class Queue {
  constructor() {
    this.items = [];
  }

  async queue(element) {
    queueButton.disabled = true;
    dequeueButton.disabled = true;
    let newItem = new Block(element, queueOffsetX + (boxSize * this.items.length), queueOffsetY)
    
    this.items.push(newItem);
    queueButton.disabled = false;
    dequeueButton.disabled = false;
  }

  dequeue() {
    return this.items.shift();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }

  toArray() {
    return this.items;
  }

  toString() {
    return this.items.toString();
  }
  
  draw() {
    for(let item of this.items){
      item.draw()
    }
  }
}

class Stack {
  constructor() {
    this.items = [];
  }

  async push(element) {
    popButton.disabled = true;
    pushButton.disabled = true;
    let newItem = new Block(element, stackOffsetX, stackOffsetY)
    console.log(boxSize * this.items.length)
    let TOS = this.items[this.items.length - 1]
    for(let item of this.items){
      if(item != TOS){
        easeMove(item, item.x, item.y, item.x + boxSize, item.y)
      }
      else{
        console.log("LAST")
        await easeMove(item, item.x, item.y, item.x + boxSize, item.y)
      }
      await sleep(50)
    }
    this.items.push(newItem);
    popButton.disabled = false;
    pushButton.disabled = false;
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }

  toArray() {
    return this.items;
  }

  toString() {
    return this.items.toString();
  }
  
  draw() {
    for(let item of this.items){
      item.draw()
    }
  }
}

stack = new Stack()
queue = new Queue()

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
  }

async function easeMove(item, oldX, oldY, newX, newY){
  for(let i = 0; i <= 100; i++){
    item.x = item.x + (newX - item.x) * easing
    item.y = item.y + (newY - item.y) * easing
    await sleep(2)
  }
}

async function spawnBox(item, target){
  console.log(item.boxSize)
  for(let i = 0; i <= 100; i++){
    //item.boxSize = item.boxSize + (30 - item.boxSize) * easing
    item.boxSize = lerp(item.boxSize, target, 0.05);
    await sleep(4)
  }
}

function handlePush() { 
  //stringValue = this.value()
  //document.getElementById("myText").value = "Johnny Bravo";
  let element = document.getElementById("pushElement").value
  stack.push(element)
}

async function handlePop() { 
  spawnBox(stack.peek(), 0);
  await sleep(50)
  stack.pop()
  popButton.disabled = true;
  pushButton.disabled = true;
  let TOS = stack.items[stack.items.length - 1]
  for(let item of stack.items){
    if(item != TOS){
      easeMove(item, item.x, item.y, item.x - boxSize, item.y)
    }
    else{
      console.log("LAST")
      await easeMove(item, item.x, item.y, item.x - boxSize, item.y)
    }
    await sleep(50)
  }
  popButton.disabled = false;
  pushButton.disabled = false;
}

function handleQueue() { 
  //stringValue = this.value()
  //document.getElementById("myText").value = "Johnny Bravo";
  let element = document.getElementById("queueElement").value
  queue.queue(element)
}

async function handleDequeue() { 
  spawnBox(queue.items[0], 0);
  await sleep(50)
  queue.dequeue()
  queueButton.disabled = true;
  dequeueButton.disabled = true;
  let EOQ = queue.items[queue.items.length - 1]
  for(let item of queue.items){
    if(item != EOQ){
      easeMove(item, item.x, item.y, item.x - boxSize, item.y)
    }
    else{
      console.log("LAST")
      await easeMove(item, item.x, item.y, item.x - boxSize, item.y)
    }
    await sleep(50)
  }
  queueButton.disabled = false;
  dequeueButton.disabled = false;
}

function setup() {
  //createCanvas(400, 400);
  let cnv = createCanvas(windowWidth, windowHeight - controlsHeight);
  cnv.parent("sketchHolder");
  console.log(cnv)

  stack.push("Z")
  queue.queue("Z")
  rectMode(CENTER)
  textAlign(CENTER, CENTER)
}

function draw() {
  background(28, 42, 53);
  textAlign(LEFT, LEFT)
  textStyle(BOLD);
  textSize(18);
  text("Stack", stackOffsetX + 2, stackOffsetY - 35);
  text("Queue", queueOffsetX + 2, queueOffsetY - 35);

  textAlign(CENTER, CENTER)
  textStyle(NORMAL);
  textSize(12);
  text("TOS", stackOffsetX + boxSize/2, stackOffsetY - 10);
  text("EOQ", queueOffsetX + boxSize/2, queueOffsetY - 10);
  stack.draw()
  queue.draw()
}

function mousePressed() {
  
}

