# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/prismicio-community/eleventy-plugin-prismic/compare/v0.1.5...v0.2.0) (2022-01-10)


### ⚠ BREAKING CHANGES

* **deps:** update to 11ty 1.0 and maintain dependencies

### Features

* support Prismic preview ([e84cbce](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/e84cbceee20a0eebd17f29268898790ed704bb29))
* update shortcodes to handle preview url ([bc54d4e](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/bc54d4e1a4d2513bdea507d3ff17c68bc2904923))


### Chore

* **deps:** stay on AVA 3 until snapshots get fixed ([429e384](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/429e384eb1dcbdd89d93c9304c9a31f9ea790844))
* **deps:** update to 11ty 1.0 and maintain dependencies ([1259891](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/1259891ff7e254a5560eb307596f544c5fb1cb90))
* improve preview edge cases handling ([337d9ce](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/337d9ce6748a7ae680a731daaff5e468b564023d))
* mark preview feature as experimental ([2857ca7](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/2857ca775ad558be4a4e7a70e19bee577576e75f))
* typo ([531fb17](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/531fb173c916b7e38a0a580c6d9e5b94eb95f240))


### Refactor

* use own environment variable to prevent poluting other 11ty serverless handlers ([ded41a4](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/ded41a49b4a96231d0a5cb7fae47120a13dbf685))


### Documentation

* document prismic previews ([6b640d9](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/6b640d9cc96ff60e99fbba79d5e36518e3be3432))
* update tsdoc ([c7a39cd](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/c7a39cdf454b5c311f55a463d818b102ee0d2ba5))
* wording ([22acf99](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/22acf99ed8b99e3edc4a0b11ffd11de39317d010))
* wording ([be0317e](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/be0317e32d03cf0a8df354f688f24d4857f6eb2d))

### [0.1.5](https://github.com/prismicio-community/eleventy-plugin-prismic/compare/v0.1.4...v0.1.5) (2022-01-03)


### Features

* add i18n support [#6](https://github.com/prismicio-community/eleventy-plugin-prismic/issues/6) ([d6b7041](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/d6b7041ced8fa6a932a2222e9c0ab703b0acb01e))


### Bug Fixes

* correctly unwrap singletons with i18n mode ([baebb59](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/baebb59b5692de9525478af9e50f067b10c3bdf6))
* correctly unwrap singletons with i18n mode ([5c2196f](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/5c2196f430bc5dd66cb8d4f502bd691cb0bd22ba))


### Chore

* **deps:** maintain dependencies ([732ed76](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/732ed76c3d81ea3f85c866b4b191bc8501f6c463))


### Documentation

* add i18n doc ([ce1d4f5](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/ce1d4f51f5bafb2900fb770c6ec7bf90cd9a2e27))

### [0.1.4](https://github.com/prismicio-community/eleventy-plugin-prismic/compare/v0.1.3...v0.1.4) (2021-11-30)


### Chore

* **deps:** maintain dependencies ([e8bb7e9](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/e8bb7e9c9a13c6b3cbd406b4bc97074aebfb0712))

### [0.1.3](https://github.com/prismicio-community/eleventy-plugin-prismic/compare/v0.1.2...v0.1.3) (2021-11-12)


### Features

* update helpers package ([39ac48d](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/39ac48d2306560b77589dfbe47f76d1028db1e20))


### Bug Fixes

* client getAll breaking change (internal) [#4](https://github.com/prismicio-community/eleventy-plugin-prismic/issues/4), [#5](https://github.com/prismicio-community/eleventy-plugin-prismic/issues/5) ([fe7980a](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/fe7980a1575260189b4df306e2670451c8afba33))


### Chore

* **deps:** maintain dependencies ([30619d6](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/30619d638c7f5cd6432502776ac0c3b388dbf1c3))

### [0.1.2](https://github.com/prismicio-community/eleventy-plugin-prismic/compare/v0.1.1...v0.1.2) (2021-11-03)


### Features

* add definePrismicPluginOptions ([8ca407c](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/8ca407c9a4c2471ad247722f2dde07d9ed2cae80))


### Chore

* **deps:** maintain dependencies ([ef6a062](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/ef6a062affb932790fb4cf47caf48001e1456df7))

### [0.1.1](https://github.com/prismicio-community/eleventy-plugin-prismic/compare/v0.1.0...v0.1.1) (2021-09-27)


### Refactor

* remove isExternal ([cc1f1bd](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/cc1f1bdc3f75639e52904d3889d33a4c71e1a167))


### Documentation

* asHTML case change ([3795510](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/3795510850903dfc1b18e9b31a8e135aa8619506))
* fix fixture tsdoc ([070ab09](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/070ab091ae3777331cbb0d2494ff7dc1b1398e76))
* imrpove migration guide ([25c39b9](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/25c39b9ec59fc283af73abbb3e7211d8e4c8ad32))
* typo in doc ([170fcca](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/170fccaf5ddf15134350bd845cf233d9897a1f99))


### Chore

* **config:** add tsdoc lint to eslint ([21426fa](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/21426fa4c0fbf7d6897047dffcd40cd4536deead))
* **deps:** maintain dependencies ([d02e0c2](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/d02e0c208a73af36dd3e1cd509412ebf0b39dd35))
* fix documentation link ([c41b572](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/c41b572d0ef25cf6f34e33ebafc4769e83e08fa7))
* update template config ([5af8adf](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/5af8adf988cb01b19ee321a40d3ea7bc473a1188))

## [0.1.0](https://github.com/prismicio-community/eleventy-plugin-prismic/compare/v0.1.0-alpha.0...v0.1.0) (2021-08-09)


### Documentation

* typo ([3e4687a](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/3e4687abf10ef9353690e15c38c3b29b5faddf88))
* update docs ([2a7278b](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/2a7278bfc4cf556115565d778b27ce0a46658cfd))


### Chore

* eleventyConfig own shortcodes are always here ([d906c16](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/d906c16a6a3527584e6a467a922b3d98e0bfcac1))
* maintain package.json ([c3c24a3](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/c3c24a3a7e2d2f436dab20fabee07cd6f6f4a87e))
* update templates ([539e99d](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/539e99dc80cbb8f49a6018e6086d9a90784293b7))

## [0.1.0-alpha.0](https://github.com/prismicio-community/eleventy-plugin-prismic/compare/v0.0.3...v0.1.0-alpha.0) (2021-08-09)


### ⚠ BREAKING CHANGES

* revamp API and use new kits

### Refactor

* revamp API and use new kits ([b0eacd8](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/b0eacd89fed72434b39439497a5acebab246ac5c))

### [0.0.3](https://github.com/prismicio-community/eleventy-plugin-prismic/compare/v0.0.2...v0.0.3) (2021-08-05)


### Bug Fixes

* typing error in sdk/index.js ([#1](https://github.com/prismicio-community/eleventy-plugin-prismic/issues/1)) ([e708bbe](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/e708bbe3b866bcec144443d92a8c38059c785dda))


### Documentation

* update badges ([04935fa](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/04935fa2a83270b53da98bc96cc8b2876e41f114))


### Chore

* add .versionrc ([efae02b](https://github.com/prismicio-community/eleventy-plugin-prismic/commit/efae02b5595016d71c12fa18ea1fce1eb24aae38))

### [0.0.2](https://github.com/prismicio-community/eleventy-plugin-prismic/compare/v0.0.1...v0.0.2) (2021-04-27)

### 0.0.1 (2021-04-26)
