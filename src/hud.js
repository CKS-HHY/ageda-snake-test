export class HUD {
  constructor() {
    this.root = document.createElement('div')
    this.root.className = 'hud-root'

    this.scorePanel = document.createElement('div')
    this.scorePanel.className = 'hud-panel hud-score'
    this.scorePanel.textContent = 'SCORE: 0'

    this.rightPanel = document.createElement('div')
    this.rightPanel.className = 'hud-panel hud-right'

    const healthLabel = document.createElement('div')
    healthLabel.className = 'hud-label'
    healthLabel.textContent = 'HEALTH'

    this.healthBar = document.createElement('div')
    this.healthBar.className = 'hud-bar'
    this.healthFill = document.createElement('div')
    this.healthFill.className = 'hud-fill hud-health'
    this.healthBar.appendChild(this.healthFill)

    const boostLabel = document.createElement('div')
    boostLabel.className = 'hud-label'
    boostLabel.textContent = 'SPEED'

    this.boostBar = document.createElement('div')
    this.boostBar.className = 'hud-bar'
    this.boostFill = document.createElement('div')
    this.boostFill.className = 'hud-fill hud-boost'
    this.boostBar.appendChild(this.boostFill)

    this.rightPanel.append(healthLabel, this.healthBar, boostLabel, this.boostBar)
    this.root.append(this.scorePanel, this.rightPanel)
    document.body.appendChild(this.root)
  }

  setVisible(visible) {
    this.root.style.display = visible ? 'block' : 'none'
  }

  update({ score = 0, health = 100, speedNormalized = 0 }) {
    this.scorePanel.textContent = `SCORE: ${score}`
    this.healthFill.style.width = `${Math.max(0, Math.min(100, health))}%`
    this.boostFill.style.width = `${Math.max(0, Math.min(1, speedNormalized)) * 100}%`
  }
}
