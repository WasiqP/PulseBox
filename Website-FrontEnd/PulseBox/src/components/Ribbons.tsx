import React, { useEffect, useRef } from 'react';
import { Renderer, Transform, Vec3, Color, Polyline } from 'ogl';

import './Ribbons.css';

interface RibbonsProps {
  colors?: string[];
  baseSpring?: number;
  baseFriction?: number;
  baseThickness?: number;
  offsetFactor?: number;
  maxAge?: number;
  pointCount?: number;
  speedMultiplier?: number;
  enableFade?: boolean;
  enableShaderEffect?: boolean;
  effectAmplitude?: number;
  backgroundColor?: number[];
}

const Ribbons: React.FC<RibbonsProps> = ({
  colors = ['#ff9346', '#7cff67', '#ffee51', '#5227FF'],
  baseSpring = 0.03,
  baseFriction = 0.9,
  baseThickness = 30,
  offsetFactor = 0.05,
  maxAge = 500,
  pointCount = 50,
  speedMultiplier = 0.6,
  enableFade = false,
  enableShaderEffect = false,
  effectAmplitude = 2,
  backgroundColor = [0, 0, 0, 0]
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ 
      dpr: Math.min(window.devicePixelRatio || 2, 2), 
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    const gl = renderer.gl;
    if (Array.isArray(backgroundColor) && backgroundColor.length === 4) {
      gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);
    } else {
      gl.clearColor(0, 0, 0, 0);
    }

    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    container.appendChild(gl.canvas);

    const scene = new Transform();
    const lines: {
      spring: number;
      friction: number;
      mouseVelocity: Vec3;
      mouseOffset: Vec3;
      points: Vec3[];
      polyline: Polyline;
    }[] = [];

    const vertex = `
      precision highp float;
      
      attribute vec3 position;
      attribute vec3 next;
      attribute vec3 prev;
      attribute vec2 uv;
      attribute float side;
      
      uniform vec2 uResolution;
      uniform float uDPR;
      uniform float uThickness;
      uniform float uTime;
      uniform float uEnableShaderEffect;
      uniform float uEffectAmplitude;
      
      varying vec2 vUV;
      
      vec4 getPosition() {
          vec4 current = vec4(position, 1.0);
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          vec2 nextScreen = next.xy * aspect;
          vec2 prevScreen = prev.xy * aspect;
          vec2 tangent = normalize(nextScreen - prevScreen);
          vec2 normal = vec2(-tangent.y, tangent.x);
          normal /= aspect;
          normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
          float dist = length(nextScreen - prevScreen);
          normal *= smoothstep(0.0, 0.02, dist);
          float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
          float pixelWidth = current.w * pixelWidthRatio;
          normal *= pixelWidth * uThickness;
          current.xy -= normal * side;
          if(uEnableShaderEffect > 0.5) {
            current.xy += normal * sin(uTime + current.x * 10.0) * uEffectAmplitude;
          }
          return current;
      }
      
      void main() {
          vUV = uv;
          gl_Position = getPosition();
      }
    `;

    const fragment = `
      precision highp float;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uEnableFade;
      varying vec2 vUV;
      void main() {
          float fadeFactor = 1.0;
          if(uEnableFade > 0.5) {
              fadeFactor = 1.0 - smoothstep(0.0, 1.0, vUV.y);
          }
          gl_FragColor = vec4(uColor, uOpacity * fadeFactor);
      }
    `;

    function resize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      lines.forEach(line => line.polyline.resize());
    }
    window.addEventListener('resize', resize);

    const center = (colors.length - 1) / 2;
    colors.forEach((color, index) => {
      const spring = baseSpring + (Math.random() - 0.5) * 0.05;
      const friction = baseFriction + (Math.random() - 0.5) * 0.05;
      const thickness = baseThickness + (Math.random() - 0.5) * 3;
      const mouseOffset = new Vec3(
        (index - center) * offsetFactor + (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.1,
        0
      );

      const line = {
        spring,
        friction,
        mouseVelocity: new Vec3(),
        mouseOffset,
        points: [] as Vec3[],
        polyline: {} as Polyline
      };

      const count = pointCount;
      const points: Vec3[] = [];
      for (let i = 0; i < count; i++) {
        points.push(new Vec3());
      }
      line.points = points;

      line.polyline = new Polyline(gl, {
        points,
        vertex,
        fragment,
        uniforms: {
          uColor: { value: new Color(color) },
          uThickness: { value: thickness },
          uOpacity: { value: 1.0 },
          uTime: { value: 0.0 },
          uEnableShaderEffect: { value: 0.0 },
          uEffectAmplitude: { value: effectAmplitude },
          uEnableFade: { value: enableFade ? 1.0 : 0.0 }
        }
      });
      line.polyline.mesh.setParent(scene);
      lines.push(line);
    });

    resize();

    const mouse = new Vec3();
    function updateMouse(e: MouseEvent | TouchEvent) {
      let x: number, y: number;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if ('changedTouches' in e && e.changedTouches.length) {
        x = e.changedTouches[0].clientX - rect.left;
        y = e.changedTouches[0].clientY - rect.top;
      } else if (e instanceof MouseEvent) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      } else {
        x = 0;
        y = 0;
      }
      const width = container.clientWidth;
      const height = container.clientHeight;
      mouse.set((x / width) * 2 - 1, (y / height) * -2 + 1, 0);
    }
    
    // Listen to mouse events on the container
    container.addEventListener('mousemove', updateMouse);
    container.addEventListener('touchstart', updateMouse);
    container.addEventListener('touchmove', updateMouse);
    
    // Also listen globally to track mouse even when over other elements
    function updateMouseGlobal(e: MouseEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = container.clientWidth;
      const height = container.clientHeight;
      mouse.set((x / width) * 2 - 1, (y / height) * -2 + 1, 0);
    }
    document.addEventListener('mousemove', updateMouseGlobal);
    
    // Detect when mouse is over interactive elements (inputs, buttons, links)
    function checkInteractiveElements(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target) {
        isPausedRef.current = false;
        return;
      }
      
      // Check if target or its parent is an interactive element
      const isInteractive = target.matches('input, button, a, label, textarea, select') ||
                            target.closest('input, button, a, label, textarea, select') !== null ||
                            target.closest('.form-group, .auth-form, .auth-actions') !== null;
      
      isPausedRef.current = isInteractive;
    }
    
    // Check if input is focused (for when typing without mouse movement)
    function checkInputFocus() {
      const hasFocusedInput = document.body.hasAttribute('data-input-focused') ||
                              document.activeElement?.matches('input, textarea, select');
      if (hasFocusedInput) {
        isPausedRef.current = true;
      }
    }
    
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && !target.matches('input, button, a, label, textarea, select') && 
          !target.closest('input, button, a, label, textarea, select')) {
        // Only unpause if no input is focused
        checkInputFocus();
        if (!isPausedRef.current) {
          isPausedRef.current = false;
        }
      }
    };
    
    const handleFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        isPausedRef.current = true;
      }
    };
    
    const handleFocusOut = () => {
      // Small delay to check if focus moved to another input
      setTimeout(() => {
        checkInputFocus();
        if (!document.body.hasAttribute('data-input-focused') && 
            !document.activeElement?.matches('input, textarea, select')) {
          isPausedRef.current = false;
        }
      }, 10);
    };
    
    document.addEventListener('mouseover', checkInteractiveElements);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    const tmp = new Vec3();
    let frameId: number;
    let lastTime = performance.now();
    function update() {
      frameId = requestAnimationFrame(update);
      
      // Check input focus state on each frame
      checkInputFocus();
      
      const currentTime = performance.now();
      const dt = currentTime - lastTime;
      lastTime = currentTime;

      // If paused, reduce movement significantly or skip rendering
      const pauseFactor = isPausedRef.current ? 0.05 : 1.0;
      
      // Skip most of the animation work when paused
      if (isPausedRef.current) {
        renderer.render({ scene });
        return;
      }

      lines.forEach(line => {
        if (!isPausedRef.current) {
          tmp.copy(mouse).add(line.mouseOffset).sub(line.points[0]).multiply(line.spring);
          line.mouseVelocity.add(tmp).multiply(line.friction);
          line.points[0].add(line.mouseVelocity);
        } else {
          // When paused, gradually slow down movement
          line.mouseVelocity.multiply(0.95);
          line.points[0].add(line.mouseVelocity);
        }

        for (let i = 1; i < line.points.length; i++) {
          if (isFinite(maxAge) && maxAge > 0) {
            const segmentDelay = maxAge / (line.points.length - 1);
            const alpha = Math.min(1, (dt * speedMultiplier * pauseFactor) / segmentDelay);
            line.points[i].lerp(line.points[i - 1], alpha);
          } else {
            line.points[i].lerp(line.points[i - 1], 0.9 * pauseFactor);
          }
        }
        if (line.polyline.mesh.program.uniforms.uTime) {
          line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001;
        }
        line.polyline.updateGeometry();
      });

      renderer.render({ scene });
    }
    update();

    return () => {
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', updateMouse);
      container.removeEventListener('touchstart', updateMouse);
      container.removeEventListener('touchmove', updateMouse);
      document.removeEventListener('mousemove', updateMouseGlobal);
      document.removeEventListener('mouseover', checkInteractiveElements);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      cancelAnimationFrame(frameId);
      if (gl.canvas && gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
    };
  }, [
    colors,
    baseSpring,
    baseFriction,
    baseThickness,
    offsetFactor,
    maxAge,
    pointCount,
    speedMultiplier,
    enableFade,
    enableShaderEffect,
    effectAmplitude,
    backgroundColor
  ]);

  return <div ref={containerRef} className="ribbons-container" />;
};

export default Ribbons;
