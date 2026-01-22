# Scroll 1 2


1 page -- Hero.tsx
<div className="hero">  -- card -- id = card 1
    <Portfolio/>  -- card innner
</div>

transition --
https://www.youtube.com/watch?v=fbGFPyMlOuI&list=PL8bX3D8aBEpnxsHw-B_592tg7C0v6n_ov&index=19

2 page -- CanvasLoad.tsx
 <div className="Loader-container"> card -- id = card 2
    <StarfieldBackground />
      <Canvas>
      </Canvas>
    <div className="Loader-container tron"></div>
</div>




3 page -- convert tailwind to scss
<Grid />
grid hover -- https://www.youtube.com/watch?v=nm17KIaK6g8

Projects content 
https://www.youtube.com/watch?v=fHA1fw0jPSk&list=PL8bX3D8aBEpnxsHw-B_592tg7C0v6n_ov&index=64

https://www.youtube.com/watch?v=1tbGhxAJNqQ&list=PL8bX3D8aBEpnxsHw-B_592tg7C0v6n_ov&index=56


h1 
font-size -- h1 == 5rem
font-weight -- 900
text transform -- uppercase


p 
text transform -- uppercase
font-weight -- 500




<main className="main-container">
<div className="inner-container">
 <div className="hero">
    <div className="hero__grid-container"></div>
    <div className="hero__grid-container tron"></div>
    <FogBg />
    <Portfolio />
</div>
</div>
</div>

.main-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  }

 .inner-container {
    //max-width: 80rem;
    width: 80vw;
    max-width: 100vw;
    margin-left: 0;
    margin-right: 0;
  }

.hero {
    
    padding-bottom: 5rem; // pb-20
    padding-top: 5rem; // pt-36
    width: 100%;

    // Hero grid container - First div
    &__grid-container {
        height: 100vh;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        }

        .FogBg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
        }
        .Portfolio {
  
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 100vh;
            top: 0;
            left: 0;
            //min-height: 100vh;
            box-sizing: border-box;
            position: relative;
        }
        
}




-----------------anim ---------------

const cards = gsap.utils.toArray(".card"); 

cards. forEach((card, index) => { if (index < cards.length - 1) { const cardInner = card.querySelector(".card-inner");
gsap.fromTo(cardinner, { y: "0%", z: 0, rotationx: 0 }, { y: "-50%", z: -250,rotationx: 45, scrollTrigger: {
trigger: cards[index + 1],
start: "top 85%",
end: "top -75%",
scrub: true,
pin: card,
pinSpacing: false,
}

gsap.to(cardinner, { "--after-opacity": 1, scrollTrigger: scrollTrigger: {
trigger: cards[index + 1],
start: "top 75%",
end: "top -25%",
scrub: true,

  