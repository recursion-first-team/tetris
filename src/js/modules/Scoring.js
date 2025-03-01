class Scoring {
  //コンストラクター
  constructor() {
    let score = 0; //初期化時はスコアは0にする
  }

  //セッター
  setScore(num) {
    this.score += num;
  }
  //ゲッター
  getScore() {
    return this.score;
  }
}
