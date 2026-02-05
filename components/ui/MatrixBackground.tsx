import { useEffect, useRef, useState } from "react";
// import "./MatrixBackground.scss";

import localFont from "next/font/local";

const matrixCodeNfi = localFont({
    src: [
        {
            path: "../../public/fonts/matrix_code_nfi.woff",
            //weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-matrix",
    fallback: ["monospace"],
});


type Dir = "none" | "left" | "right" | "up" | "down";

const chars = "!\"#$%&'()*+,-./:;<=>?[\\]^_{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");

const quotations = [
    "Follow the white rabbit.",
    "I'm trying to free your mind, Neo. But I can only show you the door. You're the one that has to walk through it.",
    "This your last chance. After this there is no turning back. You take the blue pill, the story ends. You wake up in your bed and believe whatever you want to. You take the red pill, you stay in Wonderland, and I show you how deep the rabbit hole goes. Remember, all I'm offering is the truth. Nothing more.",
    "Have you ever had a dream, Neo, that you were so sure was real? What if you were unable to wake from that dream, Neo? How would you know the difference between the dream world and the real world?",
    "The Matrix is the world that has been pulled over your eyes to blind you from the truth.",
    "What you know you can't explain, but you feel it. You've felt it your entire life, that there's something wrong with the world. You don't know what it is, but it's there, like a splinter in your mind, driving you mad.",
    "Unfortunately, no one can be told what the Matrix is. You have to see it for yourself.",
    "The Matrix is a system, Neo. That system is our enemy. But when you're inside, you look around, what do you see? Businessmen, teachers, lawyers, carpenters. The very minds of the people we are trying to save. But until we do, these people are still a part of that system and that makes them our enemy. You have to understand, most of these people are not ready to be unplugged. And many of them are so inert, so hopelessly dependent on the system that they will fight to protect it..",
    "I don't like the idea that I'm not in control of my life.",
    "Throughout human history, we have been dependent on machines to survive. Fate, it seems, is not without a sense of irony.",
    "What are you waiting for? You're faster than this. Don't think you are, know you are. Come on. Stop trying to hit me and hit me.",
    "If real is what you can feel, smell, taste and see, then 'real' is simply electrical signals interpreted by your brain.",
    "You have to let it all go, Neo. Fear, doubt, and disbelief, Free your mind.",
    "There is a difference between knowing the path and walking the path.",
    "To deny our impulses is to deny the very thing that makes us human.",
    "As long as the Matrix exists, the human race will never be free.",
];

const colorPalette: Record<string, string> = {
    lime: "#00FF00",
    olive: "#999900",
    mediumseagreen: "#3CB371",
    red: "#FF1A1A",
    deeppink: "#FF1493",
    fuchsia: "#FF00FF",
    orange: "#FFA500",
    yellow: "#FFFF00",
    blue: "#3333FF",
    dodgerblue: "#1E90FF",
    aqua: "#00FFFF",
    whitesmoke: "#F5F5F5",
};

function randomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function randomChar() {
    return chars[randomInt(chars.length)];
}

export default function MatrixBackground(): JSX.Element {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const [quotationIndex, setQuotationIndex] = useState<number>(0);
    const [showQuotation, setShowQuotation] = useState<boolean>(true);
    const [displayedQuotation, setDisplayedQuotation] = useState<string>("");

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        let fontSizeDefault = 30;
        let fontSize = fontSizeDefault;
        const density = 1.0;

        // Locked configuration per user request
        const waveXEnabled = false; // Waves X-Axis off
        const speedFactor = 1; // normal speed
        const bgColor = "rgb(30, 144, 255)"; // dodger blue

        const directionX: Record<Dir, number> = { left: -1, right: 1, none: 0, up: 0, down: 0 };
        const directionY: Record<Dir, number> = { down: 1, up: -1, none: 0, left: 0, right: 0 };
        let currentX: Dir = "none";
        let currentY: Dir = "down";

        let tickerInterval = Math.floor(40 * (1 / speedFactor));
        let tickerLast = 0;

        // Quotation ticker
        const quotationInterval = 120000; // 2 minutes
        const quotationDuration = 4000; // 4 seconds display
        let quotationTicker = 0;
        let quotationTimerLast = 0;

        let m: Array<any> = [];

        function setSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            fontSizeDefault = 30;
            fontSize = fontSizeDefault;
        }

        setSize();

        function fontSizeVariable() {
            return Math.floor((0.7 * Math.random() + 0.5) * fontSize);
        }

        function generateWave(coord: number, t: number) {
            return Math.floor(t * Math.sin(coord / t));
        }

        function createChar(e = 0) {
            const n = fontSizeVariable();
            let posY = 0;
            let posX = 0;
            let stopX = 0;
            let stopY = 0;

            if (currentY === "none") posY = randomInt(canvas.height);
            else if (currentY === "down") {
                posY = -n - e;
                stopY = Math.floor(randomInt(1.2 * canvas.height));
                if (stopY > canvas.height) stopY = canvas.height;
                stopY += n;
            } else if (currentY === "up") {
                posY = canvas.height + n + e;
                stopY = canvas.height - Math.floor(randomInt(1.2 * canvas.height));
                if (stopY < 0) stopY = 0;
                stopY -= n;
            }

            if (currentX === "none") posX = randomInt(canvas.width);
            else if (currentX === "right") {
                if (currentY !== "none") {
                    posX = randomInt(canvas.width) - randomInt(canvas.width) / 2;
                    posY = randomInt(canvas.height);
                    if (currentY === "down") posY -= n;
                    else posY += n;
                } else posX = -n - e;
                stopX = Math.floor(randomInt(1.2 * canvas.width));
                if (stopX > canvas.width) stopX = canvas.width;
            } else if (currentX === "left") {
                if (currentY !== "none") {
                    posX = randomInt(canvas.width) + randomInt(canvas.width) / 2;
                    posY = randomInt(canvas.height);
                    if (currentY === "down") posY -= n;
                    else posY += n;
                } else posX = canvas.width + n + e;
                stopX = randomInt(canvas.width) - Math.floor(randomInt(1.2 * canvas.width));
                if (stopX < -n) stopX = -n;
            }

            return { posX, posY, stopX, stopY, fontSize: n, prev: { posX: 0, posY: 0, char: "" } };
        }

        function init() {
            m = [];
            const numCols = Math.floor(density * canvas.width / fontSize);
            for (let i = 0; i < numCols; i++) m.push(createChar(2 * randomInt(canvas.height)));
        }

        function drawCharPrev(e: any) {
            ctx.font = `${e.fontSize}px monospace`;
            ctx.fillStyle = "#00FF00";
            ctx.globalCompositeOperation = "hard-light";
            ctx.fillText(e.prev.char, e.prev.posX, e.prev.posY);
        }

        function drawChar(e: any) {
            const n = randomChar();
            ctx.globalCompositeOperation = "source-atop";
            // ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

            ctx.fillStyle = "rgba(1, 3, 26, 0.09)";
            ctx.fillRect(e.posX - Math.floor(0.25 * e.fontSize), e.posY - Math.floor(0.8 * e.fontSize), e.fontSize, e.fontSize);
            drawCharPrev(e);
            ctx.font = `${e.fontSize}px monospace`;
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = "white";
            ctx.fillText(n, e.posX, e.posY);
            return n;
        }

        function clearScreen() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function draw(time: number) {
            if (!tickerLast || time >= tickerLast + tickerInterval) {
                tickerLast = time;
                // ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
                ctx.fillStyle = "rgba(1, 3, 26, 0.05)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                for (let i = 0; i < m.length; i++) {
                    let o = 0;
                    let iWave = 0;
                    let r = true;

                    if (waveXEnabled) {
                        let s = m[i].posY;
                        o = generateWave(s, m[i].fontSize);
                    }

                    m[i].posX += directionX[currentX] * m[i].fontSize + o;
                    m[i].posY += directionY[currentY] * m[i].fontSize + iWave;

                    if (currentY === "down") {
                        if (m[i].posY < m[i].stopY) {
                            if (m[i].posY >= 0) m[i].prev.char = drawChar(m[i]);
                        } else {
                            drawCharPrev(m[i]);
                            m[i] = createChar();
                        }
                    } else if (currentY === "up") {
                        if (m[i].posY > m[i].stopY) {
                            if (m[i].posY <= canvas.height) m[i].prev.char = drawChar(m[i]);
                        } else {
                            drawCharPrev(m[i]);
                            m[i] = createChar();
                        }
                    } else if (currentX === "right") {
                        if (m[i].posX < m[i].stopX) {
                            if (m[i].posX >= -m[i].fontSize) m[i].prev.char = drawChar(m[i]);
                        } else {
                            drawCharPrev(m[i]);
                            m[i] = createChar();
                        }
                    } else if (currentX === "left") {
                        if (m[i].posX > m[i].stopX) {
                            if (m[i].posX <= canvas.width) m[i].prev.char = drawChar(m[i]);
                        } else {
                            drawCharPrev(m[i]);
                            m[i] = createChar();
                        }
                    }

                    if (r) {
                        m[i].prev.posX = m[i].posX;
                        m[i].prev.posY = m[i].posY;
                    }
                }
            }

            // Handle quotation display
            if (showQuotation) {
                if (!quotationTicker || time >= quotationTicker + quotationInterval) {
                    quotationTicker = time;
                    const index = randomInt(quotations.length);
                    setDisplayedQuotation(quotations[index]);
                }

                if (quotationTicker && time >= quotationTicker + quotationDuration) {
                    setDisplayedQuotation("");
                }
            }

            rafRef.current = requestAnimationFrame(draw);
        }

        init();
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        rafRef.current = requestAnimationFrame(draw);

        function handleResize() {
            setSize();
            init();
        }

        window.addEventListener("resize", handleResize);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", handleResize);
        };
    }, [showQuotation]);

    const handleToggleQuotations = () => {
        setShowQuotation(!showQuotation);
        setDisplayedQuotation("");
    };

    return (
        <div className={`matrix-wrapper ${matrixCodeNfi.className}`} aria-hidden>

            <canvas ref={canvasRef} className="matrix-canvas" />

            {displayedQuotation && (
                <div className="matrix-quotation">
                    <p>{displayedQuotation}</p>
                </div>
            )}

            <div className="matrix-controls">
                <button onClick={handleToggleQuotations} title="Toggle Quotations">
                    {showQuotation ? "Q" : "q"}
                </button>
            </div>
        </div>
    );
}