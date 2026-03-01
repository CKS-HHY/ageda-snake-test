export class MenuUI {
  constructor() {
    this.startScreen = this.createStartScreen()
    this.gameOverScreen = this.createGameOverScreen()
    document.body.append(this.startScreen, this.gameOverScreen)
  }

  createStartScreen() {
    const container = document.createElement('div')
    container.className = 'menu-screen'
    container.innerHTML = `
      <h1 class="menu-title">NEON DRIFT</h1>
      <p class="menu-subtitle">Press ENTER to Start</p>
      <p class="menu-instructions">WASD to move • Collect orbs to increase score • Avoid obstacles to survive.</p>
    `
    return container
  }

  createGameOverScreen() {
    const container = document.createElement('div')
    container.className = 'menu-screen menu-hidden'
    container.innerHTML = `
      <h1 class="menu-title">GAME OVER</h1>
      <p class="menu-score">Final Score: <span data-final-score>0</span></p>
      <p class="menu-subtitle">Press ENTER to Restart</p>
    `
    return container
  }

  showStart() {
    this.startScreen.classList.remove('menu-hidden')
    this.gameOverScreen.classList.add('menu-hidden')
  }

  showGameOver(score) {
    this.startScreen.classList.add('menu-hidden')
    this.gameOverScreen.classList.remove('menu-hidden')
    this.gameOverScreen.querySelector('[data-final-score]').textContent = String(score)
  }

  hideAll() {
    this.startScreen.classList.add('menu-hidden')
    this.gameOverScreen.classList.add('menu-hidden')
  }
}
