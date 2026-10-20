/*
 * 3D Model Viewer — progressive enhancement
 * ------------------------------------------
 * Finds any element with a [data-model] attribute and upgrades it into an
 * interactive <model-viewer> (orbit / zoom). The existing <img> inside the
 * element is used as the poster and as the graceful fallback: if the GLB is
 * missing or fails to load, the static image stays and nothing breaks.
 *
 * Markup contract (see the 3D project pages):
 *   <div class="model-viewer-mount"
 *        data-model="images/models/foo.glb"
 *        data-alt="Foo 3D model">
 *       <img src="images/foo.png" alt="Foo">   <!-- fallback / poster -->
 *   </div>
 *
 * The <model-viewer> web component is loaded as an ES module from the CDN on
 * the pages that use it. This file is plain JS and has no build step.
 */
(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function upgradeMount(mount) {
        var modelSrc = mount.getAttribute('data-model');
        if (!modelSrc) return;

        var fallbackImg = mount.querySelector('img');
        var posterSrc = fallbackImg ? fallbackImg.getAttribute('src') : '';
        var altText = mount.getAttribute('data-alt') ||
            (fallbackImg ? fallbackImg.getAttribute('alt') : '3D model');

        var viewer = document.createElement('model-viewer');
        viewer.setAttribute('src', modelSrc);
        viewer.setAttribute('alt', altText);
        if (posterSrc) viewer.setAttribute('poster', posterSrc);
        viewer.setAttribute('camera-controls', '');
        viewer.setAttribute('touch-action', 'pan-y');

        // Lighting / environment. glTF does not carry Blender's lights, so
        // model-viewer lights the scene with an image-based environment. Give
        // it a neutral studio environment plus tone mapping so materials
        // (including KHR transmission/specular) read closer to the Blender look
        // instead of looking flat and washed out. Override per-mount with
        // data-environment / data-exposure if needed.
        // environment-image drives the whole look. A warm HDRI (.hdr) recreates
        // Blender's sunset/world lighting that glTF cannot carry; "neutral" is a
        // flat studio fallback. skybox-image additionally shows the HDRI as the
        // background instead of the flat panel colour.
        //
        // data-baked: for models whose lighting+shadows were baked into their
        // textures in Blender. We then want the viewer to interfere as little as
        // possible: a flat neutral environment, no extra ground shadow, and
        // exposure 1 so the baked colours show through unchanged. (Unlit
        // materials exported as KHR_materials_unlit ignore the environment
        // entirely, which is ideal for baked scenes.)
        var isBaked = mount.hasAttribute('data-baked');

        var envImage = mount.getAttribute('data-environment') || 'neutral';
        viewer.setAttribute('environment-image', envImage);
        if (mount.hasAttribute('data-skybox')) {
            viewer.setAttribute('skybox-image', envImage);
        }
        viewer.setAttribute('tone-mapping', mount.getAttribute('data-tone-mapping') || (isBaked ? 'aces' : 'neutral'));
        viewer.setAttribute('exposure', mount.getAttribute('data-exposure') || '1');
        viewer.setAttribute('shadow-intensity', mount.getAttribute('data-shadow') || (isBaked ? '0' : '0.6'));
        viewer.setAttribute('shadow-softness', '0.8');

        // Framing. The default opens on a flattering 3/4 view (looking into the
        // scene from the front-left, tilted slightly down) rather than the
        // near-edge-on angle model-viewer would otherwise pick, which can make
        // open-fronted dioramas like a room read as a flat blob. Per-mount
        // overrides: data-camera-orbit, data-camera-target, data-field-of-view.
        viewer.setAttribute('camera-orbit', mount.getAttribute('data-camera-orbit') || '-35deg 68deg 105%');
        if (mount.hasAttribute('data-camera-target')) {
            viewer.setAttribute('camera-target', mount.getAttribute('data-camera-target'));
        }
        if (mount.hasAttribute('data-field-of-view')) {
            viewer.setAttribute('field-of-view', mount.getAttribute('data-field-of-view'));
        }
        viewer.setAttribute('min-camera-orbit', 'auto auto 0%');
        viewer.setAttribute('max-camera-orbit', 'auto auto 300%');

        viewer.setAttribute('loading', 'lazy');
        viewer.setAttribute('reveal', 'auto');
        viewer.className = 'project-model-viewer';

        // Gentle auto-rotate, unless the user prefers reduced motion.
        if (!prefersReducedMotion) {
            viewer.setAttribute('auto-rotate', '');
            viewer.setAttribute('auto-rotate-delay', '800');
            viewer.setAttribute('rotation-per-second', '18deg');
        }

        // Graceful fallback: if the model fails to load, drop the viewer and
        // leave the original image in place.
        viewer.addEventListener('error', function () {
            if (viewer.parentNode === mount) {
                mount.removeChild(viewer);
            }
            if (fallbackImg) fallbackImg.style.display = '';
            mount.classList.remove('model-ready');
            mount.classList.add('model-failed');
        });

        viewer.addEventListener('load', function () {
            if (fallbackImg) fallbackImg.style.display = 'none';
            mount.classList.add('model-ready');
        });

        // Insert the viewer; keep the <img> as a hidden fallback (model-viewer
        // shows the poster until the model is ready, then our load handler
        // hides the duplicate <img>).
        mount.insertBefore(viewer, fallbackImg || null);
    }

    function init() {
        if (!('customElements' in window)) return; // very old browser: keep images
        var mounts = document.querySelectorAll('[data-model]');
        for (var i = 0; i < mounts.length; i++) {
            upgradeMount(mounts[i]);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
