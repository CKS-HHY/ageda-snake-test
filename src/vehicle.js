import * as THREE from 'three'

export class Vehicle {
  constructor() {
    this.group = new THREE.Group()

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: '#55ffff',
      emissive: '#00ffff',
      emissiveIntensity: 0.6,
      metalness: 0.4,
      roughness: 0.3,
    })

    const canopyMaterial = new THREE.MeshStandardMaterial({
      color: '#ff77ff',
      emissive: '#ff00ff',
      emissiveIntensity: 0.5,
      metalness: 0.5,
      roughness: 0.25,
    })

    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: '#222233',
      emissive: '#00ffff',
      emissiveIntensity: 0.25,
      metalness: 0.2,
      roughness: 0.8,
    })

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 3.2), bodyMaterial)
    body.position.y = 0.6
    this.group.add(body)

    const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 1.2), canopyMaterial)
    canopy.position.set(0, 0.95, 0.1)
    this.group.add(canopy)

    const wheelGeometry = new THREE.BoxGeometry(0.35, 0.35, 0.65)
    const wheelOffsets = [
      [-0.95, 0.25, 1.05],
      [0.95, 0.25, 1.05],
      [-0.95, 0.25, -1.05],
      [0.95, 0.25, -1.05],
    ]

    wheelOffsets.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
      wheel.position.set(x, y, z)
      this.group.add(wheel)
    })

    const thrusterMaterial = new THREE.MeshStandardMaterial({
      color: '#ff66ff',
      emissive: '#ff00ff',
      emissiveIntensity: 0.8,
      metalness: 0.3,
      roughness: 0.4,
    })

    const thrusterGeometry = new THREE.BoxGeometry(0.35, 0.2, 0.45)
    const thrusterL = new THREE.Mesh(thrusterGeometry, thrusterMaterial)
    thrusterL.position.set(-0.45, 0.45, -1.9)
    this.group.add(thrusterL)

    const thrusterR = new THREE.Mesh(thrusterGeometry, thrusterMaterial)
    thrusterR.position.set(0.45, 0.45, -1.9)
    this.group.add(thrusterR)

    this.group.position.set(0, 0.15, 0)
    this.hoverTime = 0
  }

  update(delta) {
    this.hoverTime += delta
    this.group.position.y = 0.15 + Math.sin(this.hoverTime * 4) * 0.03
  }
}
