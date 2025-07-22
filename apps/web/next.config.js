/** @type {import('next').NextConfig} */
export default {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:8000/api/:path*"
            }
        ]
    }
};
// "http://draw_backend_running:8000/api/:path*"