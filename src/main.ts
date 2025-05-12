import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare.js";

const stars: THREE.Sprite[] = [];

/**
 * コンテナのDOM要素を取得
 */
const container = document.getElementById("container");

// シーン作成
const scene = new THREE.Scene();
const clock = new THREE.Clock();

// カメラの設定
const camera = new THREE.PerspectiveCamera(
	60,
	window.innerWidth / window.innerHeight,
	1,
	50000
);
camera.position.set(0, 300, 400);

// レンダラーの設定
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// シャドウマップを有効化
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
if (!container) {
	throw new Error("container is null");
}
container.appendChild(renderer.domElement);

// OrbitControlsの初期化
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 150;
controls.maxDistance = 3000;

// 環境光の設定
const ambient = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambient);

// 太陽光（ポイントライト）の設定
const sunLight = new THREE.PointLight(0xffffff, 100.0, 0);
sunLight.position.set(10000, 0, 0);
// シャドウを有効化
sunLight.castShadow = true;
// シャドウの品質設定
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 500;
sunLight.shadow.camera.far = 15000;
// 減衰設定を調整して地球に十分な光が当たるようにする
sunLight.decay = 0.5; // 少し減衰を追加
scene.add(sunLight);

// Skyboxの設定
const cubeLoader = new THREE.CubeTextureLoader();
const skyBoxTexture = cubeLoader.load([
	"textures/skybox/space_posX.jpg",
	"textures/skybox/space_negX.jpg",
	"textures/skybox/space_posY.jpg",
	"textures/skybox/space_negY.jpg",
	"textures/skybox/space_posZ.jpg",
	"textures/skybox/space_negZ.jpg",
]);
scene.background = skyBoxTexture;

// 太陽スプライトの作成
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load("textures/solar/sun.jpg");
const sunMaterial = new THREE.SpriteMaterial({
	map: sunTexture,
	color: 0xffffcc, // 少し黄色味を加えて白さを抑える
	transparent: true,
	blending: THREE.AdditiveBlending,
	opacity: 0.8 // 透明度を追加して強度を下げる
});
const sunMesh = new THREE.Sprite(sunMaterial);
sunMesh.scale.set(4000, 4000, 1); // サイズを少し小さくする
sunMesh.position.set(10000, 0, 0);
scene.add(sunMesh);

// Lensflare (公式サンプル) の設定
const lensflare = new Lensflare();
const flare0 = textureLoader.load("textures/lensflare/flare0.jpg");
const flare1 = textureLoader.load("textures/lensflare/flare1.jpg");
const flare2 = textureLoader.load("textures/lensflare/flare2.jpg");
const flare3 = textureLoader.load("textures/lensflare/flare3.jpg");
const flare4 = textureLoader.load("textures/lensflare/flare4.jpg");
const flare5 = textureLoader.load("textures/lensflare/flare5.jpg");
const flare6 = textureLoader.load("textures/lensflare/flare6.jpg");
const flare7 = textureLoader.load("textures/lensflare/flare7.jpg");

// フレアテクスチャを追加
lensflare.addElement(new LensflareElement(flare0, 2000, 0));
lensflare.addElement(new LensflareElement(flare1, 2500, 0));
lensflare.addElement(new LensflareElement(flare3, 2500, 0.0));
lensflare.addElement(new LensflareElement(flare5, 2500, 0.1));
lensflare.addElement(new LensflareElement(flare6, 1250, 0.0));
lensflare.addElement(new LensflareElement(flare7, 1250, 0.0));
lensflare.addElement(new LensflareElement(flare2, 1250, 0.4));
lensflare.addElement(new LensflareElement(flare2, 2500, 0.5));
lensflare.addElement(new LensflareElement(flare2, 1250, 0.6));
lensflare.addElement(new LensflareElement(flare2, 1250, 1.4));
lensflare.addElement(new LensflareElement(flare2, 875, 1.5));
lensflare.addElement(new LensflareElement(flare2, 375, 1.7));
lensflare.addElement(new LensflareElement(flare2, 2500, 1.9));
lensflare.addElement(new LensflareElement(flare2, 250, 2.0));
lensflare.addElement(new LensflareElement(flare4, 3750, 1.8));

sunLight.add(lensflare);

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
	roughnessMap: earthSpecular,
	roughness: 1,
	metalness: 0.0, // 非金属面として設定
});
const earthGeo = new THREE.SphereGeometry(100, 64, 64);
const earthMesh = new THREE.Mesh(earthGeo, earthMaterial);

// 雲レイヤーの設定
const cloudMaterial = new THREE.MeshLambertMaterial({
	map: earthCloudTex,
	transparent: true,
	opacity: 1, // さらに透明度を上げて強度を下げる
	color: 0xf0f0f0, // 少し色を落として白さを抑える
	blending: THREE.AdditiveBlending
});
const cloudMesh = new THREE.Mesh(
	new THREE.SphereGeometry(100.5, 64, 64),
	cloudMaterial
);

// 地球グループの作成とシーンへの追加
const earth = new THREE.Group();
earth.add(earthMesh);
earth.add(cloudMesh);
scene.add(earth);

earthMesh.rotation.y = 0;
cloudMesh.rotation.y = 0;
earthMesh.castShadow = true;
earthMesh.receiveShadow = true;
// 雲にもシャドウ設定を適用
cloudMesh.castShadow = true;
cloudMesh.receiveShadow = true;
const earthCloud = cloudMesh;

// 月のテクスチャとマテリアルの設定
const moonTexture = textureLoader.load("textures/solar/moon.jpg");
const moonMaterial = new THREE.MeshStandardMaterial({
	map: moonTexture,
	roughness: 1.0,
	metalness: 0.0,
});
const moonGeo = new THREE.SphereGeometry(20, 32, 32);
const moonMesh = new THREE.Mesh(moonGeo, moonMaterial);
moonMesh.position.set(300, 0, 0);

const moon = new THREE.Group();
moon.add(moonMesh);
scene.add(moon);

// 星の作成 (Spriteでランダム散布)
const starTex = textureLoader.load("textures/solar/star.jpg");
const starMaterial = new THREE.SpriteMaterial({
	map: starTex,
	color: 0xffffff,
	transparent: true,
	blending: THREE.AdditiveBlending,
	opacity: 0.7 // 透明度を追加して強度を下げる
});
for (let i = 0; i < 10000; i++) {
	const sprite = new THREE.Sprite(starMaterial);
	// ランダムな球面配置
	const radius = rand(1000, 20000);
	const phi = rand(0, Math.PI * 2);
	const costheta = rand(-1, 1);
	const sintheta = Math.sqrt(1 - costheta * costheta);
	sprite.position.set(
		radius * sintheta * Math.cos(phi),
		radius * costheta,
		radius * sintheta * Math.sin(phi)
	);
	const scaleVal = rand(2, 10);
	sprite.scale.set(scaleVal, scaleVal, 1);
	scene.add(sprite);
	stars.push(sprite);
}

// リサイズ対応イベントの設定
window.addEventListener("resize", onWindowResize);

/**
 * アニメーションループを開始する
 */
animate();

/**
 * アニメーションループ
 */
function animate(): void {
	requestAnimationFrame(animate);
	const delta = clock.getDelta();

	controls.update();

	// 地球の自転 - 速度を調整
	if (earth) {
		earth.rotation.y -= 0.0005 * delta * 60; // 値を小さくして回転速度を遅く
		if (earthCloud) {
			earthCloud.rotation.y += 0.0002 * delta * 60; // 雲の回転も調整
		}
	}
	// 月の回転 - 速度を調整
	if (moon) {
		moon.rotation.y += 0.0001 * delta * 60; // 値を小さくして回転速度を遅く
	}

	// 星の点滅
	starMaterial.opacity = 0.85 + 0.15 * Math.random();

	renderer.render(scene, camera);
}

/**
 * ウィンドウサイズ変更時の処理
 */
function onWindowResize(): void {
	const w = window.innerWidth;
	const h = window.innerHeight;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize(w, h);
}

/**
 * 指定された範囲内の乱数を生成するユーティリティ関数
 *
 * @param min 最小値
 * @param max 最大値
 * @returns 生成された乱数
 */
function rand(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}
