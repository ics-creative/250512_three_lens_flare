import flare0 from "./assets/lensflare/flare0.jpg";
import flare1 from "./assets/lensflare/flare1.jpg";
import flare2 from "./assets/lensflare/flare2.jpg";
import flare3 from "./assets/lensflare/flare3.jpg";
import flare4 from "./assets/lensflare/flare4.jpg";
import flare5 from "./assets/lensflare/flare5.jpg";
import flare6 from "./assets/lensflare/flare6.jpg";
import flare7 from "./assets/lensflare/flare7.jpg";
import spaceNegX from "./assets/skybox/space_negX.jpg";
import spaceNegY from "./assets/skybox/space_negY.jpg";
import spaceNegZ from "./assets/skybox/space_negZ.jpg";
import spacePosX from "./assets/skybox/space_posX.jpg";
import spacePosY from "./assets/skybox/space_posY.jpg";
import spacePosZ from "./assets/skybox/space_posZ.jpg";
import earthClouds from "./assets/solar/earth_clouds.jpg";
import earthDiffuse from "./assets/solar/earth_diffuse.jpg";
import earthNormals from "./assets/solar/earth_normals.jpg";
import earthSpecular from "./assets/solar/earth_specular.jpg";
import moon from "./assets/solar/moon.jpg";
import star from "./assets/solar/star.jpg";
import sun from "./assets/solar/sun.jpg";

export const lensflareTextureUrls = [
  flare0,
  flare1,
  flare2,
  flare3,
  flare4,
  flare5,
  flare6,
  flare7,
] as const;

export const skyboxTextureUrls = [
  spacePosX,
  spaceNegX,
  spacePosY,
  spaceNegY,
  spacePosZ,
  spaceNegZ,
] as const;

export const earthCloudsTextureUrl = earthClouds;
export const earthDiffuseTextureUrl = earthDiffuse;
export const earthNormalsTextureUrl = earthNormals;
export const earthSpecularTextureUrl = earthSpecular;
export const moonTextureUrl = moon;
export const starTextureUrl = star;
export const sunTextureUrl = sun;
