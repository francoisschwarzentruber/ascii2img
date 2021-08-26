window.onload = load;

function load() {
   fetch("map.txt").then((r) => r.text().then((t) => draw(t)))
}

const assets = {};

function loadImage(filename) {
   const img = new Image();
   img.src = "assets/" + filename;
   return img;
}

assets['A'] = loadImage('tree.png');
assets['~'] = loadImage('water.png');
assets['R'] = loadImage('rock.png');

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

    //requestAnimationFrame(() => draw(text))
}



function drawParticulesInCell(M, x, y, n, f) {
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


function drawCell1(ctx, M, x, y) {
   const xMiddle = x * CELLSIZEY + CELLSIZEY / 2;
   const yMiddle = y * CELLSIZEY + CELLSIZEY / 2;
   if (assets[M[x][y]]) {
      ctx.drawImage(assets[M[x][y]], x * CELLSIZEX, y * CELLSIZEY);
   }
   else if (M[x][y] == "T") {
      drawParticulesInCell(M, x, y, 32, (xpix, ypix) => {
         ctx.beginPath();
         ctx.arc(xpix, ypix, Math.random() + CELLSIZEX / 2, 0, 2 * Math.PI);
         ctx.fillStyle = `rgb(${96+64 * Math.random()}, ${192 + 64 * Math.random()}, 96)`;
         ctx.fill();
      });
   }
   else if (M[x][y] == "W") {
      drawParticulesInCell(M, x, y, 32, (xpix, ypix) => {
         ctx.beginPath();
         ctx.arc(xpix, ypix, Math.random() + CELLSIZEX / 2, 0, 2 * Math.PI);
         ctx.fillStyle = `rgb(${95 + 16 * Math.random()}, ${132 + 64 * Math.random()}, ${255})`;
         ctx.fill();
      });
   }
   else if (M[x][y] == "H") {
      drawParticulesInCell(M, x, y, 32, (xpix, ypix) => {
         ctx.beginPath();
         ctx.moveTo(xpix, ypix);
         ctx.lineTo(xpix, ypix+4+8*Math.random());
         ctx.strokeStyle = `rgb(${64 * Math.random()}, ${128 + 64 * Math.random()}, 0)`;
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
   else
      drawCellText(ctx, M, x, y);
}

function drawCell2(ctx, M, x, y) {
   if (M[x][y] == "T") {
      drawParticulesInCell(M, x, y, 1, (xpix, ypix) => {
         ctx.beginPath();
         ctx.fillStyle = `rgb(${128+64*Math.random()}, 0, 0)`;
         ctx.fillRect(xpix-2, ypix-12, 4, 8);
         ctx.fill();
         ctx.beginPath();
         ctx.arc(xpix, ypix-16, 6*Math.random() + CELLSIZEX / 4, 0, 2 * Math.PI);
         ctx.fillStyle = `rgb(${64 * Math.random()}, ${128 + 64 * Math.random()}, 0)`;
         ctx.fill();
      });
   }
   if (M[x][y] == "W") {
      drawParticulesInCell(M, x, y, 8, (xpix, ypix) => {
         ctx.beginPath();
         ctx.moveTo(xpix, ypix);
         ctx.lineTo(xpix + 4, ypix);
         ctx.strokeStyle = `rgb(${255-64*Math.random()}, ${255-64*Math.random()}, 255)`;
         ctx.stroke();
      });
   }
}

function fillCell(ctx, x, y) {
   ctx.fillRect(x * CELLSIZEX - 2, y * CELLSIZEY - 2, CELLSIZEX + 4, CELLSIZEY + 4);
}

function drawCellText(ctx, M, x, y) {
   ctx.fillStyle = 'black';
   ctx.fillText(M[x][y], x * CELLSIZEX + CELLSIZEX / 2, y * CELLSIZEY + CELLSIZEY);
}
