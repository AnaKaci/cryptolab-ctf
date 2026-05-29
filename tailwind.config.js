var config = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                lab: {
                    bg: "#071012",
                    panel: "#0d1b1e",
                    panel2: "#11262a",
                    cyan: "#42f4ff",
                    mint: "#34f5a6",
                    amber: "#ffd166",
                    rose: "#ff5c8a",
                    violet: "#b68cff"
                }
            },
            boxShadow: {
                glow: "0 0 24px rgba(66, 244, 255, 0.18)",
                mint: "0 0 28px rgba(52, 245, 166, 0.16)"
            },
            fontFamily: {
                display: ["Inter", "ui-sans-serif", "system-ui"],
                mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
            }
        }
    },
    plugins: []
};
export default config;
