// Extracted: UfxMesh (mesh helper for DOM-synced textured quads)
class UfxMesh extends Mesh {
    pivot = new Vector2;
    paddingL = 0;
    paddingR = 0;
    paddingT = 0;
    paddingB = 0;
    refDom;
    requireBg;
    tick = 0;
    _domX = 0;
    _domY = 0;
    _domWidth = 0;
    _domHeight = 0;
    _capturedOffsetX = 0;
    _capturedOffsetY = 0;
    constructor(e = {}) {
        let t = e.geometry || new PlaneGeometry(1, 1, e.segX || 1, e.segY || 1).translate(.5, .5, 0);
        t.computeBoundingBox(), super(t, e.material), this.refDom = e.refDom, this.pivot = e.pivot || new Vector2(.5, .5), this.matrixAutoUpdate = !1, this.frustumCulled = !1, this.requireBg = e.requireBg === !0, this.paddingL = e.paddingL || 0, this.paddingR = e.paddingR || 0, this.paddingT = e.paddingT || 0, this.paddingB = e.paddingB || 0, this._initMaterial(e), this.onBeforeRender = this._onBeforeRender.bind(this)
    }
    _onBeforeRender() {
        if (this.requireBg) {
            let e = fboHelper.renderer,
                t = e.getRenderTarget();
            fboHelper.clearMultisampleRenderTargetState(), fboHelper.copy(properties.postprocessing.sceneTexture, properties.postprocessing.fromRenderTarget), e.setRenderTarget(t)
        }
    }
    _initMaterial(e) {
        this.material != e.material && (this.material = new ShaderMaterial({
            vertexShader: e.vertexShader || quadVert,
            fragmentShader: e.fragmentShader || quadFrag
        }), this.material.side = DoubleSide, this.material.transparent = !0);
        for (let r in e) this.material[r] !== void 0 && (this.material[r] = e[r]);
        this.material.extensions.derivatives = !0;
        let t = this.material.uniforms;
        t && (t.u_position = { value: this.position }, t.u_quaternion = { value: this.quaternion }, t.u_scale = { value: this.scale }, t.u_domXY = { value: new Vector2 }, t.u_domWH = { value: new Vector2 }, t.u_domPivot = { value: new Vector2 }, t.u_domPadding = { value: new Vector4 }, t.u_bgTexture = properties.postprocessing.sharedUniforms.u_fromTexture, t.u_resolution = properties.postprocessing.sharedUniforms.u_resolution, t.u_viewportResolution = properties.sharedUniforms.u_viewportResolution)
    }
    syncDom(e = 0, t = 0) {
        if (this.refDom) {
            let r = this.refDom.getBoundingClientRect();
            this.syncRect(r.left, r.top, Math.ceil(r.width), Math.ceil(r.height), e, t)
        } else console.warn("refDom is missing")
    }
    syncRect(e, t, r, n, a = 0, l = 0) {
        this._domX = e, this._domY = t, this._domWidth = Math.ceil(r), this._domHeight = Math.ceil(n), this.material.uniforms.u_domWH.value.set(this._domWidth, this._domHeight), this._capturedOffsetY = a, this._capturedOffsetX = l
    }
    testViewport(e = 0, t = 0) {
        let r = this._domX - this._capturedOffsetX + t,
            n = r + this._domWidth,
            a = this._domY - this._capturedOffsetY + e,
            l = a + this._domHeight;
        return a < properties.viewportHeight && l > 0 && r < properties.viewportWidth && n > 0
    }
    update(e = 0, t = 0) {
        let r = this.material.uniforms;
        r.u_domXY.value.set(this._domX - this._capturedOffsetX + t, this._domY - this._capturedOffsetY + e), r.u_domPivot.value.set(this._domWidth * this.pivot.x, this._domHeight * this.pivot.y), r.u_domPadding.value.set(this.paddingL, this.paddingR, this.paddingT, this.paddingB), this.tick++
    }
}

// Extracted: HomeBalloonsBackground
class HomeBalloonsBackground {
    container = new Object3D;
    mesh = null;
    activeRatio = 0;
    clipOffset = new Vector2;
    clipScale = new Vector2(1, 1);
    constructor() { }
    preInit() { }
    init() {
        let e = new BufferGeometry;
        e.setAttribute("position", new BufferAttribute(new Float32Array([.5, -.5, 0, .5, .5, 0, -.5, .5, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0, -1, -1, 0, -.5, -.5, 0, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1]), 3)), e.setIndex(new BufferAttribute(new Uint16Array([3, 2, 7, 8, 9, 11, 11, 10, 8, 0, 5, 7, 0, 1, 5, 1, 4, 5, 1, 2, 4, 2, 3, 4, 5, 6, 7, 6, 3, 7]), 1)), this.mesh = new Mesh(e, new ShaderMaterial({
            uniforms: Object.assign({
                u_color0: { value: new Color("#141515") },
                u_color1: { value: new Color("#141515") },
                u_colorPaint: { value: new Color("#1a2ffb") },
                u_aspect: { value: 1 },
                u_smooth: { value: new Vector2(0, 1) },
                u_clipScale: { value: this.clipScale },
                u_clipOffset: { value: this.clipOffset },
                u_time: { value: 0 },
                u_activeRatio: { value: 0 },
                u_resolution: { value: new Vector2 },
                u_screenPaintTexture: screenPaint.sharedUniforms.u_currPaintTexture
            }, blueNoise.sharedUniforms),
            vertexShader: vert$k,
            fragmentShader: frag$o,
            side: BackSide
        })), this.mesh.material.defines.NEIGHBOUR_COUNT = homeBalloons.NEIGHBOUR_COUNT + 1, this.mesh.frustumCulled = !1, this.mesh.renderOrder = -1e3, this.container.add(this.mesh)
    }
    resize(e, t) { }
    update(e) {
        this.mesh && (this.mesh.material.uniforms.u_activeRatio.value = this.activeRatio, this.mesh.material.uniforms.u_time.value += .2 * e, this.mesh.material.uniforms.u_aspect.value = properties.width / properties.height, this.mesh.material.uniforms.u_resolution.value.copy(properties.sharedUniforms.u_resolution.value), this.mesh.material.uniforms.u_color0.value.set(COLORS$1[properties.balloonsColorIndex]))
    }
}
const homeBalloonsBackground = new HomeBalloonsBackground;

// Extracted: HomeBalloonsBody
const GRAVITY_FACTOR = 40;
class HomeBalloonsBody {
    position0 = new Vector3;
    velocity0 = new Vector3;
    position = new Vector3;
    velocity = new Vector3;
    gravityVel = new Vector3;
    gravityAcc = new Vector3;
    gravityForce = new Vector3;
    angularVelocity = new Vector3;
    torque = new Vector3;
    quaternion = new Quaternion;
    radius = 1;
    mass = 1;
    volume = 1;
    density = 1;
    friction = 1;
    frictionTot = 0;
    restitution = 1;
    inertia = 0;
    constructor(e = 1, t = 1, r = .5, n = .5, a = !1) {
        this.position0.set((random() - .5) * 12, (random() - .5) * 12, a ? 7 + random() : (random() - .5) * 6), this.velocity0.copy(this.position0).multiplyScalar(-2), this.position.copy(this.position0), this.velocity.copy(this.velocity0), this.radius = 1.05 * e, this.density = t, this.friction = r, this.restitution = n, this.volume = Math.PI * this.radius * 1.333333, this.mass = this.volume * this.radius * this.radius * this.density, this.inertia = this.mass * this.radius * this.radius * .4, this.reset()
    }
    reset() { this.position.copy(this.position0), this.velocity.copy(this.velocity0) }
    applyImpulse() {
        this.gravityForce.copy(this.position).negate().multiplyScalar(10), this.gravityAcc.copy(this.gravityForce), this.gravityForce.set(Math.random() - .5, Math.random() - .5, Math.random() - .5).multiplyScalar(80), this.gravityAcc.add(this.gravityForce).multiplyScalar(1 / this.mass), this.velocity.negate(), this.velocity.add(this.gravityAcc)
    }
    updateGravity(e) {
        this.gravityForce.copy(this.position).negate().multiplyScalar(GRAVITY_FACTOR), this.gravityAcc.copy(this.gravityForce).multiplyScalar(1 / this.mass), this.gravityAcc.multiplyScalar(1 / (1 + this.frictionTot)), this.velocity.addScaledVector(this.gravityAcc, e), this.frictionTot *= .5
    }
    update(e) {
        this.position.addScaledVector(this.velocity, e), this.velocity.multiplyScalar(Math.pow(.2, e))
    }
}

// Extracted: HomeBalloonsPhysics
class HomeBalloonsPhysics {
    MOUSE_RADIUS = .025;
    MOUSE_INFLUENCE = .1;
    MOUSE_PUSH_FORCE = .12;
    bodies = [];
    isActive = !0;
    initWorld() {
        for (let e = 0; e < homeBalloons.NUM_BALLOONS; e++) {
            const t = homeBalloons.balloonList[e],
                { radius: r, density: n, friction: a, restitution: l, isSemitransparent: c } = t,
                u = new HomeBalloonsBody(r, n, a, l, c);
            this.bodies.push(u)
        }
    }
    reset() { for (let e = 0; e < this.bodies.length; e++) this.bodies[e].reset() }
    update(e) {
        if (!this.isActive) return;
        _p1$1.set(input.mouseXY.x, input.mouseXY.y, .5), _p1$1.unproject(properties.camera), _p1$1.sub(properties.camera.position).normalize();
        const r = (0 - properties.camera.position.z) / _p1$1.z;
        _p1$1.multiplyScalar(r), _mouse.copy(properties.camera.position).add(_p1$1), _mousePushForce.copy(_mouse).sub(_mousePrev).multiplyScalar(this.MOUSE_PUSH_FORCE / e), _mouseBA.copy(_mouse).sub(properties.camera.position);
        let n = _mouseBA.lengthSq();
        _mousePrev.copy(_mouse);
        for (let a = 0; a < this.bodies.length; a++) {
            const l = this.bodies[a];
            l.updateGravity(e), _vel.copy(l.velocity), _pos.copy(l.position);
            for (let p = a + 1; p < this.bodies.length; p++) {
                const g = this.bodies[p];
                _v1$6.copy(g.velocity), _p1$1.copy(g.position), _normal.copy(_pos).sub(_p1$1);
                const v = _normal.length(), _ = l.radius + g.radius;
                if (v < _) {
                    const T = Math.sqrt(l.friction * g.friction, 2);
                    l.frictionTot += T, g.frictionTot += T, _normal.normalize(), _normal.multiplyScalar(.5 * (v - _)), _pos.sub(_normal), _p1$1.add(_normal), _normal.normalize();
                    const M = _vel.dot(_normal), S = _v1$6.dot(_normal), b = l.mass, C = g.mass, w = l.restitution, R = g.restitution, E = (b * M + C * S - C * (M - S) * w) / (b + C), I = (b * M + C * S - b * (S - M) * R) / (b + C);
                    _vel.addScaledVector(_normal, (E - M) / (1 + T)), _v1$6.addScaledVector(_normal, (I - S) / (1 + T)), g.position.copy(_p1$1), g.velocity.copy(_v1$6)
                }
            }
            _v0$3.copy(_pos).sub(properties.camera.position);
            let c = _v0$3.dot(_mouseBA) / n;
            c = _v0$3.sub(_v1$6.copy(_mouseBA).multiplyScalar(c)).length() - l.radius - this.MOUSE_RADIUS, 0 > c && (_v0$3.copy(_pos).sub(properties.camera.position).cross(_mouseBA).normalize(), _v1$6.copy(_mouseBA).cross(_v0$3).normalize(), _pos.sub(_v1$6.multiplyScalar(this.MOUSE_INFLUENCE * c)), _v1$6.multiplyScalar(-this.MOUSE_PUSH_FORCE / e), _vel.add(_v1$6), _vel.add(_mousePushForce));
            let u = _pos.length();
            if (u > 0) {
                _v0$3.set(1, 1, 1).normalize();
                let p = 1 - Math.abs(_v0$3.dot(_v1$6.copy(_pos).normalize()));
                p *= e * math.fit(u, 0, 2, 0, 1) * .5, p *= a % 2 * 2 - 1, _q$2.setFromAxisAngle(_v0$3, p), _v1$6.copy(_pos).applyQuaternion(_q$2).sub(_v0$3.copy(_pos)), _vel.add(_v1$6)
            }
            _v0$3.cross(_vel);
            let f = _v0$3.length();
            f /= l.inertia, f > 0 && (_v0$3.normalize(), _q$2.setFromAxisAngle(_v0$3, f * e), l.quaternion.premultiply(_q$2)), l.position.copy(_pos), l.velocity.copy(_vel), l.update(e)
        }
    }
}
const homeBalloonsPhysics = new HomeBalloonsPhysics;

// Extracted: HomeBalloons (Stage3D) and instance
class HomeBalloons extends Stage3D {
    NUM_BALLOONS = 0;
    NEIGHBOUR_COUNT = -1;
    container = new Object3D;
    balloonList = [];
    prePassMeshList = [];
    _sortedBalloonList;
    instancedPositionRadiusAttribute;
    instancedPositionRadiusArray;
    instancedNearPositionRadiusAttributes = [];
    instancedNearPositionRadiusArrays = [];
    ratio = 0;
    cacheRT = null;
    cacheRTBlur0 = null;
    cacheRTBlur1 = null;
    cacheRTBlur2 = null;
    cacheRTBlur3 = null;
    sharedUniforms = { u_blurredTextures: { value: [] }, u_blurredTextureSizes: { value: [] }, u_matcap: { value: null }, u_lightPosition: { value: new Vector3(10, 10, 5) } };
    isReady = !1;
    lockedIndex = -1;
    changeHomeHeroColorSignal = new MinSignal$2;
    constructor() {
        super({ properties: { defaultCameraPosition: new Vector3(0, 0, 0), defaultLookAtPosition: new Vector3(0, 0, 0), cameraFov: 25, clearAlpha: 0 } });
        this.NUM_BALLOONS = SPHERES_DATA.length;
        this.cacheRT = fboHelper.createRenderTarget(1, 1);
        this.cacheInterRT0 = fboHelper.createRenderTarget(1, 1);
        this.cacheInterRT1 = fboHelper.createRenderTarget(1, 1);
        this.cacheInterRT2 = fboHelper.createRenderTarget(1, 1);
        this.cacheInterRT3 = fboHelper.createRenderTarget(1, 1);
        this.cacheRTBlur0 = fboHelper.createRenderTarget(1, 1);
        this.cacheRTBlur1 = fboHelper.createRenderTarget(1, 1);
        this.cacheRTBlur2 = fboHelper.createRenderTarget(1, 1);
        this.cacheRTBlur3 = fboHelper.createRenderTarget(1, 1);
        this.sharedUniforms.u_blurredTextures.value.push(this.cacheRTBlur0.texture);
        this.sharedUniforms.u_blurredTextures.value.push(this.cacheRTBlur1.texture);
        this.sharedUniforms.u_blurredTextures.value.push(this.cacheRTBlur2.texture);
        this.sharedUniforms.u_blurredTextures.value.push(this.cacheRTBlur3.texture);
        this.sharedUniforms.u_blurredTextureSizes.value.push(new Vector2);
        this.sharedUniforms.u_blurredTextureSizes.value.push(new Vector2);
        this.sharedUniforms.u_blurredTextureSizes.value.push(new Vector2);
        this.sharedUniforms.u_blurredTextureSizes.value.push(new Vector2);
    }
    preInit() {
        properties.loader.add(settings.MODEL_PATH + "home/" + (browser$1.isMobile ? "cross_ld" : "cross") + ".buf", { onLoad: e => { this.geometry = e } });
        properties.loader.add(`${settings.TEXTURE_PATH}home/${browser$1.isMobile ? "matcap_ld" : "matcap"}.exr`, { onLoad: e => { e.minFilter = LinearFilter, this.sharedUniforms.u_matcap.value = e } });
        homeBalloonsBackground.preInit();
        this.changeHomeHeroColorSignal.add(() => {
            properties.balloonsColorIndex += 1;
            properties.balloonsColorIndex = math.mod(properties.balloonsColorIndex, COLORS$1.length);
            _blackWhiteToggle = 1 - _blackWhiteToggle;
            homeBalloonsPhysics.bodies.forEach(e => e.applyImpulse())
        });
    }
    init() {
        let e = math.getSeedRandomFn("balloon24");
        this.NEIGHBOUR_COUNT = this.NUM_BALLOONS - 1;
        let t = new ShaderMaterial({ uniforms: {}, vertexShader: prePassVert, fragmentShader: prePassFrag, colorWrite: !1 }),
            r = new ShaderMaterial({ uniforms: {}, vertexShader: prePassVert, fragmentShader: prePassFrag, side: BackSide, colorWrite: !1 });
        for (let n = 0; n < this.NUM_BALLOONS; n++) {
            let a = SPHERES_DATA[n],
                { sssColor: l, name: c, color: u, isColored: f, sss: p, isSemitransparent: g, isRough: v, radius: _, density: T, friction: M, restitution: S, isBlackWhite: b } = a,
                C = this.geometry, w = new Vector4, R = Object.assign({
                    u_color: { value: new Color },
                    u_bgColor: { value: new Color },
                    u_sssColor: { value: new Color },
                    u_matcap: this.sharedUniforms.u_matcap,
                    u_lightPosition: this.sharedUniforms.u_lightPosition,
                    u_sss: { value: 0 },
                    u_roughness: { value: v ? .8 : .1 },
                    u_selfPositionRadius: { value: w },
                    u_selfRotation: { value: new Quaternion },
                    u_nearPositionRadiusList: { value: [] },
                    u_nearRotationList: { value: [] },
                    u_nearColorList: { value: [] },
                    u_nearTransparencyLumaList: { value: [] },
                    u_time: properties.sharedUniforms.u_time
                }, blueNoise.sharedUniforms), E = new Mesh(C, new ShaderMaterial({ uniforms: R, vertexShader: vert$l, fragmentShader: frag$p })), I = new Mesh(C, g ? r : t);
            E._prePassMesh = I, I._mesh = E, this.prePassMeshList.push(I), E.material.defines.NEIGHBOUR_COUNT = this.NEIGHBOUR_COUNT, E.material.extensions.derivatives = !0, E.frustumCulled = !1;
            for (let k = 0; k < this.NEIGHBOUR_COUNT; k++) E.material.uniforms.u_nearPositionRadiusList.value[k] = new Vector4, E.material.uniforms.u_nearRotationList.value[k] = new Quaternion, E.material.uniforms.u_nearColorList.value[k] = new Color, E.material.uniforms.u_nearTransparencyLumaList.value[k] = new Vector2;
            E.position.set(e() * 2, e() * 2 - 1, e() * 2 - 1), E.scale.setScalar(_), I.scale.setScalar(_), w.w = _, this.add(E), this.add(I);
            let O = { name: c, mesh: E, radius: _, distance2: 0, distanceFromCamera: 0, selfPositionRadius: w, color: u, sss: p, isRough: v, isSemitransparent: g, sssColor: l, density: T, friction: M, restitution: S, isColored: f, isBlackWhite: b };
            if (g) {
                E.onBeforeRender = this.onBeforeRenderFront.bind(this), E.material.uniforms.u_sceneTexture = { value: this.cacheRT.texture }, E.material.uniforms.u_blurredTextures = this.sharedUniforms.u_blurredTextures, E.material.uniforms.u_blurredTextureSizes = this.sharedUniforms.u_blurredTextureSizes, E.material.defines.IS_SEMITRANSPARENT = !0;
                let k = E.clone();
                k.material = new ShaderMaterial({ uniforms: Object.assign({ u_sceneTexture: E.material.uniforms.u_sceneTexture }, R), vertexShader: vert$l, fragmentShader: frag$p, side: 1 }), k.onBeforeRender = this.onBeforeRenderBack.bind(this), k.material.defines.NEIGHBOUR_COUNT = this.NEIGHBOUR_COUNT, k.material.defines.IS_SEMITRANSPARENT_BACK = !0, k.material.extensions.derivatives = !0, this.add(k), O.meshBack = k
            }
            this.balloonList.push(O)
        }
        this._sortedBalloonList = this.balloonList.slice(0), homeBalloonsBackground.init(), this.add(homeBalloonsBackground.container), homeBalloonsPhysics.initWorld(), taskManager.add(this), this.isReady = !0
    }
    onBeforeRenderFront() {
        let e = fboHelper.renderer,
            t = e.getRenderTarget();
        fboHelper.clearMultisampleRenderTargetState(), fboHelper.copy(t.texture, this.cacheRT), blur.blur(6, .5, this.cacheRT, this.cacheInterRT0, this.cacheRTBlur0, !0), blur.blur(6, .5, this.cacheRTBlur0, this.cacheInterRT1, this.cacheRTBlur1, !0), blur.blur(6, .5, this.cacheRTBlur1, this.cacheInterRT2, this.cacheRTBlur2, !0), blur.blur(6, .5, this.cacheRTBlur2, this.cacheInterRT3, this.cacheRTBlur3, !0), this.sharedUniforms.u_blurredTextureSizes.value[0].set(this.cacheRTBlur0.width, this.cacheRTBlur0.height), this.sharedUniforms.u_blurredTextureSizes.value[1].set(this.cacheRTBlur1.width, this.cacheRTBlur1.height), this.sharedUniforms.u_blurredTextureSizes.value[2].set(this.cacheRTBlur2.width, this.cacheRTBlur2.height), this.sharedUniforms.u_blurredTextureSizes.value[3].set(this.cacheRTBlur3.width, this.cacheRTBlur3.height), e.setRenderTarget(t)
    }
    onBeforeRenderBack() {
        let e = fboHelper.renderer, t = e.getRenderTarget();
        fboHelper.clearMultisampleRenderTargetState(), fboHelper.copy(t.texture, this.cacheRT), e.setRenderTarget(t)
    }
    resize(e, t) {
        this.cacheRT.setSize(e, t);
        let r = e >> 1, n = t >> 1;
        this.cacheRTBlur0.setSize(r, n), r = r >> 1, n = n >> 1, this.cacheRTBlur1.setSize(r, n), r = r >> 1, n = n >> 1, this.cacheRTBlur2.setSize(r, n), r = r >> 1, n = n >> 1, this.cacheRTBlur3.setSize(r, n), homeBalloonsBackground.resize(r, n)
    }
    _sortDist2(e, t) { return e.distance2 - t.distance2 }
    _sortMeshDist2(e, t) { return e._mesh.distance2 - t._mesh.distance2 }
    syncProperties(e) { this.properties.defaultCameraPosition.z = math.fit(homePage.time, .3, 2, 25, 17.5, ease.backOut), this.properties.cameraDollyZoomFovOffset = math.fit(homePage.time, .3, 3, 100, 0, ease.backOut) }
    updateColor() {
        for (let e = 0; e < this.NUM_BALLOONS; e++) {
            const t = this.balloonList[e];
            if (t.isColored) {
                const r = COLORS$1[properties.balloonsColorIndex];
                t.isSemitransparent ? (_color.set(r), _color.offsetHSL(0, 0, .3), t.color = "#" + _color.getHexString()) : t.color = r
            } else t.isBlackWhite && (t.color = _blackWhiteToggle ? "#888" : "#eee")
        }
    }
    updateUniforms() {
        for (let e = 0; e < this.NUM_BALLOONS; e++) {
            let t = this.balloonList[e],
                { isSemitransparent: r, color: n, sss: a, sssColor: l } = t;
            t.mesh.material.uniforms.u_bgColor.value.copy(properties.bgColor), t.mesh.material.uniforms.u_color.value.set(n), t.mesh.material.uniforms.u_sss.value = a, t.mesh.material.uniforms.u_sssColor.value.set(l), r && (t.meshBack.material.uniforms.u_bgColor.value.copy(properties.bgColor), t.meshBack.material.uniforms.u_color.value.set(n), t.meshBack.material.uniforms.u_sss.value = a, t.meshBack.material.uniforms.u_sssColor.value.set(l))
        }
    }
    updateSorting() {
        for (let e = 0; e < this.NUM_BALLOONS; e++) {
            let t = this.balloonList[e];
            for (let r = 0; r < this.NUM_BALLOONS; r++) {
                let n = this._sortedBalloonList[r];
                t == n ? n.distance2 = 0 : n.distance2 = t.mesh.position.distanceToSquared(n.mesh.position)
            }
            this._sortedBalloonList.sort(this._sortDist2), t.mesh.material.uniforms.u_selfRotation.value.copy(t.mesh.quaternion);
            for (let r = 0; r < this.NEIGHBOUR_COUNT; r++) {
                let n = this._sortedBalloonList[r + 1];
                t.mesh.material.uniforms.u_nearPositionRadiusList.value[r].set(n.mesh.position.x, n.mesh.position.y, n.mesh.position.z, n.mesh.scale.x), t.mesh.material.uniforms.u_nearRotationList.value[r].copy(n.mesh.quaternion), _color.set(n.color), t.mesh.material.uniforms.u_nearColorList.value[r].copy(_color), t.mesh.material.uniforms.u_nearTransparencyLumaList.value[r].set(n.isSemitransparent ? 1 : 0, _color.r * .299 + _color.g * .587 + _color.b * .114)
            }
            t.mesh.getWorldPosition(_v$3), _v$3.applyMatrix4(properties.camera.matrixWorldInverse), t.distanceFromCamera = -_v$3.z
        }
    }
    updateRenderOrder() {
        this._sortedBalloonList.sort((r, n) => r.distanceFromCamera < n.distanceFromCamera ? 1 : -1);
        let e = [-1];
        for (let r = 0; r < this.NUM_BALLOONS; r++) this._sortedBalloonList[r].isSemitransparent && e.push(r);
        e.push(this.NUM_BALLOONS);
        let t = 0;
        for (let r = 0; r < this.NUM_BALLOONS; r++) {
            let n = this._sortedBalloonList[r];
            n.isSemitransparent ? (n.mesh.renderOrder = r * 3 + 2, n.meshBack.renderOrder = r * 3, t++) : n.mesh.renderOrder = (e[t + 1] - (r - e[t])) * 3 + 2
        }
    }
    updateTransformations() {
        for (let e = 0; e < this.NUM_BALLOONS; e++) {
            const t = this.balloonList[e], r = homeBalloonsPhysics.bodies[e];
            t.mesh.position.copy(r.position), t.mesh.quaternion.copy(r.quaternion), t.selfPositionRadius.x = t.mesh.position.x, t.selfPositionRadius.y = t.mesh.position.y, t.selfPositionRadius.z = t.mesh.position.z, t.isSemitransparent && (t.meshBack.position.copy(t.mesh.position), t.meshBack.rotation.copy(t.mesh.rotation))
        }
    }
    update(e) {
        if (this.isReady) {
            if (homeBalloonsBackground.update(e), homeBalloonsPhysics.update(e), this.lockedIndex > -1) {
                let t = this.balloonList[this.lockedIndex];
                t.mesh.position.set(0, 0, 3), t.meshBack && t.meshBack.position.copy(t.mesh.position), t.mesh.rotation.set(properties.time, properties.time * 1.5, 0)
            }
            this.updateTransformations(), this.updateColor(), this.updateUniforms(), this.updateSorting(), this.updateRenderOrder(), this.prePassMeshList.sort(this._sortMeshDist2);
            for (let t = 0; t < this.prePassMeshList.length; t++) {
                let r = this.prePassMeshList[t];
                r.position.copy(r._mesh.position), r.rotation.copy(r._mesh.rotation), r.renderOrder = -500 + t
            }
        }
    }
}
const homeBalloons = new HomeBalloons;

// Extracted: HomeHeroSection (ties DOM #home-hero-visual-container to visuals)
class HomeHeroSection {
    domContainer;
    domHomeTitle;
    sectionDomRange;
    preInit(e) {
        this.domContainer = e.querySelector("#home-hero"), this.domVisualContainer = e.querySelector("#home-hero-visual-container"), this.domHomeTitle = e.querySelector("#home-hero-title"), this.domHomeScroll = e.querySelector("#home-hero-scroll"), this.domHomeCrosses = Array.from(e.querySelectorAll(".home-hero-scroll-container-cross")), this.domHomeScroll = e.querySelector("#home-hero-scroll"), this.domHomeScroll._animating = !1, this.domHomeScroll._time = 0, visuals.stage3DList.push(homeBalloons), homeBalloons.preInit(), this.frameMesh = new Mesh(fboHelper.triGeom, fboHelper.createRawShaderMaterial({
            uniforms: Object.assign({
                u_viewportResolution: properties.sharedUniforms.u_viewportResolution,
                u_domXY: { value: new Vector2 },
                u_domWH: { value: new Vector2 },
                u_bgColor: properties.sharedUniforms.u_bgColor,
                u_globalRadius: properties.sharedUniforms.u_globalRadius
            }),
            vertexShader: frameVert,
            fragmentShader: frameFrag,
            blending: NormalBlending,
            depthTest: !1,
            depthWrite: !1,
            derivatives: !0,
            transparent: !0,
            side: 2
        })), this.frameMesh.material.extensions.derivatives = !0, homePage.preUfxContainer.add(this.frameMesh), this.frameMesh.visible = !1, this.frameMesh.renderOrder = -1e3
    }
    init() {
        input.onClicked.add(() => {
            input.hasThroughElem(this.domVisualContainer, "click") && (audios.countPlay("click"), homeBalloons.changeHomeHeroColorSignal.dispatch())
        }), homeBalloons.init()
    }
    initEvent() {
        window.addEventListener("wheel", this._onWheel.bind(this), { once: !0 })
    }
    resize(e, t) {
        let r = scrollManager.getDomRange(this.domContainer),
            n = r.isActive;
        homeBalloons.ratio = math.fit(r.ratio, 0, 1, 1, 0) * (n ? 1 : 0);
        let a = new SplitType(this.domHomeTitle, { types: "lines, words" });
        for (let l = 0; l < a.lines.length; l++) { let c = a.lines[l]; c.style.position = "relative", c.style.overflow = "hidden" }
        this.domHomeTitle._words = a.words, a = new SplitType(this.domHomeScroll, { types: "words" }), this.domHomeScroll._words = a.words, properties.hasInitialized && homeBalloons.resize(properties.width, properties.height)
    }
    _updateUi(e) {
        scrollManager.scrollPixel, math.fit(this.sectionDomRange.ratio, .3, .7, 0, 1, ease.cubcInOut);
        let t = Math.max(0, homePage.time - 1);
        for (let r = 0; r < this.domHomeTitle._words.length; r++) {
            let n = this.domHomeTitle._words[r], a = t - r / 20;
            n.style.transform = `translate3d(0, ${math.fit(a, 0, 1, 1.7, 0, ease.lusion)}em, 0) rotate(${math.fit(a, 0, .7, 15, 0, ease.lusion)}deg)`
        }
        for (let r = 0; r < this.domHomeCrosses.length; r++) {
            let n = this.domHomeCrosses[r], a = math.fit(t - .2 - r / 10, 0, .6, 0, 1, ease.lusion), l = math.fit(t - .2 - r / 10, 0, .6, 0, 180, ease.lusion);
            n.style.transform = `scale(${a}) rotate(${l}deg)`
        }
        for (let r = 0; r < this.domHomeScroll._words.length; r++) {
            let n = this.domHomeScroll._words[r], a = math.fit(t - .23 - r / 10, 0, .6, .8, 1, ease.lusion), l = math.fit(t - .23 - r / 10, 0, .6, 0, 1, ease.lusion);
            n.style.opacity = l, n.style.transform = `scale(${a})`
        }
    }
    _onWheel() { this.domHomeScroll._animating = !0 }
    update(e) {
        this.sectionDomRange = scrollManager.getDomRange(this.domContainer);
        let t = this.sectionDomRange.isActive, r = scrollManager.getDomRange(this.domVisualContainer), n = this.frameMesh.material.uniforms;
        if (n.u_domXY.value.set(r.screenX, r.screenY), n.u_domWH.value.set(r.width, r.height), homeBalloons.ratio = math.fit(this.sectionDomRange.ratio, 0, 1, 1, 0) * (t ? 1 : 0), homeBalloons.isActive = homeBalloons.ratio > 0, this.frameMesh.visible = t, t) {
            homeBalloons.properties.cameraViewportOffsetY = -(r.screenY + r.height * .5 - properties.viewportHeight * .5);
            let a = r.width / r.height, l = math.fit(a, 2.2, 2 / 3, 18, 30);
            homeBalloons.properties.cameraFov = l, homeBalloonsBackground.clipScale.set((r.width + 2) / properties.viewportWidth, (r.height + 2) / properties.viewportHeight), homeBalloonsBackground.clipOffset.set(-1 / properties.viewportWidth, (homeBalloons.properties.cameraViewportOffsetY - 1) / properties.viewportHeight)
        }
        t && properties.hasStarted && this._updateUi(e, this.sectionDomRange)
    }
    hide() { this._reset() }
    _reset() {
        this.domHomeScroll._animating = !1, this.domHomeScroll._time = 0;
        for (let e = 0; e < this.domHomeTitle._words.length; e++) {
            let t = this.domHomeTitle._words[e];
            t.style.transform = "translate3d(0, 100%, 0)"
        }
    }
}
const homeHeroSection = new HomeHeroSection;

// Optional: Visuals manager (stage3D list)
class Visuals {
    defaultStage3D = new Stage3D;
    currentStage3D = null;
    stage3DList = [];
    preInit() { }
    init() { }
    start() { }
    resize(e, t) { }
    deactivateAll() { for (let e = 0; e < this.stage3DList.length; e++) { let t = this.stage3DList[e]; t.isActive = !1 } }
    syncProperties(e) {
        this.currentStage3D = this.defaultStage3D;
        for (let t = 0; t < this.stage3DList.length; t++) {
            let r = this.stage3DList[t];
            if (r.isActive === !0) {
                this.currentStage3D = r, r.syncProperties(e);
                for (let n in r.properties) properties[n] = r.properties[n]
            } else r.isActive = !1
        }
    }
    update(e) { this.currentStage3D.update(e), this.currentStage3D.visible = !0; for (let t = 0; t < this.stage3DList.length; t++) { let r = this.stage3DList[t]; r.wasActive = r.isActive } }
}
const visuals = new Visuals;