export class GameState {
  constructor() {
    this.score = 0
    this.health = 100
    this.gameOver = false
    this.started = false
  }

  start() {
    this.started = true
    this.gameOver = false
  }

  reset() {
    this.score = 0
    this.health = 100
    this.gameOver = false
    this.started = true
  }

  addScore(amount) {
    if (this.gameOver || !this.started) return
    this.score += amount
  }

  applyDamage(amount) {
    if (this.gameOver || !this.started) return
    this.health = Math.max(0, this.health - amount)
    if (this.health <= 0) this.gameOver = true
  }
}
