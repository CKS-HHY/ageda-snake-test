import * as THREE from 'three'

export class ObstaclesManager {
  constructor(scene, count = 12) {
    this.scene = scene
    this.count = count
    this.obstacles = []
    this.hitCooldown = 0

    const material = new THREE.MeshStandardMaterial({
      color: '#440000',
      emissive: '#ff2233',
      emissiveIntensity: 0.9,
      metalness: 0.25,
      roughness: 0.65,
    })

    for (let i = 0; i < count; i++) {
      const h = THREE.MathUtils.randFloat(1.8, 4.8)
      const geo = new THREE.BoxGeometry(
        THREE.MathUtils.randFloat(1.2, 2.5),
        h,
        THREE.MathUtils.randFloat(1.2, 2.5),
      )
      const mesh = new THREE.Mesh(geo, material)
      mesh.position.set(
        THREE.MathUtils.randFloatSpread(170),
        h / 2,
        THREE.MathUtils.randFloatSpread(170),
      )
      this.scene.add(mesh)
      this.obstacles.push(mesh)
    }
  }

  update(delta, vehiclePosition) {
    if (this.hitCooldown > 0) this.hitCooldown -= delta

    let damage = 0
    for (const obstacle of this.obstacles) {
      const dx = obstacle.position.x - vehiclePosition.x
      const dz = obstacle.position.z - vehiclePosition.z
      const dist = Math.sqrt(dx * dx + dz * dz)
      if (dist < 1.8 && this.hitCooldown <= 0) {
        damage = 10
        this.hitCooldown = 0.45
        break
      }
    }

    return damage
  }
}
