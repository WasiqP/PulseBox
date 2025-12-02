import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        // Add subtle fog for depth
        scene.fog = new THREE.FogExp2(0x000000, 0.002);

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 30;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Objects
        const geometry = new THREE.IcosahedronGeometry(1, 0);
        const material = new THREE.MeshBasicMaterial({
            color: 0xA060FF,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        const shapes: THREE.Mesh[] = [];
        const shapeCount = 40;

        for (let i = 0; i < shapeCount; i++) {
            const mesh = new THREE.Mesh(geometry, material);

            // Random position spread
            mesh.position.x = (Math.random() - 0.5) * 60;
            mesh.position.y = (Math.random() - 0.5) * 40;
            mesh.position.z = (Math.random() - 0.5) * 30;

            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;

            // Random scale
            const scale = Math.random() * 1.5 + 0.5;
            mesh.scale.set(scale, scale, scale);

            // Custom properties for animation
            (mesh as any).userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01
                },
                floatSpeed: (Math.random() * 0.02) + 0.005,
                initialY: mesh.position.y
            };

            scene.add(mesh);
            shapes.push(mesh);
        }

        // Animation loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            shapes.forEach((mesh) => {
                mesh.rotation.x += (mesh as any).userData.rotationSpeed.x;
                mesh.rotation.y += (mesh as any).userData.rotationSpeed.y;

                // Floating effect
                mesh.position.y += (mesh as any).userData.floatSpeed;

                // Reset position if it goes too high
                if (mesh.position.y > 25) {
                    mesh.position.y = -25;
                }
            });

            // Slowly rotate entire scene
            scene.rotation.y += 0.001;

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            if (!container) return;
            const width = container.clientWidth;
            const height = container.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (container && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                opacity: 0.8,
                overflow: 'hidden'
            }}
        />
    );
};

export default ThreeBackground;
