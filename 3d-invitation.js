/* ==========================================================================
   Elegance & Heritage — 3D Interactive Fine Art Wedding Invitation (Three.js WebGL)
   ========================================================================== */

class Invitation3DEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.envelopeGroup = null;
        this.waxSeal = null;
        this.topFlap = null;
        this.invitationCard = null;
        
        this.isUnsealed = false;
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.targetRotation = { x: 0.2, y: -0.3 };

        this.init();
    }

    init() {
        if (typeof THREE === 'undefined') {
            this.renderFallback();
            return;
        }

        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 500;

        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.background = null;

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 12);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);

        // 4. Fine Art Soft Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        this.scene.add(ambientLight);

        const warmSpotLight = new THREE.SpotLight(0xFDF4E3, 1.4);
        warmSpotLight.position.set(10, 15, 10);
        warmSpotLight.castShadow = true;
        this.scene.add(warmSpotLight);

        const softBlueLight = new THREE.DirectionalLight(0x9FB1BD, 0.6);
        softBlueLight.position.set(-10, -10, -5);
        this.scene.add(softBlueLight);

        // 5. Build 3D Envelope Object with Reference Palette Colors
        this.create3DEnvelope();

        // 6. Event Listeners
        this.addInteractionListeners();

        // 7. Animation Loop
        this.animate();
    }

    create3DEnvelope() {
        this.envelopeGroup = new THREE.Group();

        // Envelope Base Pocket Geometry — Dusty Blue Material (#9FB1BD)
        const pocketGeo = new THREE.BoxGeometry(5.5, 3.8, 0.2);
        const dustyBlueMat = new THREE.MeshStandardMaterial({
            color: 0x9FB1BD,
            roughness: 0.4,
            metalness: 0.1
        });
        const pocketMesh = new THREE.Mesh(pocketGeo, dustyBlueMat);
        this.envelopeGroup.add(pocketMesh);

        // Gold Foil Trim Border
        const trimGeo = new THREE.BoxGeometry(5.6, 3.9, 0.05);
        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xD4AF37,
            roughness: 0.2,
            metalness: 0.8
        });
        const trimMesh = new THREE.Mesh(trimGeo, goldMat);
        trimMesh.position.z = -0.1;
        this.envelopeGroup.add(trimMesh);

        // Top Triangular Flap
        const flapShape = new THREE.Shape();
        flapShape.moveTo(-2.75, 0);
        flapShape.lineTo(2.75, 0);
        flapShape.lineTo(0, -1.9);
        flapShape.closePath();

        const extrudeSettings = { depth: 0.05, bevelEnabled: false };
        const flapGeo = new THREE.ExtrudeGeometry(flapShape, extrudeSettings);
        this.topFlap = new THREE.Mesh(flapGeo, dustyBlueMat);
        this.topFlap.position.set(0, 1.9, 0.11);
        this.envelopeGroup.add(this.topFlap);

        // 3D Wax Seal Monogram — Fine Art Muted Rose Material (#D49B92)
        const sealGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 32);
        const roseWaxMat = new THREE.MeshStandardMaterial({
            color: 0xD49B92,
            roughness: 0.3,
            metalness: 0.2
        });
        this.waxSeal = new THREE.Mesh(sealGeo, roseWaxMat);
        this.waxSeal.rotation.x = Math.PI / 2;
        this.waxSeal.position.set(0, 0, 0.22);
        this.envelopeGroup.add(this.waxSeal);

        // Inner Fine Art Gilded Invitation Card — Fine Ivory Paper (#FAF8F5)
        const cardGeo = new THREE.BoxGeometry(5.0, 3.4, 0.08);
        const cardMat = new THREE.MeshStandardMaterial({
            color: 0xFAF8F5,
            roughness: 0.3,
            metalness: 0.1
        });
        this.invitationCard = new THREE.Mesh(cardGeo, cardMat);
        this.invitationCard.position.set(0, 0, 0.05);
        this.envelopeGroup.add(this.invitationCard);

        this.envelopeGroup.rotation.x = this.targetRotation.x;
        this.envelopeGroup.rotation.y = this.targetRotation.y;

        this.scene.add(this.envelopeGroup);
    }

    addInteractionListeners() {
        const dom = this.container;

        dom.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        dom.addEventListener('mousemove', (e) => {
            if (!this.isDragging) {
                const rect = dom.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left) / dom.clientWidth - 0.5;
                const mouseY = (e.clientY - rect.top) / dom.clientHeight - 0.5;
                this.targetRotation.y = mouseX * 0.8;
                this.targetRotation.x = mouseY * 0.5;
                return;
            }

            const deltaX = e.clientX - this.previousMousePosition.x;
            const deltaY = e.clientY - this.previousMousePosition.y;

            this.targetRotation.y += deltaX * 0.01;
            this.targetRotation.x += deltaY * 0.01;

            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => { this.isDragging = false; });
    }

    toggleUnseal() {
        if (!this.envelopeGroup) return;
        
        this.isUnsealed = !this.isUnsealed;
        
        if (this.isUnsealed) {
            let progress = 0;
            const animateOpen = () => {
                if (progress < 1) {
                    progress += 0.05;
                    this.topFlap.rotation.x = progress * Math.PI;
                    this.invitationCard.position.y = progress * 2.2;
                    this.invitationCard.position.z = 0.3;
                    requestAnimationFrame(animateOpen);
                }
            };
            animateOpen();
        } else {
            this.topFlap.rotation.x = 0;
            this.invitationCard.position.y = 0;
            this.invitationCard.position.z = 0.05;
        }
    }

    rotateContinuous() {
        this.targetRotation.y += Math.PI / 2;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.envelopeGroup) {
            this.envelopeGroup.rotation.x += (this.targetRotation.x - this.envelopeGroup.rotation.x) * 0.1;
            this.envelopeGroup.rotation.y += (this.targetRotation.y - this.envelopeGroup.rotation.y) * 0.1;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    renderFallback() {
        this.container.innerHTML = `
            <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:2rem; background:#F7F5F0; color:#1E293B;">
                <i data-lucide="box" style="width:48px; height:48px; margin-bottom:1rem; color:#D49B92;"></i>
                <h3>3D Motion Invitation Card</h3>
                <p style="color:#64748B; max-width:400px; margin:0.5rem 0 1.5rem 0;">Experience the high-definition motion video fallback preview.</p>
                <img src="${generateSVGDataURI('The Digital Invitation', '3D Motion Preview', '#F7F5F0', '#EFECE6', '#D49B92')}" style="max-width:320px; border:1px solid #D49B92; border-radius:8px;" alt="Fallback Preview">
            </div>
        `;
    }
}
