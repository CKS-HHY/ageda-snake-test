import * as THREE from 'three'

export class VehicleController {
  constructor(vehicle, camera) {
    this.vehicle = vehicle
    this.camera = camera

    this.keys = {
      forward: false,
      back: false,
      left: false,
      right: false,
    }

    this.speed = 0
    this.maxSpeed = 18
    this.acceleration = 22
    this.brakeAcceleration = 28
    this.friction = 10
    this.turnSpeed = 2.4

    this.forward = new THREE.Vector3(0, 0, 1)
    this.cameraTarget = new THREE.Vector3()
    this.cameraDesired = new THREE.Vector3()

    this._onKeyDown = (e) => this.handleKey(e.code, true)
    this._onKeyUp = (e) => this.handleKey(e.code, false)

    window.addEventListener('keydown', this._onKeyDown)
    window.addEventListener('keyup', this._onKeyUp)
  }

  handleKey(code, pressed) {
    if (code === 'KeyW' || code === 'ArrowUp') this.keys.forward = pressed
    if (code === 'KeyS' || code === 'ArrowDown') this.keys.back = pressed
    if (code === 'KeyA' || code === 'ArrowLeft') this.keys.left = pressed
    if (code === 'KeyD' || code === 'ArrowRight') this.keys.right = pressed
  }

  update(delta) {
    if (this.keys.forward) this.speed += this.acceleration * delta
    if (this.keys.back) this.speed -= this.brakeAcceleration * delta

    if (!this.keys.forward && !this.keys.back) {
      const drag = this.friction * delta
      if (this.speed > 0) this.speed = Math.max(0, this.speed - drag)
      else if (this.speed < 0) this.speed = Math.min(0, this.speed + drag)
    }

    this.speed = THREE.MathUtils.clamp(this.speed, -this.maxSpeed * 0.5, this.maxSpeed)

    const turnInfluence = THREE.MathUtils.clamp(Math.abs(this.speed) / this.maxSpeed, 0.2, 1)
    if (this.keys.left) this.vehicle.group.rotation.y += this.turnSpeed * turnInfluence * delta
    if (this.keys.right) this.vehicle.group.rotation.y -= this.turnSpeed * turnInfluence * delta

    this.forward.set(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.vehicle.group.rotation.y)
    this.vehicle.group.position.addScaledVector(this.forward, this.speed * delta)

    const minBound = -95
    const maxBound = 95
    this.vehicle.group.position.x = THREE.MathUtils.clamp(this.vehicle.group.position.x, minBound, maxBound)
    this.vehicle.group.position.z = THREE.MathUtils.clamp(this.vehicle.group.position.z, minBound, maxBound)

    this.cameraTarget.copy(this.vehicle.group.position)
    this.cameraTarget.y += 1.2

    this.cameraDesired.copy(this.forward).multiplyScalar(-7)
    this.cameraDesired.y = 4.5
    this.cameraDesired.add(this.vehicle.group.position)

    this.camera.position.lerp(this.cameraDesired, 1 - Math.exp(-6 * delta))
    this.camera.lookAt(this.cameraTarget)
  }
}
