import { useEffect, useRef } from 'react';

interface GridBackgroundProps {
    lineColor?: number[];
    dotColor?: number[];
    blockColor?: number[];
    maxOpacity?: number;
    darkLineColor?: number[];
    darkDotColor?: number[];
    darkBlockColor?: number[];
}

const GridBackground = ({
    lineColor,
    dotColor,
    blockColor,
    maxOpacity,
    darkLineColor,
    darkDotColor,
    darkBlockColor
}: GridBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Configuration
    const config = {
        gridSize: 32,               // Size of the square blocks
        lineColor: lineColor || [203, 213, 225], // Slate-300
        blockColor: blockColor || [59, 130, 246], // Blue-500
        dotColor: dotColor || [99, 102, 241],   // cyan-500
        maxOpacity: maxOpacity !== undefined ? maxOpacity : 0.1, // Grid line opacity
        maskRadius: 550,            // Size of the spotlight effect

        // Dot settings
        dotRadius: 2,

        // Block settings
        symbolSize: 14,
        // Increased base density to ensure center is populated
        blockDensity: 0.4,
        blockPulseSpeed: 0.8,

        // Movement settings
        lerpFactor: 0.07,
        wanderSpeed: 3.0,

        // Symbols
        symbols: ['+', '×', '÷', '−', 'π', '√', '∑', '∫', '∞', '∆', 'θ', 'λ', '≈', 'α', 'β']
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let idleTimeout: ReturnType<typeof setTimeout>;

        // Dark mode state tracking
        const isDarkRef = { current: document.documentElement.classList.contains('dark') };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    isDarkRef.current = document.documentElement.classList.contains('dark');
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        // Animation State
        const state = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            targetX: window.innerWidth / 2,
            targetY: window.innerHeight / 2,
            isHovering: false,
            vx: 1.5,
            vy: 1.2
        };

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            // Use parent element dimensions if available, otherwise fallback to window
            const parent = canvas.parentElement;
            const width = parent ? parent.clientWidth : window.innerWidth;
            const height = parent ? parent.clientHeight : window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(dpr, dpr);
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';

            if (!state.isHovering) {
                state.targetX = width / 2;
                state.targetY = height / 2;
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            // Calculate mouse position relative to the canvas
            state.targetX = e.clientX - rect.left;
            state.targetY = e.clientY - rect.top;
            state.isHovering = true;

            clearTimeout(idleTimeout);
            idleTimeout = setTimeout(() => {
                state.isHovering = false;
                const angle = Math.random() * Math.PI * 2;
                state.vx = Math.cos(angle) * config.wanderSpeed;
                state.vy = Math.sin(angle) * config.wanderSpeed;
            }, 2500);
        };

        const handleMouseLeave = () => {
            state.isHovering = false;
            clearTimeout(idleTimeout);
        };

        handleResize();

        // Use ResizeObserver for more robust resizing
        const resizeObserver = new ResizeObserver(() => handleResize());
        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        const drawGrid = (timestamp: number) => {
            const timeInSeconds = timestamp * 0.001;
            // Use canvas logical size (divided by dpr) for drawing calculations
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            const isDark = isDarkRef.current;

            let currentLineColor = config.lineColor;
            let currentBlockColor = config.blockColor;
            let currentDotColor = config.dotColor;

            if (isDark) {
                if (darkLineColor) currentLineColor = darkLineColor;
                else if (!lineColor) currentLineColor = [30, 41, 59]; // Default dark if no custom dark color

                if (darkBlockColor) currentBlockColor = darkBlockColor;
                else if (!blockColor) currentBlockColor = [96, 165, 250];

                if (darkDotColor) currentDotColor = darkDotColor;
                else if (!dotColor) currentDotColor = [129, 140, 248];
            }

            ctx.clearRect(0, 0, width, height);

            // --- 1. Wandering Movement Logic ---
            if (!state.isHovering) {
                const turnRate = 0.05;
                state.vx += Math.sin(timeInSeconds * 0.5) * turnRate;
                state.vy += Math.cos(timeInSeconds * 0.3) * turnRate;

                const currentSpeed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
                if (currentSpeed > 0) {
                    state.vx = (state.vx / currentSpeed) * config.wanderSpeed;
                    state.vy = (state.vy / currentSpeed) * config.wanderSpeed;
                }

                state.targetX += state.vx;
                state.targetY += state.vy;

                const margin = config.maskRadius / 2;
                if (state.targetX < margin) { state.targetX = margin; state.vx = Math.abs(state.vx); }
                else if (state.targetX > width - margin) { state.targetX = width - margin; state.vx = -Math.abs(state.vx); }
                if (state.targetY < margin) { state.targetY = margin; state.vy = Math.abs(state.vy); }
                else if (state.targetY > height - margin) { state.targetY = height - margin; state.vy = -Math.abs(state.vy); }
            }

            // Smooth Position Tracking
            state.x += (state.targetX - state.x) * config.lerpFactor;
            state.y += (state.targetY - state.y) * config.lerpFactor;

            // --- 2. Draw Grid Lines ---
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${currentLineColor.join(',')}, ${config.maxOpacity})`;
            ctx.lineWidth = 1;

            for (let x = 0; x <= width; x += config.gridSize) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }
            for (let y = 0; y <= height; y += config.gridSize) {
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();

            // --- 3. Draw Elements inside Spotlight ---
            const closeRadius = config.maskRadius;

            const startX = Math.floor((state.x - closeRadius) / config.gridSize) * config.gridSize;
            const endX = Math.ceil((state.x + closeRadius) / config.gridSize) * config.gridSize;
            const startY = Math.floor((state.y - closeRadius) / config.gridSize) * config.gridSize;
            const endY = Math.ceil((state.y + closeRadius) / config.gridSize) * config.gridSize;

            ctx.font = `500 ${config.symbolSize}px "Menlo", "Consolas", monospace`;

            for (let x = startX; x <= endX; x += config.gridSize) {
                for (let y = startY; y <= endY; y += config.gridSize) {
                    if (x >= 0 && x <= width && y >= 0 && y <= height) {
                        const centerX = x + config.gridSize / 2;
                        const centerY = y + config.gridSize / 2;

                        const dx = centerX - state.x;
                        const dy = centerY - state.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < closeRadius) {
                            const spotlightIntensity = 1 - (dist / closeRadius);

                            // --- A. Draw DOTS ---
                            // Apply cubic falloff to opacity to concentrate dots near focus
                            const dotAlpha = Math.pow(spotlightIntensity, 3) * 0.8;
                            ctx.fillStyle = `rgba(${currentDotColor.join(',')}, ${dotAlpha})`;
                            ctx.beginPath();
                            const r = config.dotRadius * (0.5 + spotlightIntensity * 0.5);
                            ctx.arc(x, y, r, 0, Math.PI * 2);
                            ctx.fill();

                            // --- B. Draw Random BLOCKS ---
                            const randomVal = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;

                            // ULTRA Sharp Focus: Use Math.pow(..., 6) instead of 3
                            // This creates a very steep falloff, constraining blocks to the immediate center
                            const localDensity = config.blockDensity * Math.pow(spotlightIntensity, 6);

                            if (randomVal > (1 - localDensity)) {
                                const pulseFreq = config.blockPulseSpeed + (randomVal * 0.5);
                                const timeOffset = randomVal * 10;
                                const pulse = (Math.sin(timeInSeconds * pulseFreq + timeOffset) + 1) / 2;

                                // Reduced block opacity slightly (was 0.25 -> 0.2)
                                const blockAlpha = spotlightIntensity * pulse * 0.2;

                                // Draw Block (No Padding - Fills Full Square)
                                ctx.fillStyle = `rgba(${currentBlockColor.join(',')}, ${blockAlpha})`;
                                ctx.fillRect(
                                    x,
                                    y,
                                    config.gridSize,
                                    config.gridSize
                                );

                                // Draw Symbol
                                const symbolIndex = Math.floor((randomVal * 100)) % config.symbols.length;
                                const symbol = config.symbols[symbolIndex];

                                const symbolAlpha = spotlightIntensity * pulse * 0.9;
                                ctx.fillStyle = `rgba(${currentBlockColor.join(',')}, ${symbolAlpha})`;
                                ctx.fillText(symbol, centerX, centerY);
                            }
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
            resizeObserver.disconnect();
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
            clearTimeout(idleTimeout);
        };
    }, [lineColor, dotColor, blockColor, maxOpacity, darkLineColor, darkDotColor, darkBlockColor]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
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
