import Vector from 'victor';
import p5 from 'p5';

export const randomInt = (a = 0, b = null) => {

  if (!b)
    return Math.floor((Math.random() * a));

  return Math.floor((Math.random() * b) + a);
};


export const random2DUnitVector = () => {
  const angle = Math.random() * 2 * Math.PI;
  return new Vector(Math.cos(angle), Math.sin(angle));
};

export const dist = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

const canSeeFromTop = (element) => {
  const {top, height} = element.getBoundingClientRect();
  return top <= height;
};

const canSeeFromBottom = (element, navBarHeight) => {
  return element.getBoundingClientRect().bottom >= navBarHeight
};

export const elementIsVisible = (element) => {
  return canSeeFromTop(element) && canSeeFromBottom(element, document.getElementById('am-app-bar').offsetHeight);
};

export const p5Instance = new p5((sketch) => {});

export const pointsToBounds = (points) => {
  if (!points.length)
    return null;

  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  for (let point of points) {
    if (point.x < minX)
      minX = point.x;

    if (point.x > maxX)
      maxX = point.x;

    if (point.y < minY)
      minY = point.y;

    if (point.y > maxY)
      maxY = point.y;

  }

  return {width: maxX - minX, height: maxY - minY};
};


export const rightMostPoint = (points) => {
  if (!points.length)
    return null;

  let point = new Vector(points[0].x, points.y);

  console.log('pLength:', points);
  for (let p of points) {
    console.log('p:', p.x, p.y);
    if (p.x > point.x) {
      point.x = p.x;
      point.y = p.y;
    }
  }

  console.log('rmp:', point.x, point.y);
  return point;
};