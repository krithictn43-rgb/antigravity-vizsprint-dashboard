/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563eb', // Darker blue for WCAG AA compliance (contrast > 4.5:1 on white)
                secondary: '#64748b',
                dark: '#0f172a',
                light: '#f8fafc',
            },
        },
    },
    plugins: [],
}
