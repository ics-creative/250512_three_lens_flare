# レンズフレアのデモ

WebGPU と Three.js に移植したレンズフレアのデモです。

## 開発

```bash
npm install
npm run dev
```

利用できるコマンド:

- `npm run build`
- `npm run lint`
- `npm run format`

# オリジナルはFlash

本デモはもともとはFlash (ActionScript 3.0)で作成していました。

- 使用しているフレームワーク
  - 3Dフレームワーク「Away3D 4.1.4 GOLD」をベース
  - 一部分（レンズフレアの箇所）は2Dフレームワーク「Starling 1.3」を利用

# 素材

以下のファイルは地球のテクスチャは有償の素材ですので、流用しないようにお願いします。

- `src/assets/solar`

レンズフレアの画像は、After EffectsとPhotoshopで作成したものです。

- `src/assets/lensflare`

skybox を含む画像アセットは `public` ではなく `src/assets` 配下から import しています。


## Article

- Ja: [エフェクト作成入門講座 Three\.js編 \- レンズフレア表現 \- ICS MEDIA](https://dev.ics.media/entry/476/)
- En: [Lens flare effects in Three\.js \- ICS MEDIA](https://dev.ics.media/en/entry/476/)
