var tl = new TimelineMax({ paused: true });
tl.to("#mainLogo", 2, { rotation: 360, ease: "back.out(1.7)"},0.3);



var tl2 = new TimelineMax({ paused: true });
tl2.to("#mainLogo", 1.7, { rotation: 360, ease: "back.out(1.7)"});

document.querySelector(".logo").addEventListener("mouseenter", doCoolStuff2);

function doCoolStuff() {
  if (!tl.isActive()) {
    tl.play(0);
  }
}
function doCoolStuff2() {
  if (!tl2.isActive()) {
    tl2.play(0);
  }
}


function expandbutton(id){ 
    let tag = id;
    let i = tag.slice(0, -8);
    console.log(i)
    let arrow = document.getElementById(i+"suggestarr");
    let button1 = document.getElementById(id+0)
    let button2 = document.getElementById(id+1)
    let button3 = document.getElementById(id+2)
    let button4 = document.getElementById(id+3)
    let button5 = document.getElementById(id+4)

    var b2 = new TimelineMax({ paused: true });
    b2.to(button1, 0.6, { y: 35, ease: "back.out(1.7)"});
    var b3 = new TimelineMax({ paused: true });
    b3.to(button2, 0.6, { y: 70, ease: "back.out(1.7)"});
    var b4 = new TimelineMax({ paused: true });
    b4.to(button3, 0.6, { y: 123, ease: "back.out(1.7)"});
    var b5 = new TimelineMax({ paused: true });
    b5.to(button4, 0.6, { y: 165, ease: "back.out(1.7)"});
    var b6 = new TimelineMax({ paused: true });
    b6.to(button5, 0.6, { y: 208, ease: "back.out(1.7)"});
    var A = new TimelineMax({ paused: true });
    A.to(arrow, 0.6, { rotate: 90, ease: "back.out(1.2)"});

    b2.play(0);
    b3.play(0);
    b4.play(0);
    b5.play(0);
    b6.play(0);
    A.play(0);

    document.getElementById("c1").style.zIndex = "1";
    document.getElementById("c2").style.zIndex = "1";
    document.getElementById("blur").style.display = "block";
    document.getElementById("tabsMove").style.zIndex = "1";
}

function shrinkbutton(id){
  
  let tag = id;
  let i = tag.slice(0, -10);
  console.log(i)
  let has = i+"suggestb"; 
  console.log(has);
  let arrow = document.getElementById(i+"suggestarr");
  let button1 = document.getElementById(has+0)
  let button2 = document.getElementById(has+1)
  let button3 = document.getElementById(has+2)
  let button4 = document.getElementById(has+3)
  let button5 = document.getElementById(has+4)
  

  var b2 = new TimelineMax({ paused: true });
  b2.to(button1, 0.6, { y: 0, ease: "back.out(0.5)"});
  var b3 = new TimelineMax({ paused: true });
  b3.to(button2, 0.6, { y: 0, ease: "back.out(0.5)"});
  var b4 = new TimelineMax({ paused: true });
  b4.to(button3, 0.6, { y: 0, ease: "back.out(0.5)"});
  var b5 = new TimelineMax({ paused: true });
  b5.to(button4, 0.6, { y: 0, ease: "back.out(0.5)"});
  var b6 = new TimelineMax({ paused: true });
  b6.to(button5, 0.6, { y: 0, ease: "back.out(0.5)"});
  var A = new TimelineMax({ paused: true });
  A.to(arrow, 0.6, { rotate: 0, ease: "back.out(0.5)"});

  b2.play(0);
  b3.play(0);
  b4.play(0);
  b5.play(0);
  b6.play(0);
  A.play(0);
  document.getElementById("c1").style.zIndex = "99999999999999";
  document.getElementById("c2").style.zIndex =  "99999999999999";
  document.getElementById("tabsMove").style.zIndex = "99999999999999";
  document.getElementById("blur").style.display = "none";
 
}



// const floatAnimation = () => {
//   const tlCan = new TimelineMax({repeat:-1});
//   /*Can Animation*/
//  tlCan
//      //move top left
//  .to('.currentSearch', 1, { y:'-=1', x:'+=1',  rotation:'-=1', ease:Power1.easeInOut})
 
//      //move down right
//  .to('.currentSearch', 1, { y:'+=1', x:'-=1', rotation:'-=1', ease:Power1.easeInOut})
 
 
//  .to('.currentSearch', 1, { y:'-=2',  rotation:'+=1', ease:Power1.easeInOut})
 
//  .to('.currentSearch', 2, { y:'+=1',  rotation:'+=1', ease:Power1.easeInOut})
 
 
//  .to('.currentSearch', 2, { y:'-=2', ease:Power1.easeInOut})
    
//  .to('.currentSearch', 2, { y:'+=2', ease:Power1.easeInOut})
 
 
//  .to('.currentSearch', 2, { y:'-=1', ease:Power1.easeInOut})
    
//  .to('.currentSearch', 2, { y:'+=1', ease:Power1.easeInOut})
 
 
//  .to('.currentSearch', 1, { y:'-=1', ease:Power1.easeInOut})
    
//  .to('.currentSearch', 1, { y:'+=1', ease:Power1.easeInOut})

// TweenLite.to(tlCan, 27, {ease:Power1.easeInOut})

// }
// floatAnimation();


const randomX = random(10, 20);
const randomY = random(20, 30);
const randomDelay = random(0, 1);
const randomTime = random(3, 5);
const randomTime2 = random(5, 10);
const randomAngle = random(8, 12);

gsap.set(circle, {
  x: randomX(-1),
  y: randomX(1),
  rotation: randomAngle(-1)
});

moveX(circle, 1);
moveY(circle, -1);
rotate(circle, 1);

function rotate(target, direction) {
  
  gsap.to(target, randomTime2(), {
    rotation: randomAngle(direction),
    // delay: randomDelay(),
    ease: Sine.easeInOut,
    onComplete: rotate,
    onCompleteParams: [target, direction * -1]
  });
}

function moveX(target, direction) {
  
  gsap.to(target, randomTime(), {
    x: randomX(direction),
    ease: Sine.easeInOut,
    onComplete: moveX,
    onCompleteParams: [target, direction * -1]
  });
}

function moveY(target, direction) {
  
  gsap.to(target, randomTime(), {
    y: randomY(direction),
    ease: Sine.easeInOut,
    onComplete: moveY,
    onCompleteParams: [target, direction * -1]
  });
}

function random(min, max) {
  const delta = max - min;
  return (direction = 1) => (min + delta * Math.random()) * direction;
}