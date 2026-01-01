import { useEffect, useRef } from 'react';

const GridBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Configuration: Adjust these values to match your website's theme
    const config = {
        gridSize: 40,               // Spacing between lines
        lineColor: [199, 210, 254], // RGB value for Indigo-200
        // lineColor: [255, 255, 255], // Use this for Dark mode
        maxOpacity: 0.2,            // Grid line opacity
        maskRadius: 450,            // Size of the spotlight effect
        maxDotRadius: 3,            // Max size of the dots
        dotOpacity: 0.3,            // Opacity of the dots
        lerpFactor: 0.07,           // How fast the spotlight follows the mouse (0-1)
        wanderSpeed: 2.0            // INCREASED: Cruising speed for idle animation
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let idleTimeout: ReturnType<typeof setTimeout>;

        // Animation State
        const state = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            targetX: window.innerWidth / 2,
            targetY: window.innerHeight / 2,
            isHovering: false,
            // Velocity for the wandering phase
            vx: 1.5,
            vy: 1.2
        };

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            const width = window.innerWidth;
            const height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(dpr, dpr);

            if (!state.isHovering) {
                state.targetX = width / 2;
                state.targetY = height / 2;
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            state.targetX = e.clientX;
            state.targetY = e.clientY;
            state.isHovering = true;

            // Reset idle timer
            clearTimeout(idleTimeout);
            idleTimeout = setTimeout(() => {
                state.isHovering = false;
                // Pick a random direction to start wandering again
                const angle = Math.random() * Math.PI * 2;
                state.vx = Math.cos(angle) * config.wanderSpeed;
                state.vy = Math.sin(angle) * config.wanderSpeed;
            }, 2500);
        };

        const handleMouseLeave = () => {
            state.isHovering = false;
            clearTimeout(idleTimeout);
        };

        // Attach Event Listeners
        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        // --- Animation Loop ---
        const drawGrid = (timestamp: number) => {
            const timeInSeconds = timestamp * 0.001;
            const width = window.innerWidth;
            const height = window.innerHeight;

            ctx.clearRect(0, 0, width, height);

            // 1. Calculate Target Position (Wandering Logic)
            if (!state.isHovering) {
                // Steering: Gently steer the velocity vector over time
                // Lower frequency (0.3, 0.5) creates wider, smoother turns
                const turnRate = 0.05;
                state.vx += Math.sin(timeInSeconds * 0.5) * turnRate;
                state.vy += Math.cos(timeInSeconds * 0.3) * turnRate;

                // Normalization: Force constant speed so it never stops or gets stuck
                const currentSpeed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
                if (currentSpeed > 0) {
                    state.vx = (state.vx / currentSpeed) * config.wanderSpeed;
                    state.vy = (state.vy / currentSpeed) * config.wanderSpeed;
                }

                // Apply velocity
                state.targetX += state.vx;
                state.targetY += state.vy;

                // Bounce off screen edges with a margin
                const margin = config.maskRadius / 2;

                if (state.targetX < margin) {
                    state.targetX = margin;
                    state.vx = Math.abs(state.vx); // Force move right
                } else if (state.targetX > width - margin) {
                    state.targetX = width - margin;
                    state.vx = -Math.abs(state.vx); // Force move left
                }

                if (state.targetY < margin) {
                    state.targetY = margin;
                    state.vy = Math.abs(state.vy); // Force move down
                } else if (state.targetY > height - margin) {
                    state.targetY = height - margin;
                    state.vy = -Math.abs(state.vy); // Force move up
                }
            }

            // 2. Smooth Movement (Linear Interpolation)
            state.x += (state.targetX - state.x) * config.lerpFactor;
            state.y += (state.targetY - state.y) * config.lerpFactor;

            // 3. Create Gradient Mask
            const gradient = ctx.createRadialGradient(
                state.x, state.y, 0,
                state.x, state.y, config.maskRadius
            );
            gradient.addColorStop(0, `rgba(${config.lineColor.join(',')}, ${config.maxOpacity})`);
            gradient.addColorStop(0.5, `rgba(${config.lineColor.join(',')}, ${config.maxOpacity * 0.5})`);
            gradient.addColorStop(1, `rgba(${config.lineColor.join(',')}, 0)`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;

            // 4. Draw Grid Lines
            ctx.beginPath();
            for (let x = 0; x <= width; x += config.gridSize) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }
            for (let y = 0; y <= height; y += config.gridSize) {
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();

            // 5. Draw Interactive Dots
            const closeRadius = config.maskRadius * 0.8;
            const startX = Math.floor((state.x - closeRadius) / config.gridSize) * config.gridSize;
            const endX = Math.ceil((state.x + closeRadius) / config.gridSize) * config.gridSize;
            const startY = Math.floor((state.y - closeRadius) / config.gridSize) * config.gridSize;
            const endY = Math.ceil((state.y + closeRadius) / config.gridSize) * config.gridSize;

            for (let x = startX; x <= endX; x += config.gridSize) {
                for (let y = startY; y <= endY; y += config.gridSize) {
                    if (x >= 0 && x <= width && y >= 0 && y <= height) {
                        const dx = x - state.x;
                        const dy = y - state.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < closeRadius) {
                            const intensity = 1 - (dist / closeRadius);
                            ctx.fillStyle = `rgba(79, 70, 229, ${intensity * config.dotOpacity})`;
                            ctx.beginPath();
                            const radius = config.maxDotRadius * intensity;
                            ctx.arc(x, y, radius, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            }

            animationFrameId = requestAnimationFrame(drawGrid);
        };

        animationFrameId = requestAnimationFrame(drawGrid);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(idleTimeout);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute', // Changed from fixed to absolute to stay within hero
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                backgroundColor: 'transparent'
            }}
        />
    );
};

export default GridBackground;
