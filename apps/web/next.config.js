/** @type {import('next').NextConfig} */
export default {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://drawexcali.onrender.com/api/:path*"
            }
        ]
    }
};
// "http://draw_backend_running:8000/api/:path*"
// "http://localhost:8000/api/:path*"