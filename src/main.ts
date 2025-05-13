import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare.js";

const stars: THREE.Sprite[] = [];

/** コンテナのDOM要素 */
const container = document.getElementById("container")!;

// シーン作成
const scene = new THREE.Scene();
const clock = new THREE.Clock();

// カメラの設定
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  50000,
);
camera.position.set(-300, 200, 300); // 地球の真後ろから少し斜めにずらす

// レンダラーの設定
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// OrbitControlsの初期化
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 150;
controls.maxDistance = 3000;
controls.autoRotate = true;

// 環境光の設定
scene.add(new THREE.AmbientLight(0xffffff, 0.005));

// 太陽光（ポイントライト）の設定
const pointLight = new THREE.PointLight(0xffffff, 100.0, 0, 2);
pointLight.position.set(10000, 0, 0);
// シャドウを有効化
pointLight.castShadow = true;

// 減衰設定を調整して地球に十分な光が当たるようにする
pointLight.decay = 0.5; // 少し減衰を追加
scene.add(pointLight);

// Skyboxの設定
const cubeLoader = new THREE.CubeTextureLoader();
scene.background = cubeLoader.load([
  "textures/skybox/space_posX.jpg",
  "textures/skybox/space_negX.jpg",
  "textures/skybox/space_posY.jpg",
  "textures/skybox/space_negY.jpg",
  "textures/skybox/space_posZ.jpg",
  "textures/skybox/space_negZ.jpg",
]);

// 太陽スプライトの作成
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load("textures/solar/sun.jpg");
const sunMaterial = new THREE.SpriteMaterial({
  map: sunTexture,
  color: 0xffffcc, // 少し黄色味を加えて白さを抑える
  transparent: true,
  blending: THREE.AdditiveBlending,
  opacity: 0.8, // 透明度を追加して強度を下げる
});
const sunMesh = new THREE.Sprite(sunMaterial);
sunMesh.scale.set(4000, 4000, 1); // サイズを少し小さくする
sunMesh.position.set(10000, 0, 0);
scene.add(sunMesh);

// レンズフレアの設定
const lensFlare = new Lensflare();
const flareTextures = [
  { tex: "flare0.jpg", size: 2000, dist: 0 },
  { tex: "flare1.jpg", size: 2500, dist: 0 },
  { tex: "flare3.jpg", size: 2500, dist: 0.0 },
  { tex: "flare5.jpg", size: 2500, dist: 0.1 },
  { tex: "flare6.jpg", size: 1250, dist: 0.0 },
  { tex: "flare7.jpg", size: 1250, dist: 0.0 },
  { tex: "flare2.jpg", size: 1250, dist: 0.4 },
  { tex: "flare2.jpg", size: 2500, dist: 0.5 },
  { tex: "flare2.jpg", size: 1250, dist: 0.6 },
  { tex: "flare2.jpg", size: 1250, dist: 1.4 },
  { tex: "flare2.jpg", size: 875, dist: 1.5 },
  { tex: "flare2.jpg", size: 375, dist: 1.7 },
  { tex: "flare2.jpg", size: 2500, dist: 1.9 },
  { tex: "flare2.jpg", size: 250, dist: 2.0 },
  { tex: "flare4.jpg", size: 3750, dist: 1.8 },
];
flareTextures.forEach((f) =>
  lensFlare.addElement(
    new LensflareElement(
      textureLoader.load(`textures/lensflare/${f.tex}`),
      f.size,
      f.dist,
    ),
  ),
);

pointLight.add(lensFlare);

// 地球のテクスチャの読み込み
const earthDiffuse = textureLoader.load("textures/solar/earth_diffuse.jpg");
const earthNormal = textureLoader.load("textures/solar/earth_normals.jpg");
const earthSpecular = textureLoader.load("textures/solar/earth_specular.jpg");
// const earthNight = textureLoader.load("textures/solar/earth_night.jpg"); // TODO 夜のテクスチャーを使いたい
const earthCloudTex = textureLoader.load("textures/solar/earth_clouds.jpg");

// 地球マテリアルの設定 (MeshStandardMaterial)
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthDiffuse,
  normalMap: earthNormal,
  normalScale: new THREE.Vector2(2, 2), // デコボコを強調
  roughnessMap: earthSpecular,
  roughness: 0.9,
  metalness: 0.1, // 非金属面として設定
});
const earthGeo = new THREE.SphereGeometry(100, 64, 64);
const earthMesh = new THREE.Mesh(earthGeo, earthMaterial);

// 雲レイヤーの設定
const cloudMaterial = new THREE.MeshLambertMaterial({
  map: earthCloudTex,
  transparent: true,
  opacity: 1, // さらに透明度を上げて強度を下げる
  color: 0xf0f0f0, // 少し色を落として白さを抑える
  blending: THREE.AdditiveBlending,
});
const cloudMesh = new THREE.Mesh(
  new THREE.SphereGeometry(100.5, 64, 64),
  cloudMaterial,
);

// 地球グループの作成とシーンへの追加
const earth = new THREE.Group();
earth.add(earthMesh);
earth.add(cloudMesh);
scene.add(earth);
camera.lookAt(new THREE.Vector3(10000, 0, 0)); // 太陽方向を見る

// 月のテクスチャとマテリアルの設定
const moonTexture = textureLoader.load("textures/solar/moon.jpg");
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  roughness: 1.0,
  metalness: 0.0,
});
const moonGeo = new THREE.SphereGeometry(20, 32, 32);
const moonMesh = new THREE.Mesh(moonGeo, moonMaterial);
// 月の中心にSpotLightを設置
const moonSpotLight = new THREE.SpotLight(
  0xffffff,
  2,
  200,
  Math.PI / 4,
  0.5,
  2,
);
moonSpotLight.position.set(0, 0, 0);
// 月の初期位置は地球の周囲に配置（x軸方向）
const moonOrbitRadius = 300; // 地球から月までの距離
let moonOrbitAngle = 0; // 月の公転角度
moonMesh.position.set(moonOrbitRadius, 0, 0);

const moon = new THREE.Group();
moon.add(moonMesh);
moon.add(moonSpotLight);
moon.add(moonSpotLight.target);
// moonの位置をearthと同じにする
moon.position.copy(earth.position);
scene.add(moon);

// 星の作成 (Spriteでランダム散布)
const starTex = textureLoader.load("textures/solar/star.jpg");
const starMaterial = new THREE.SpriteMaterial({
  map: starTex,
  color: 0xffffff,
  transparent: true,
  blending: THREE.AdditiveBlending,
});
for (let i = 0; i < 10000; i++) {
  const sprite = new THREE.Sprite(starMaterial);
  // ランダムな球面配置
  const radius = THREE.MathUtils.randFloat(1000, 20000);
  const phi = THREE.MathUtils.randFloat(0, Math.PI * 2);
  const cosTheta = THREE.MathUtils.randFloat(-1, 1);
  const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
  sprite.position.set(
    radius * sinTheta * Math.cos(phi),
    radius * cosTheta,
    radius * sinTheta * Math.sin(phi),
  );
  const scaleVal = THREE.MathUtils.randFloat(2, 15);
  sprite.scale.set(scaleVal, scaleVal, 1);
  scene.add(sprite);
  stars.push(sprite);
}

// リサイズ対応イベントの設定
window.addEventListener("resize", onWindowResize);

animate();

/** アニメーションループ */
function animate(): void {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  controls.update();
  if (earth) {
    earth.rotation.y -= 0.0005 * delta * 60;
    if (cloudMesh) cloudMesh.rotation.y += 0.0002 * delta * 60;
  }
  if (moon) {
    moonOrbitAngle += 0.001 * delta * 60;
    moon.position.copy(earth.position);
    moonMesh.position.set(
      Math.cos(moonOrbitAngle) * moonOrbitRadius,
      0,
      Math.sin(moonOrbitAngle) * moonOrbitRadius,
    );
    moon.rotation.y += 0.0001 * delta * 60;
    // SpotLightの向きを太陽方向に向ける
    const sunPos = new THREE.Vector3(10000, 0, 0);
    moonSpotLight.target.position.copy(moon.worldToLocal(sunPos.clone()));
  }
  starMaterial.opacity = 0.7 + 0.3 * Math.random();
  renderer.render(scene, camera);
}

/** ウィンドウサイズ変更時の処理 */
function onWindowResize(): void {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
