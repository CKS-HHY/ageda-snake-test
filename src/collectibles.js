import * as THREE from 'three'

export class CollectiblesManager {
  constructor(scene, count = 18) {
    this.scene = scene
    this.count = count
    this.items = []
    this.effects = []
    this.spawnTimer = 0
    this.spawnInterval = 2.5

    this.geom = new THREE.SphereGeometry(0.35, 16, 16)
    this.mat = new THREE.MeshStandardMaterial({
      color: '#aaffff',
      emissive: '#00ffff',
      emissiveIntensity: 1.2,
      metalness: 0.2,
      roughness: 0.15,
    })

    for (let i = 0; i < this.count; i++) this.spawnOrb()
  }

  randomPos() {
    return new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(170),
      0.55,
      THREE.MathUtils.randFloatSpread(170),
    )
  }

  spawnOrb() {
    const orb = new THREE.Mesh(this.geom, this.mat.clone())
    orb.position.copy(this.randomPos())
    orb.userData.t = Math.random() * Math.PI * 2
    this.scene.add(orb)
    this.items.push(orb)
  }

  update(delta, vehiclePosition) {
    let collected = 0

    for (let i = this.items.length - 1; i >= 0; i--) {
      const orb = this.items[i]
      orb.userData.t += delta * 3
      orb.position.y = 0.55 + Math.sin(orb.userData.t) * 0.08

      const dist = orb.position.distanceTo(vehiclePosition)
      if (dist < 1.5) {
        collected += 1
        this.createCollectEffect(orb.position)
        this.scene.remove(orb)
        this.items.splice(i, 1)
      }
    }

    for (let i = this.effects.length - 1; i >= 0; i--) {
      const fx = this.effects[i]
      fx.life -= delta
      fx.mesh.scale.addScalar(delta * 2.5)
      fx.mesh.material.opacity = Math.max(0, fx.life / fx.maxLife)
      if (fx.life <= 0) {
        this.scene.remove(fx.mesh)
        this.effects.splice(i, 1)
      }
    }

    this.spawnTimer += delta
    if (this.items.length < this.count && this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0
      this.spawnOrb()
    }

    return collected
  }

  createCollectEffect(position) {
    const ring = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 12, 12),
      new THREE.MeshBasicMaterial({ color: '#ccffff', transparent: true, opacity: 0.8 }),
    )
    ring.position.copy(position)
    this.scene.add(ring)
    this.effects.push({ mesh: ring, life: 0.3, maxLife: 0.3 })
  }
}
