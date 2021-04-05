window.onload = load;

function load() {
   fetch("map.txt").then((r) => r.text().then((t) => draw(t)))
}

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
   console.log(text)
   const M = text2Matrix(text);
   canvas.width = M.length * CELLSIZEX;
   canvas.height = M[0].length * CELLSIZEY;
   const ctx = canvas.getContext('2d');
   ctx.fillStyle = 'white';
   ctx.fillRect(0, 0, canvas.width, canvas.height)
   ctx.fillStyle = 'black';
   ctx.font = '20px san-serif';
   ctx.textAlign = "center";

   for (let x = 0; x < M.length; x++)
      for (let y = 0; y < M[x].length; y++) {
         if (M[x][y])
            drawCell(ctx, M, x, y);
      }
}



function drawCell(ctx, M, x, y) {
   const yMiddle = y * CELLSIZEY + CELLSIZEY / 2;
   if (M[x][y] == "-" && ["-", ">"].indexOf(M[x + 1][y]) >= 0) {
      ctx.moveTo(x * CELLSIZEX, yMiddle);
      ctx.lineTo(x * CELLSIZEX + CELLSIZEX, yMiddle);
      ctx.stroke();
   }
   else if (M[x][y] == ">" && M[x - 1][y] == "-") {
      const sizeArrow = 4;
      const xEnd = x * CELLSIZEX + 3*CELLSIZEX / 4;
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



function fillCell(ctx, x, y) {
   ctx.fillRect(x * CELLSIZEX-2, y * CELLSIZEY-2, CELLSIZEX+4, CELLSIZEY+4);
}

function drawCellText(ctx, M, x, y) {
   ctx.fillStyle = 'black';
   ctx.fillText(M[x][y], x * CELLSIZEX + CELLSIZEX / 2, y * CELLSIZEY + CELLSIZEY);
}