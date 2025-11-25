import React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react"; // Importing react-p5-wrapper
import { useState, useEffect } from "react";
import p5Types from "p5";

type Sketch = (p5: p5Types) => void;

const starfieldSketch: Sketch = (p5: p5Types) => {
  let stars: Star[] = [];
  let viewPoint: p5Types.Vector;

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.frameRate(30);
    setViewPoint(0, 0);
    resetStarfield();
  };

  function resetStarfield() {
    stars = [];
  }

  function setViewPoint(x: number, y: number) {
    viewPoint = p5.createVector(
      p5.map(x, 0, p5.width, 0, 15),
      p5.map(y, 0, p5.height, 0, 15)
    );
  }

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    resetStarfield();
  };

  p5.doubleClicked = () => {
    p5.fullscreen(!p5.fullscreen());
  };

  p5.mousePressed = () => {
    p5.noCursor();
  };

  p5.mouseReleased = () => {
    p5.cursor(p5.ARROW);
  };

  p5.draw = () => {
    p5.clear();
    p5.background(0);

    // Mouse interaction
    if (p5.mouseIsPressed) {
      setViewPoint(p5.mouseX - p5.width / 2, p5.mouseY - p5.height / 2);
      for (let i = 0; i < 20; i++) {
        stars.push(new Star(createVectorTunnel()));
      }
    } else {
      setViewPoint(0, 0);
    }

    // Base starfield
    for (let i = 0; i < 15; i++) {
      stars.push(new Star(createVectorField()));
    }

    // Draw
    for (let i = stars.length - 1; i >= 0; i--) {
      const star = stars[i];
      if (star.isDead()) {
        stars.splice(i, 1);
      } else {
        star.draw();
      }
    }
  };

  function createVectorTunnel() {
    const radius = 50;
    const angle = p5.random(0, 180);

    const x = p5.width / 2 + radius * p5.cos(angle);
    const y = p5.height / 2 + radius * p5.sin(angle);

    return p5.createVector(x, y);
  }

  function createVectorField() {
    return p5.createVector(p5.random(0, p5.width), p5.random(0, p5.height));
  }

  class Star {
    color = 0;
    size = 2;
    position: p5Types.Vector;
    vector: p5Types.Vector;
    direction: p5Types.Vector;

    constructor(position: p5Types.Vector) {
      this.position = position;
      this.vector = p5.createVector(
        position.x - p5.width / 2,
        position.y - p5.height / 2
      );
      this.direction = this.vector.copy().normalize();
    }

    draw() {
      p5.noStroke();
      p5.fill(p5.map(this.color, 0, 100, 0, 254));

      this.direction.mult(p5.random(1.07, 1.1));
      this.position.add(this.direction);
      this.position.add(viewPoint);

      p5.ellipse(this.position.x, this.position.y, this.size);

      this.size += 0.05;
      if (this.color < 100) this.color += 3;
    }

    isDead() {
      return (
        this.position.x < 0 ||
        this.position.y < 0 ||
        this.position.x > p5.width ||
        this.position.y > p5.height
      );
    }
  }
};

const StarfieldBackground: React.FC = () => {
  return (
    <div className="StarfieldBackground">
      <ReactP5Wrapper sketch={starfieldSketch} />
    </div>
  );
};

export default StarfieldBackground;
