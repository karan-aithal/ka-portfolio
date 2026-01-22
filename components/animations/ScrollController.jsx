/**
 * SCROLL-BASED ANIMATION CONTROLLER
 * Extracted from Lusion portfolio tunnel effect
 * 
 * Control shader uniforms and Three.js model animations based on scroll position.
 * Provides smooth scroll ratio calculation and easy integration with custom effects.
 */

import * as THREE from 'three';

/**
 * Main Scroll Controller Class
 * Manages scroll-based animation for shaders and models
 */
export class ScrollController {
    constructor(options = {}) {
        // Configuration
        this.enabled = true;
        this.smoothing = options.smoothing ?? 0.1; // 0 = instant, 1 = very smooth
        this.multiplier = options.multiplier ?? 1.0; // Scale factor for scroll ratio

        // State
        this.scrollRatio = 0;           // Current scroll position (0 to 1)
        this.smoothScrollRatio = 0;     // Smoothed scroll ratio
        this.scrollTop = 0;             // Actual scroll position in pixels
        this.scrollHeight = 0;          // Total scrollable height
        this.scrollVelocity = 0;        // Scroll speed (for inertia effects)
        this.prevScrollTop = 0;         // Previous scroll position

        // Callbacks for animations
        this.callbacks = [];

        // Initialize
        this._setupEventListeners();
        this._calculateScrollHeight();
        window.addEventListener('resize', () => this._calculateScrollHeight());
    }

    /**
     * Calculate current scroll metrics
     */
    _calculateScrollHeight() {
        this.scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (this.scrollHeight === 0) {
            this.scrollRatio = 0;
        } else {
            this._updateScrollRatio();
        }
    }

    /**
     * Setup scroll event listener
     */
    _setupEventListeners() {
        window.addEventListener('scroll', () => {
            this._updateScrollRatio();
        }, { passive: true });
    }

    /**
     * Update scroll ratio based on current position
     */
    _updateScrollRatio() {
        this.prevScrollTop = this.scrollTop;
        this.scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Calculate velocity (pixels per frame)
        this.scrollVelocity = this.scrollTop - this.prevScrollTop;

        // Calculate scroll ratio (0 to 1)
        if (this.scrollHeight > 0) {
            this.scrollRatio = this.scrollTop / this.scrollHeight;
        } else {
            this.scrollRatio = 0;
        }

        // Clamp to 0-1
        this.scrollRatio = Math.max(0, Math.min(1, this.scrollRatio));

        // Apply smoothing using lerp
        this.smoothScrollRatio = THREE.MathUtils.lerp(
            this.smoothScrollRatio,
            this.scrollRatio,
            this.smoothing
        );
    }

    /**
     * Get the scroll ratio (0 to 1)
     * Use this to drive your animations
     */
    getScrollRatio() {
        return this.scrollRatio;
    }

    /**
     * Get smoothed scroll ratio for eased animations
     */
    getSmoothScrollRatio() {
        return this.smoothScrollRatio;
    }

    /**
     * Get scroll ratio with custom multiplier
     * Useful for non-linear animation speeds
     */
    getScaledScrollRatio(scale = this.multiplier) {
        return this.scrollRatio * scale;
    }

    /**
     * Get scroll velocity (useful for parallax/inertia effects)
     */
    getScrollVelocity() {
        return this.scrollVelocity;
    }

    /**
     * Register a callback function to be called on scroll updates
     */
    onScroll(callback) {
        this.callbacks.push(callback);
        return () => {
            // Return unsubscribe function
            const index = this.callbacks.indexOf(callback);
            if (index > -1) this.callbacks.splice(index, 1);
        };
    }

    /**
     * Manually trigger all callbacks (called automatically on scroll)
     */
    update() {
        if (!this.enabled) return;

        // Trigger all registered callbacks
        for (const callback of this.callbacks) {
            callback({
                scrollRatio: this.scrollRatio,
                smoothScrollRatio: this.smoothScrollRatio,
                scrollVelocity: this.scrollVelocity,
                scrollTop: this.scrollTop,
                scrollHeight: this.scrollHeight,
            });
        }
    }

    /**
     * Enable/disable scroll control
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * Set smoothing amount (0 = instant, 1 = very slow)
     */
    setSmoothing(amount) {
        this.smoothing = Math.max(0, Math.min(1, amount));
    }

    /**
     * Set multiplier for scroll ratio scaling
     */
    setMultiplier(multiplier) {
        this.multiplier = multiplier;
    }

    /**
     * Destroy controller and remove event listeners
     */
    destroy() {
        this.callbacks = [];
    }
}

/**
 * SHADER UNIFORM UPDATER
 * Automatically update shader uniforms based on scroll
 */
export class ScrollShaderController {
    constructor(scrollController, material, uniformConfig = {}) {
        this.scrollController = scrollController;
        this.material = material;
        this.uniformConfig = uniformConfig; // { uniformName: { scale, offset, easing } }

        // Subscribe to scroll updates
        this.unsubscribe = scrollController.onScroll((data) => {
            this._updateUniforms(data);
        });
    }

    /**
     * Configure a uniform to be driven by scroll
     * @param {string} uniformName - Name of the uniform in shader
     * @param {Object} config - { scale: number, offset: number, easing: function }
     */
    setUniformConfig(uniformName, config = {}) {
        this.uniformConfig[uniformName] = {
            scale: config.scale ?? 1.0,
            offset: config.offset ?? 0.0,
            easing: config.easing ?? ((x) => x), // Linear by default
            useSmooth: config.useSmooth ?? false, // Use smooth scroll ratio
        };
    }

    /**
     * Update all configured uniforms
     */
    _updateUniforms(scrollData) {
        if (!this.material.uniforms) return;

        for (const [uniformName, config] of Object.entries(this.uniformConfig)) {
            if (!this.material.uniforms[uniformName]) continue;

            // Get scroll value (smooth or raw)
            const scrollValue = config.useSmooth ? scrollData.smoothScrollRatio : scrollData.scrollRatio;

            // Apply easing function
            const easedValue = config.easing(scrollValue);

            // Apply scale and offset
            const finalValue = easedValue * config.scale + config.offset;

            // Update uniform
            this.material.uniforms[uniformName].value = finalValue;
        }
    }

    /**
     * Clean up
     */
    destroy() {
        this.unsubscribe();
    }
}

/**
 * MODEL ANIMATION CONTROLLER
 * Animate Three.js models based on scroll position
 */
export class ScrollModelController {
    constructor(scrollController, model) {
        this.scrollController = scrollController;
        this.model = model;
        this.animations = {}; // Store animation configs

        // Subscribe to scroll updates
        this.unsubscribe = scrollController.onScroll((data) => {
            this._updateModel(data);
        });
    }

    /**
     * Register a model animation driven by scroll
     * @param {string} name - Animation name
     * @param {Object} config - { property, values, easing }
     * 
     * Example:
     * controller.addAnimation('rotation', {
     *   property: 'rotation.z',
     *   values: [0, Math.PI * 2],
     *   easing: (x) => x
     * });
     */
    addAnimation(name, config) {
        this.animations[name] = {
            property: config.property,
            values: config.values ?? [0, 1],
            easing: config.easing ?? ((x) => x),
            useSmooth: config.useSmooth ?? false,
        };
    }

    /**
     * Update model based on scroll
     */
    _updateModel(scrollData) {
        const scrollValue = scrollData.scrollRatio;

        for (const [name, anim] of Object.entries(this.animations)) {
            // Get scroll value (smooth or raw)
            const value = anim.useSmooth ? scrollData.smoothScrollRatio : scrollValue;

            // Apply easing
            const eased = anim.easing(value);

            // Interpolate between values
            const interpolated = THREE.MathUtils.lerp(
                anim.values[0],
                anim.values[1],
                eased
            );

            // Set property on model
            this._setProperty(this.model, anim.property, interpolated);
        }
    }

    /**
     * Utility to set nested properties (e.g., 'position.x')
     */
    _setProperty(obj, path, value) {
        const keys = path.split('.');
        let current = obj;

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
            if (!current) return;
        }

        current[keys[keys.length - 1]] = value;
    }

    /**
     * Clean up
     */
    destroy() {
        this.unsubscribe();
    }
}

/**
 * COMMON EASING FUNCTIONS
 * Use with ScrollShaderController and ScrollModelController
 */
export const ScrollEasing = {
    linear: (x) => x,
    easeInQuad: (x) => x * x,
    easeOutQuad: (x) => 1 - (1 - x) * (1 - x),
    easeInOutQuad: (x) => x < 0.5 ? 2 * x * x : -1 + (4 - 2 * x) * x,
    easeInCubic: (x) => x * x * x,
    easeOutCubic: (x) => 1 - Math.pow(1 - x, 3),
    easeInOutCubic: (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    easeInSine: (x) => 1 - Math.cos((x * Math.PI) / 2),
    easeOutSine: (x) => Math.sin((x * Math.PI) / 2),
    easeInOutSine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
};

/**
 * COMPLETE USAGE EXAMPLE
 */
/*

import * as THREE from 'three';
import { 
    ScrollController, 
    ScrollShaderController, 
    ScrollModelController,
    ScrollEasing 
} from './ScrollController.js';

// 1. Initialize scroll controller
const scrollController = new ScrollController({
    smoothing: 0.1,      // Smooth factor (0-1)
    multiplier: 1.0      // Scale scroll ratio
});

// 2. Setup your scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
const renderer = new THREE.WebGLRenderer();

// 3. Create a custom shader material
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        u_tunnelRatio: { value: 0 },
        u_rotation: { value: 0 },
        u_color: { value: new THREE.Color('#94fffb') }
    },
    vertexShader: `
        uniform float u_tunnelRatio;
        void main() {
            vec3 pos = position;
            // Apply tunnel transformation
            float t = u_tunnelRatio * 6.283;
            pos.xy = mat2(cos(t), -sin(t), sin(t), cos(t)) * pos.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 u_color;
        void main() {
            gl_FragColor = vec4(u_color, 1.0);
        }
    `
});

// 4. Create mesh
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), shaderMaterial);
scene.add(mesh);

// 5. Connect shader uniforms to scroll
const shaderController = new ScrollShaderController(scrollController, shaderMaterial);
shaderController.setUniformConfig('u_tunnelRatio', {
    scale: 5.0,           // Multiply scroll ratio by 5
    offset: 0,
    easing: ScrollEasing.easeInOutSine,
    useSmooth: true       // Use smoothed scroll
});
shaderController.setUniformConfig('u_rotation', {
    scale: Math.PI * 2,   // Full rotation
    offset: 0,
    easing: ScrollEasing.linear
});

// 6. Create a model and connect animations
const modelController = new ScrollModelController(scrollController, mesh);
modelController.addAnimation('scaleX', {
    property: 'scale.x',
    values: [1, 2],
    easing: ScrollEasing.easeOutCubic,
    useSmooth: true
});

// 7. Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controllers (required!)
    scrollController.update();
    
    renderer.render(scene, camera);
}
animate();

*/