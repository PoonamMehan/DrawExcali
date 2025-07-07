import styles from "./page.module.css";
import { Palette, Sparkles, Users, ArrowRight, Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    // <div className={styles.page}>
    //   <Link href="/signup">
    //     <button>Sign Up</button>
    //   </Link>
    //   <Link href="/login">
    //     <button>Sign In</button>
    //   </Link>
    // </div>
    <div className={`min-h-screen bg-black text-white overflow-hidden ${styles}`}>
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center space-x-2">
          <Palette className="h-8 w-8 text-blue-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            DrawAI
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/login">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-[rgba(241, 245, 249, 1)] hover:text-[rgba(15, 23, 42, 1)] h-10 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800">
            Login
          </button>
          </Link>
          <Link href="/signup">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[rgba(15, 23, 42, 1)] text-[rgba(248, 250, 252, 1)] hover:bg-[rgba(15, 23, 42, 0.9)] h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-yellow-600 hover:from-blue-700 hover:to-yellow-700 text-white border-0">
            Sign Up
          </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-6 md:px-8 py-16 md:py-24">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Create Flowcharts with{" "}
              <span className="bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your text into easy to understand and remember flowcharts. Draw, learn and study together on a COLLABORATIVE CANVAS, in an environment powered by AI.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[rgba(15, 23, 42, 1)] text-[rgba(248, 250, 252, 1)] hover:bg-[rgba(15, 23, 42, 0.9)] h-11 rounded-md px-8 bg-gradient-to-r from-blue-600 to-yellow-600 hover:from-blue-700 hover:to-yellow-700 text-white border-0 px-8 py-6 text-lg group">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            </Link>
            <Link href="/signup">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0  border border-input bg-background hover:bg-[rgba(241, 245, 249, 1)] hover:text-[rgba(15, 23, 42, 1)]  h-11 rounded-md px-8 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 px-8 py-6 text-lg">
              Watch Demo
            </button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="rounded-lg border  text-[rgba(2, 8, 23, 1)] shadow-sm bg-gray-900/50 border-gray-800 p-6 hover:bg-gray-900/70 transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">AI-Powered</h3>
                <p className="text-gray-400">
                  Advanced AI to help you convert your text into easy to remember flowcharts
                </p>
              </div>
            </div>

            <div className="rounded-lg border text-[rgba(2, 8, 23, 1)] shadow-sm bg-gray-900/50 border-gray-800 p-6 hover:bg-gray-900/70 transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Collaborative Canvas</h3>
                <p className="text-gray-400">
                  Provides a canvas to draw, write and create with other people online 
                </p>
              </div>
            </div>

            <div className="rounded-lg border text-[rgba(2, 8, 23, 1)] shadow-sm bg-gray-900/50 border-gray-800 p-6 hover:bg-gray-900/70 transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Unlimited Creativity</h3>
                <p className="text-gray-400">
                  Gives you head start in your creativity with many off-the-shelf shape templates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Create
            <span className="bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
              {" "}Magic?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students, teachers and learners who are already using DrawAI to learn effectively using visuals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0  bg-[rgba(15, 23, 42, 1)] text-[rgba(248, 250, 252, 1)] hover:bg-[rgba(15, 23, 42, 0.9)]  h-11 rounded-md px-8 h-11 rounded-md px-8 bg-gradient-to-r from-blue-600 to-yellow-600 hover:from-blue-700 hover:to-yellow-700 text-white border-0 px-8 py-6 text-lg">
              Start Creating Now
            </button>
            </Link>
            <Link href="/signup">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0  hover:bg-[rgba(241, 245, 249, 1)] hover:text-[rgba(15, 23, 42, 1)] h-11 rounded-md px-8  h-11 rounded-md px-8 text-gray-300 hover:text-white hover:bg-gray-800 px-8 py-6 text-lg">
              Learn More
            </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Palette className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
                DrawAI
              </span>
              <span className="text-gray-500 ml-4">© 2024 DrawAI. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
