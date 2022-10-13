window.onload = load;

/**
 * @description implements a version of Math.random() that is static.
 * For instance, after having called StaticRandom.init(), the first StaticRandom.random() will return
 * the *same* random value
 */
class StaticRandom {
   static SIZE = 1000;
   static i = 0;
   static randArray = (() => {
      const A = [];
      for (let i = 0; i < StaticRandom.SIZE; i++)
         A.push(Math.random()); return A;
   })();

   static random() {
      StaticRandom.i++;
      if (StaticRandom.i >= StaticRandom.SIZE)
         StaticRandom.i = 0;

      return StaticRandom.randArray[StaticRandom.i];
   }

   static init() {
      StaticRandom.i = 0;
   }
}


function load() { fetch("map.txt").then((r) => r.text().then((t) => draw(t))) }


const CELLSIZEX = 16;
const CELLSIZEY = 16;

function text2Matrix(text) {
   const lines = text.split("\n");
   const maxX = Math.max(...lines.map((l) => l.length));
   const M = new Array(maxX);
   for (let x = -1; x < maxX; x++)
      M[x] = new Array(lines.length);

   for (let y = 0; y < lines.length; y++)
      for (let x = 0; x < maxX; x++)
         M[x][y] = lines[y][x];
   return M;
}

function draw(text) {
   StaticRandom.init();
   const M = text2Matrix(text);
   canvas.width = M.length * CELLSIZEX;
   canvas.height = M[0].length * CELLSIZEY;
   const ctx = canvas.getContext('2d');
   ctx.fillStyle = 'rgb(192, 255, 128)';
   ctx.fillRect(0, 0, canvas.width, canvas.height)
   ctx.fillStyle = 'black';
   ctx.font = '20px san-serif';
   ctx.textAlign = "center";

   for (let x = 0; x < M.length; x++)
      for (let y = 0; y < M[x].length; y++) {
         if (M[x][y])
            drawCell1(ctx, M, x, y);
      }

   for (let x = 0; x < M.length; x++)
      for (let y = 0; y < M[x].length; y++) {
         if (M[x][y])
            drawCell2(ctx, M, x, y);
      }

   requestAnimationFrame(() => draw(text))
}


/**
 * 
 * @param {*} M 
 * @param {*} x 
 * @param {*} y 
 * @param {*} n 
 * @param {*} f 
 * @description call function f for n points in the cell M[x][y]
 */
function drawManyTimesStatic(M, x, y, n, f) {
   const xMiddle = x * CELLSIZEY + CELLSIZEY / 2;
   const yMiddle = y * CELLSIZEY + CELLSIZEY / 2;

   for (let i = 0; i < n; i++) {

      let xpix = xMiddle + (CELLSIZEX / 4) * StaticRandom.random()-CELLSIZEX/8;
      let ypix = yMiddle + (CELLSIZEX / 4) * StaticRandom.random()-CELLSIZEY/8;

      let top = StaticRandom.random() > 0.5;
      let left = StaticRandom.random() > 0.5;

      if (M[x - 1][y] == M[x][y] && left)
         xpix -= StaticRandom.random() * (CELLSIZEX / 2);
      if (M[x + 1][y] == M[x][y] && !left)
         xpix += StaticRandom.random() * (CELLSIZEX / 2);

      if (M[x][y - 1] == M[x][y] && top)
         ypix -= StaticRandom.random() * (CELLSIZEX / 2);
      if (M[x][y + 1] == M[x][y] && !top)
         ypix += StaticRandom.random() * (CELLSIZEX / 2);



      f(xpix, ypix);
   }
}


function drawManyTimesDynamic(M, x, y, n, f) {
   const xMiddle = x * CELLSIZEY + CELLSIZEY / 2;
   const yMiddle = y * CELLSIZEY + CELLSIZEY / 2;

   for (let i = 0; i < n; i++) {

      let xpix = xMiddle - 4 * Math.random();
      let ypix = yMiddle + 4 * Math.random();

      let top = Math.random() > 0.5;
      let left = Math.random() > 0.5;

      if (M[x - 1][y] == M[x][y] && left)
         xpix -= Math.random() * (CELLSIZEX / 2);
      if (M[x + 1][y] == M[x][y] && !left)
         xpix += Math.random() * (CELLSIZEX / 2);

      if (M[x][y - 1] == M[x][y] && top)
         ypix -= Math.random() * (CELLSIZEX / 2);
      if (M[x][y + 1] == M[x][y] && !top)
         ypix += Math.random() * (CELLSIZEX / 2);



      f(xpix, ypix);
   }
}




function drawDisk(ctx, cx, cy, r, color) {
   ctx.beginPath();
   ctx.arc(cx, cy, r, 0, 2 * Math.PI);
   ctx.fillStyle = color;
   ctx.fill();
}



function line(ctx, x1, y1, x2, y2, color) {
   ctx.beginPath();
   ctx.lineWidth = 2;
   ctx.strokeStyle = color;
   ctx.moveTo(x1, y1);
   ctx.lineTo(x2, y2);
   ctx.stroke();
}


function drawCell1(ctx, M, x, y) {
   const xMiddle = x * CELLSIZEX + CELLSIZEX / 2;
   const yMiddle = y * CELLSIZEY + CELLSIZEY / 2;
   const yTop = y * CELLSIZEY;
   const yBottom = (y + 1) * CELLSIZEY;
   const xLeft = x * CELLSIZEX;
   const xRight = (x + 1) * CELLSIZEX;

   if (M[x][y] == "C") {
      drawManyTimesStatic(M, x, y, 8,
         (xpix, ypix) => drawDisk(ctx, xpix, ypix, 7  , `rgb(${164 + 64 * StaticRandom.random()},${96 + 64 * StaticRandom.random()},  64)`)
      );
   }
   else if (M[x][y] == "T") {
      drawManyTimesStatic(M, x, y, 6,
         (xpix, ypix) => drawDisk(ctx, xpix, ypix, StaticRandom.random() + CELLSIZEX / 2, `rgb(${96 + 64 * StaticRandom.random()}, ${222 + 32 * StaticRandom.random()}, 96)`)
      );
   }
   else if (M[x][y] == "W") {
      drawManyTimesStatic(M, x, y, 32,
         (xpix, ypix) => drawDisk(ctx, xpix, ypix, StaticRandom.random() + CELLSIZEX / 2, `rgb(${95 + 16 * Math.random()}, ${132 + 64 * Math.random()}, ${255})`));
   }
   else if (M[x][y] == "H") {
      drawManyTimesStatic(M, x, y, 24, (xpix, ypix) => {
         ctx.beginPath();
         ctx.moveTo(xpix, ypix+4);
         ctx.lineTo(xpix, ypix +4 - 4 - 12 * StaticRandom.random());
         ctx.strokeStyle = `rgb(${64 * StaticRandom.random()}, ${128 + 64 * StaticRandom.random()}, 0)`;
         ctx.stroke();
      });
   }
   else if (M[x][y] == "-" && ["-", ">"].indexOf(M[x + 1][y]) >= 0) {
      ctx.beginPath();
      ctx.moveTo(x * CELLSIZEX, yMiddle);
      ctx.lineTo(x * CELLSIZEX + CELLSIZEX, yMiddle);
      ctx.stroke();
   }
   else if (M[x][y] == ">" && M[x - 1][y] == "-") {
      const sizeArrow = 4;
      const xEnd = x * CELLSIZEX + 3 * CELLSIZEX / 4;
      ctx.beginPath();
      ctx.moveTo(x * CELLSIZEX, yMiddle);
      ctx.lineTo(xEnd, yMiddle);
      ctx.lineTo(xEnd - sizeArrow, yMiddle - sizeArrow);
      ctx.moveTo(xEnd, yMiddle);
      ctx.lineTo(xEnd - sizeArrow, yMiddle + sizeArrow);
      ctx.stroke();
   }

   else if (["-", "+", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "∞"].indexOf(M[x][y]) >= 0) {
      ctx.fillStyle = "yellow";
      fillCell(ctx, x, y);
      drawCellText(ctx, M, x, y);
   }
   /* else
       drawCellText(ctx, M, x, y);*/
}

function drawCell2(ctx, M, x, y) {
   const xMiddle = x * CELLSIZEX + CELLSIZEX / 2;
   const yMiddle = y * CELLSIZEY + CELLSIZEY / 2;
   const yTop = y * CELLSIZEY;
   const yBottom = (y + 1) * CELLSIZEY;
   const xLeft = x * CELLSIZEX;
   const xRight = (x + 1) * CELLSIZEX;

   if (M[x][y] == "T") {
      drawManyTimesStatic(M, x, y, 1, (xpix, ypix) => {
         ctx.beginPath();
         ctx.fillStyle = `rgb(${128 + 64 * StaticRandom.random()}, 0, 0)`;
         ctx.fillRect(xpix - 2, ypix - 12, 4, 8);
         ctx.fill();

         drawDisk(ctx, xpix, ypix - 16, 6 * StaticRandom.random() + CELLSIZEX / 4, `rgb(${64 * StaticRandom.random()}, ${128 + 64 * StaticRandom.random()}, 0)`);
      });
   }
   else if (M[x][y] == "W") {
      drawManyTimesDynamic(M, x, y, 4, (xpix, ypix) => {
         ctx.beginPath();
         ctx.moveTo(xpix, ypix);
         ctx.lineTo(xpix + 8, ypix);
         ctx.lineWidth = 1;
         ctx.strokeStyle = `rgb(${255 - 64 * Math.random()}, ${255 - 64 * Math.random()}, 255)`;
         ctx.stroke();
      });
   }
   else if (M[x][y] == "⌜") {
      line(ctx, xLeft, yTop, xRight, yTop, "black");
      line(ctx, xLeft, yBottom, xLeft, yTop, "black");
   }
   else if (M[x][y] == "⌝") {
      line(ctx, xLeft, yTop, xRight, yTop, "black");
      line(ctx, xRight, yBottom, xRight, yTop, "black");
   }
   else if (M[x][y] == "⌟") {
      line(ctx, xRight, yBottom, xRight, yTop, "black");
      line(ctx, xLeft, yBottom, xRight, yBottom, "black");
   }
   else if (M[x][y] == "⌞") {
      line(ctx, xLeft, yBottom, xLeft, yTop, "black");
      line(ctx, xLeft, yBottom, xRight, yBottom, "black");
   }
   else if (M[x][y] == "▕")
      line(ctx, xRight, yBottom, xRight, yTop, "black");
   else if (M[x][y] == "▏")
      line(ctx, xLeft, yBottom, xLeft, yTop, "black");
   else if (M[x][y] == "▔")
      line(ctx, xLeft, yTop, xRight, yTop, "black");
   else if (M[x][y] == "▁")
      line(ctx, xLeft, yBottom, xRight, yBottom, "black");
   else if(M[x][y] == "=") {
      ctx.fillStyle = "orange";
      ctx.fillRect(xLeft, yTop, CELLSIZEX, CELLSIZEY);
      for(let x = xLeft; x<xRight; x+=4) {
         line(ctx, x, yTop, x, yBottom, "white");
      }
   }
   else if(M[x][y] == "║") {
      ctx.fillStyle = "orange";
      ctx.fillRect(xLeft, yTop, CELLSIZEX, CELLSIZEY);
      for(let y = yTop; y<yBottom; y+=4) {
         line(ctx, xLeft, y, xRight, y, "white");
      }
   }

}

function fillCell(ctx, x, y) {
   ctx.fillRect(x * CELLSIZEX - 2, y * CELLSIZEY - 2, CELLSIZEX + 4, CELLSIZEY + 4);
}

function drawCellText(ctx, M, x, y) {
   ctx.fillStyle = 'black';
   ctx.fillText(M[x][y], x * CELLSIZEX + CELLSIZEX / 2, y * CELLSIZEY + CELLSIZEY);
}
