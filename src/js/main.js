class Board {
  static ROW = 20;
  static COL = 10;
  static BLOCKSIZE = 30;
  static DROPSPEED = 1000;
  static MINO_SPONE_X = 3;
  static MINO_SPONE_Y = 0;
  static WIDTH = 300;
  static HEIGHT = 600;

  /**
   * @summary ゲームボードを初期化する
   * @returns {Array<Array`<number>`>} 初期化されたゲームボード
   */
  static init() {
    return Array(this.ROW)
      .fill()
      .map(() => Array(this.COL).fill(0));
  }

  // MinoとBoardクラスが相互参照してそう。
  // Drawクラスを作成するかなんらかの方法でクラスの結合度を下げたい。
  /**
   * @summary ボード全体を描画する
   * @param {number} offsetX ボードの左端を基準に何ブロック離れているか
   * @param {number} offsetY ボードの上端を基準に何ブロック離れているか
   * @param {number} minoIndex どの形のテトリミノを使用しているか
   * @param {CanvasRenderingContext2D} ctx キャンバスコンテキスト
   */
  static draw(offsetX, offsetY, minoIndex, ctx) {
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, 300, 600);

    for (let y = 0; y < this.ROW; y++) {
      for (let x = 0; x < this.COL; x++) {
        if (board[y][x] !== 0) {
          Mino.draw(x, y, board[y][x], ctx);
        }
      }
    }

    for (let y = 0; y < Mino.SIZE; y++) {
      for (let x = 0; x < Mino.SIZE; x++) {
        if (mino[y][x] !== 0) {
          Mino.draw(offsetX + x, offsetY + y, minoIndex, ctx);
        }
      }
    }
  }

  /**
   * @summary ブロックが揃った行をボードから削除する
   * @returns {number} ブロックが揃った行数
   */
  static clearLine() {
    const clearLines = this.#getClearLines();
    const clearLineNum = clearLines.length;
    if (clearLineNum > 0) {
      for (let y = clearLines.pop(); y >= 0; y--) {
        if (y - clearLineNum >= 0) {
          for (let x = 0; x < Board.COL; x++) {
            board[y][x] = board[y - clearLineNum][x];
          }
        } else {
          for (let x = 0; x < Board.COL; x++) {
            board[y][x] = 0;
          }
        }
      }
    }
    return clearLineNum;
  }

  /**
   * @summary ブロックが揃った行を取得する
   * @returns {Array<number>} clearLines ブロックが揃った行のリスト
   */
  static #getClearLines() {
    let clearLines = [];
    for (let y = 0; y < this.ROW; y++) {
      for (let x = 0; x < this.COL; x++) {
        if (board[y][x] === 0) {
          break;
        }
        if (x === this.COL - 1) {
          clearLines.push(y);
        }
      }
    }
    return clearLines;
  }
}

class Mino {
  static SIZE = 4;
  static TYPES = [
    [], // dumy (インデックス0は使用しない)
    [
      // Oミノ
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      // Tミノ
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      // Zミノ
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      // S
      [0, 0, 0, 0],
      [0, 0, 1, 1],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      // Iミノ
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      // Jミノ
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      // Lミノ
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  ];

  static COLORS = [
    {}, // dummy (インデックス0は使用しない)
    {
      base: "#00CCFF",
      highlight: "#80EEFF",
      mid: "#00AADD",
      shadow: "#0088AA",
    }, // I: 水色
    {
      base: "#FFCC00",
      highlight: "#FFEE80",
      mid: "#DDAA00",
      shadow: "#AA8800",
    }, // O: 黄色
    {
      base: "#CC00CC",
      highlight: "#EE80EE",
      mid: "#AA00AA",
      shadow: "#880088",
    }, // T: 紫
    {
      base: "#00CC00",
      highlight: "#80EE80",
      mid: "#00AA00",
      shadow: "#008800",
    }, // S: 緑
    {
      base: "#FF0000",
      highlight: "#FF8080",
      mid: "#DD0000",
      shadow: "#AA0000",
    }, // Z: 赤
    {
      base: "#0000FF",
      highlight: "#8080FF",
      mid: "#0000DD",
      shadow: "#000088",
    }, // J: 青
    {
      base: "#FF8800",
      highlight: "#FFCC80",
      mid: "#DD7700",
      shadow: "#AA5500",
    }, // L: オレンジ
  ];

  // MinoとBoardクラスが相互参照してそう。
  // Drawクラスを作成するかなんらかの方法でクラスの結合度を下げたい。
  /**
   * @summary ボード内にテトリミノを描画する
   * @param {number} x ボードの左端から見た座標
   * @param {number} y ボードの上端から見た座標
   * @param {number} minoIndex　テトリミノ種類を表すインデックス
   * @param {CanvasRenderingContext2D} ctx キャンバスコンテキスト
   */
  static draw(x, y, minoIndex, ctx) {
    const px = x * Board.BLOCKSIZE;
    const py = y * Board.BLOCKSIZE;

    this.#gradationDraw(px, py, minoIndex, ctx);
  }

  /**
   * @summary グラデーションのあるブロックでテトリミノを表示する
   * @param {number} x ボードの左端から見た座標
   * @param {number} y ボードの上端から見た座標
   * @param {number} minoIndex　テトリミノ種類を表すインデックス
   * @param {CanvasRenderingContext2D} ctx キャンバスコンテキスト
   */
  static #gradationDraw(x, y, minoIndex, ctx) {
    const bevelSize = Board.BLOCKSIZE * 0.15; // Magic Number
    const innerBevelSize = Board.BLOCKSIZE * 0.05; // Magic Number

    // 基本の四角形描画
    ctx.fillStyle = this.COLORS[minoIndex].base;
    ctx.fillRect(x, y, Board.BLOCKSIZE, Board.BLOCKSIZE);

    // 外側のベベル（傾斜）効果
    // 上部（ハイライト）
    ctx.fillStyle = this.COLORS[minoIndex].highlight;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Board.BLOCKSIZE, y);
    ctx.lineTo(x + Board.BLOCKSIZE - bevelSize, y + bevelSize);
    ctx.lineTo(x + bevelSize, y + bevelSize);
    ctx.closePath();
    ctx.fill();

    // 左側（ハイライト）
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + Board.BLOCKSIZE);
    ctx.lineTo(x + bevelSize, y + Board.BLOCKSIZE - bevelSize);
    ctx.lineTo(x + bevelSize, y + bevelSize);
    ctx.closePath();
    ctx.fill();

    // 右側（影）
    ctx.fillStyle = this.COLORS[minoIndex].shadow;
    ctx.beginPath();
    ctx.moveTo(x + Board.BLOCKSIZE, y);
    ctx.lineTo(x + Board.BLOCKSIZE, y + Board.BLOCKSIZE);
    ctx.lineTo(
      x + Board.BLOCKSIZE - bevelSize,
      y + Board.BLOCKSIZE - bevelSize
    );
    ctx.lineTo(x + Board.BLOCKSIZE - bevelSize, y + bevelSize);
    ctx.closePath();
    ctx.fill();

    // 下側（影）
    ctx.beginPath();
    ctx.moveTo(x, y + Board.BLOCKSIZE);
    ctx.lineTo(x + Board.BLOCKSIZE, y + Board.BLOCKSIZE);
    ctx.lineTo(
      x + Board.BLOCKSIZE - bevelSize,
      y + Board.BLOCKSIZE - bevelSize
    );
    ctx.lineTo(x + bevelSize, y + Board.BLOCKSIZE - bevelSize);
    ctx.closePath();
    ctx.fill();

    // 内側の四角形（中間色）
    ctx.fillStyle = this.COLORS[minoIndex].mid;
    ctx.fillRect(
      x + bevelSize,
      y + bevelSize,
      Board.BLOCKSIZE - 2 * bevelSize, // Magic Number
      Board.BLOCKSIZE - 2 * bevelSize // Magic Number
    );

    // 内側のベベル効果（光沢）
    // 上部内側（ハイライト）
    ctx.fillStyle = this.COLORS[minoIndex].highlight;
    ctx.beginPath();
    ctx.moveTo(x + bevelSize, y + bevelSize);
    ctx.lineTo(x + Board.BLOCKSIZE - bevelSize, y + bevelSize);
    ctx.lineTo(
      x + Board.BLOCKSIZE - bevelSize - innerBevelSize,
      y + bevelSize + innerBevelSize
    );
    ctx.lineTo(x + bevelSize + innerBevelSize, y + bevelSize + innerBevelSize);
    ctx.closePath();
    ctx.fill();

    // 左側内側（ハイライト）
    ctx.beginPath();
    ctx.moveTo(x + bevelSize, y + bevelSize);
    ctx.lineTo(x + bevelSize, y + Board.BLOCKSIZE - bevelSize);
    ctx.lineTo(
      x + bevelSize + innerBevelSize,
      y + Board.BLOCKSIZE - bevelSize - innerBevelSize
    );
    ctx.lineTo(x + bevelSize + innerBevelSize, y + bevelSize + innerBevelSize);
    ctx.closePath();
    ctx.fill();

    // 光沢効果（左上から右下へのグラデーション）
    const gradient = ctx.createLinearGradient(
      x + bevelSize + innerBevelSize,
      y + bevelSize + innerBevelSize,
      x + Board.BLOCKSIZE - bevelSize - innerBevelSize,
      y + Board.BLOCKSIZE - bevelSize - innerBevelSize
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)"); // Magic Number
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.1)"); // Magic Number
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // Magic Number

    ctx.fillStyle = gradient;
    ctx.fillRect(
      x + bevelSize + innerBevelSize,
      y + bevelSize + innerBevelSize,
      Board.BLOCKSIZE - 2 * (bevelSize + innerBevelSize), // Magic Number
      Board.BLOCKSIZE - 2 * (bevelSize + innerBevelSize) // Magic Number
    );
  }

  /**
   * @summary 時計回りに90度回転したテトリミノを生成する
   * @param {Array<Array<number>>} mino ボード内で落下中(捜査対象)のテトリミノ
   * @returns 時計回りに90度回転したテトリミノ
   */
  static rotate(mino) {
    let rotatedMino = [];
    for (let y = 0; y < this.SIZE; y++) {
      rotatedMino[y] = [];
      for (let x = 0; x < this.SIZE; x++) {
        rotatedMino[y][x] = mino[this.SIZE - 1 - x][y];
      }
    }
    return rotatedMino;
  }
}

class Score {
  /**
   * @summary 行内にブロックが揃った際のスコア計算(削除行数による重み付けなし)
   * @param {number} clearLineNum 削除した行数
   * @returns 削除した行数に対して取得するスコア
   */
  static calcScore(clearLineNum) {
    return clearLineNum * 100;
  }
}

// main
let offsetX = Board.MINO_SPONE_X;
let offsetY = Board.MINO_SPONE_Y;

let minoIndex = getRandomIndex();
let mino = Mino.TYPES[minoIndex];

let isGameOver = false;

let score = 0;

let timerId = NaN;

let board = [];

const field = document.getElementById("playfield");
field.width = Board.WIDTH;
field.height = Board.HEIGHT;
const ctx = field.getContext("2d");

function initStartPos() {
  offsetX = Board.MINO_SPONE_X;
  offsetY = Board.MINO_SPONE_Y;
}

function canMove(dx, dy, currentMino = mino) {
  for (let y = 0; y < Mino.SIZE; y++) {
    for (let x = 0; x < Mino.SIZE; x++) {
      if (currentMino[y][x] !== 0) {
        let xOnBoard = offsetX + x + dx;
        let yOnBoard = offsetY + y + dy;
        if (
          xOnBoard < 0 ||
          xOnBoard >= Board.COL ||
          yOnBoard < 0 ||
          yOnBoard >= Board.ROW ||
          board[yOnBoard][xOnBoard] !== 0
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

function mapStopedMinoToBoard() {
  for (let y = 0; y < Mino.SIZE; y++) {
    for (let x = 0; x < Mino.SIZE; x++) {
      if (mino[y][x]) {
        board[offsetY + y][offsetX + x] = minoIndex;
      }
    }
  }
}

function dropMino() {
  if (isGameOver) {
    return;
  }
  if (canMove(0, 1)) {
    offsetY++;
  } else {
    mapStopedMinoToBoard();
    clearLineNum = Board.clearLine();
    if (clearLineNum > 0) {
      score += Score.calcScore(clearLineNum);
      scoreElem = document.getElementById("score");
      scoreElem.innerHTML = String(score);
    }
    minoIndex = getRandomIndex();
    mino = Mino.TYPES[minoIndex];
    initStartPos();
    if (!canMove(0, 0)) {
      isGameOver = true;
      window.alert("Game Over!");
      clearInterval(timerId);
    }
  }
  Board.draw(offsetX, offsetY, minoIndex, ctx);
}

function getRandomIndex() {
  return Math.floor(Math.random() * (Mino.TYPES.length - 1)) + 1;
}

document.getElementById("start-button").addEventListener("click", function () {
  this.blur();
  if (isGameOver) {
    return;
  }
  document.onkeydown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        if (canMove(-1, 0)) {
          offsetX--;
        }
        break;
      case "ArrowRight":
        if (canMove(1, 0)) {
          offsetX++;
        }
        break;
      case "ArrowDown":
        if (canMove(0, 1)) {
          offsetY++;
        }
        break;
      case "ArrowUp":
        let rotatedMino = Mino.rotate(mino);
        if (canMove(0, 0, rotatedMino)) {
          mino = rotatedMino;
        }
    }
    Board.draw(offsetX, offsetY, minoIndex, ctx);
  };
});

function startGame() {
  isGameOver = false;
  score = 0;
  scoreElem = document.getElementById("score");
  scoreElem.innerHTML = String(score);
  board = Board.init();
  initStartPos();
  timerId = setInterval(dropMino, Board.DROPSPEED);
  Board.draw(offsetX, offsetY, minoIndex, ctx);
}
