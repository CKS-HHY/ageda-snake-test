// Neon Drift — main entry point
import * as THREE from 'three'
import { Vehicle } from './vehicle'
import { VehicleController } from './controls'
import { CollectiblesManager } from './collectibles'
import { ObstaclesManager } from './obstacles'
import { GameState } from './game'
import { HUD } from './hud'
import { MenuUI } from './menu'
import './style.css'

const canvas = document.getElementById('game')

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#0a0a1a')

const scene = new THREE.Scene()
scene.background = new THREE.Color('#0a0a1a')
scene.fog = new THREE.Fog('#1a1230', 20, 180)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)
camera.position.set(0, 5, 10)
camera.lookAt(0, 0, 0)

const ambientLight = new THREE.AmbientLight('#4b6cb7', 0.35)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff', 0.8)
directionalLight.position.set(0, 12, 6)
scene.add(directionalLight)

const cyanLight = new THREE.PointLight('#00ffff', 1.2, 100, 2)
cyanLight.position.set(-20, 6, -10)
scene.add(cyanLight)

const magentaLight = new THREE.PointLight('#ff00ff', 1.2, 100, 2)
magentaLight.position.set(20, 6, 10)
scene.add(magentaLight)

const groundGeometry = new THREE.PlaneGeometry(200, 200, 40, 40)
const groundMaterial = new THREE.MeshStandardMaterial({
  color: '#111122',
  emissive: '#1a3355',
  emissiveIntensity: 0.2,
  wireframe: true,
  roughness: 0.8,
  metalness: 0.1,
})
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI / 2
ground.position.y = 0
scene.add(ground)

const skyGeometry = new THREE.SphereGeometry(500, 32, 32)
const skyMaterial = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: {
    topColor: { value: new THREE.Color('#1b1442') },
    bottomColor: { value: new THREE.Color('#05050f') },
    offset: { value: 20.0 },
    exponent: { value: 0.8 },
  },
  vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
      // Build an atmospheric gradient from horizon to zenith.
      float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
      float t = max(pow(max(h, 0.0), exponent), 0.0);
      gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
    }
  `,
})
const sky = new THREE.Mesh(skyGeometry, skyMaterial)
scene.add(sky)

let vehicle = new Vehicle()
scene.add(vehicle.group)

let controller = new VehicleController(vehicle, camera)
let collectibles = new CollectiblesManager(scene, 18)
let obstacles = new ObstaclesManager(scene, 12)
const gameState = new GameState()
const hud = new HUD()
const menu = new MenuUI()

// Re-create a full run state while preserving scene-wide resources.
function resetRun() {
  scene.remove(vehicle.group)
  collectibles.dispose?.()
  obstacles.dispose?.()

  vehicle = new Vehicle()
  scene.add(vehicle.group)

  controller = new VehicleController(vehicle, camera)
  collectibles = new CollectiblesManager(scene, 18)
  obstacles = new ObstaclesManager(scene, 12)
  gameState.reset()
  menu.hideAll()
  hud.setVisible(true)
}

function startRunIfNeeded() {
  if (!gameState.started || gameState.gameOver) {
    resetRun()
  }
}

window.addEventListener('keydown', (event) => {
  if (event.code !== 'Enter') return

  if (!gameState.started) {
    gameState.start()
    menu.hideAll()
    hud.setVisible(true)
  } else if (gameState.gameOver) {
    startRunIfNeeded()
  }
})

hud.setVisible(false)
menu.showStart()

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

window.addEventListener('resize', onWindowResize)

const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const delta = Math.min(clock.getDelta(), 0.05)

  if (gameState.started && !gameState.gameOver) {
    vehicle.update(delta)
    controller.update(delta)

    const collected = collectibles.update(delta, vehicle.group.position)
    if (collected > 0) gameState.addScore(collected)

    const damage = obstacles.update(delta, vehicle.group.position)
    if (damage > 0) gameState.applyDamage(damage)

    const speed = vehicle.velocity ? vehicle.velocity.length() : 0
    hud.update({
      score: gameState.score,
      health: gameState.health,
      speedNormalized: Math.min(speed / 30, 1),
    })
  }

  if (gameState.gameOver) {
    hud.setVisible(false)
    menu.showGameOver(gameState.score)
  }

  renderer.render(scene, camera)
}

animate()
