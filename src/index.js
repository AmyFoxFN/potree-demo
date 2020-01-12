import * as THREE from 'three'
import jQuery from 'jquery'
import proj4 from 'proj4'

window.THREE = THREE
window.jQuery = jQuery
window.$ = jQuery
window.proj4 = proj4

importPotree()

async function importPotree() {
  await import('@3dr/potree')

  const Potree = window.Potree

  const cloudContainer = document.getElementById('potree-point-cloud')
  const viewer = new Potree.Viewer(cloudContainer)
}
