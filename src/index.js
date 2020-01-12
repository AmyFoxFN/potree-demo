import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

window.THREE = THREE
THREE.OrbitControls = OrbitControls

importPotree()

async function importPotree() {
  window.Potree = await import('potree-core')

  initScene()
}

function initScene() {
  //three.js
  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)

  var canvas = document.createElement('canvas')
  canvas.style.position = 'absolute'
  canvas.style.top = '0px'
  canvas.style.left = '0px'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  document.body.appendChild(canvas)

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    logarithmicDepthBuffer: true,
    context: null,
    precision: 'highp',
    premultipliedAlpha: true,
    antialias: true,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance'
  })

  var geometry = new THREE.BoxBufferGeometry(25, 1, 25)
  var material = new THREE.MeshBasicMaterial({ color: 0x44aa44 })
  var cube = new THREE.Mesh(geometry, material)
  cube.position.y = -2
  scene.add(cube)

  scene.add(new THREE.AmbientLight(0xffffff))

  var controls = new THREE.OrbitControls(camera, canvas)
  camera.position.z = 10

  var raycaster = new THREE.Raycaster()
  raycaster.params.Points.threshold = 1e-2
  var normalized = new THREE.Vector2()

  canvas.onmousemove = function(event) {
    normalized.set((event.clientX / canvas.width) * 2 - 1, -(event.clientY / canvas.height) * 2 + 1)
    raycaster.setFromCamera(normalized, camera)
  }

  canvas.ondblclick = function(event) {
    var intesects = raycaster.intersectObject(scene, true)

    if (intesects.length > 0) {
      var geometry = new THREE.SphereBufferGeometry(0.1, 32, 32)
      var material = new THREE.MeshBasicMaterial({ color: 0xaa4444 })
      var sphere = new THREE.Mesh(geometry, material)
      sphere.position.copy(intesects[0].point)
      scene.add(sphere)
    }
  }

  Potree.Global.workerPath = './source'

  loadPointCloud('assets/data/lion_takanawa_ept_laz/ept.json', new THREE.Vector3(-4, -4, 3.0))
  // loadPointCloud('assets/data/lion_takanawa_ept_bin/ept.json', new THREE.Vector3(-11, -4, 3.0))
  // loadPointCloud('assets/data/lion_takanawa/cloud.js', new THREE.Vector3(-2, -3, 0.0))
  // loadPointCloud('assets/data/lion_takanawa_las/cloud.js', new THREE.Vector3(3, -3, 0.0))
  // loadPointCloud('assets/data/lion_takanawa_laz/cloud.js', new THREE.Vector3(8, -3, 0.0))

  //loadPointCloud("http://arena4d.uksouth.cloudapp.azure.com:8080/4e5059c4-f701-4a8f-8830-59e78a2c0816/BLK360 Sample.vpc");
  //"http://5.9.65.151/mschuetz/potree/resources/pointclouds/faro/skatepark/cloud.js"
  //"http://5.9.65.151/mschuetz/potree/resources/pointclouds/weiss/subseamanifold2/cloud.js"

  function loadPointCloud(url, position) {
    Potree.loadPointCloud(url, 'pointcloud', function(e) {
      var points = new Potree.Group()
      points.material.opacity = 1.0
      points.material.wireframe = true
      scene.add(points)

      var pointcloud = e.pointcloud

      if (position !== undefined) {
        pointcloud.position.copy(position)
      }

      var material = pointcloud.material
      material.size = 2
      material.pointColorType = Potree.PointColorType.RGB //RGB | DEPTH | HEIGHT | POINT_INDEX | LOD | CLASSIFICATION
      material.pointSizeType = Potree.PointSizeType.ADAPTIVE //ADAPTIVE | FIXED
      material.shape = Potree.PointShape.CIRCLE //CIRCLE | SQUARE

      points.add(pointcloud)
    })
  }

  function loop() {
    cube.rotation.y += 0.01

    controls.update()
    renderer.render(scene, camera)

    requestAnimationFrame(loop)
  }
  loop()

  document.body.onresize = function() {
    var width = window.innerWidth
    var height = window.innerHeight

    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  document.body.onresize()
}
