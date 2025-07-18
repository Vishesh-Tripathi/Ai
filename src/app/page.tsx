'use client';
import { useState, useEffect } from "react";
import { 
  FileText, 
  Mic,
  BrainCircuit, 
  BarChart2, 
  Wand2, 
  UploadCloud, 
  Clock, 
  CheckCircle, 
  Zap,
  ChevronRight,
  ArrowRight,
  Star,
  BadgeCheck,
  Shield,
  Sparkles
} from "lucide-react";

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser, UserButton, } from "@clerk/nextjs";
import HyperSpeed from "../Components/HyperSpeed";
// @ts-ignore
import CardSwap, { Card } from "../Components/Card";

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  
  const texts = [
    "analyze your resume...",
    "prepare for interviews...",
    "identify strengths...",
    "boost your career..."
  ];

  // Dark mode detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Typing effect
  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (currentIndex < texts[activeFeature].length) {
        setTypedText((prev) => prev + texts[activeFeature][currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setTypedText("");
          setCurrentIndex(0);
          setActiveFeature((prev) => (prev + 1) % texts.length);
        }, 1500);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [activeFeature, currentIndex]);

  // Features for both products
  const features = [
  {
    title: "AI-Powered Resume Analysis",
    description:
      "Receive comprehensive, AI-driven insights into your resume's structure, content, and formatting. Get tailored recommendations to boost clarity, alignment with job roles, and professional appeal.",
    icon: <FileText className="w-6 h-6" />,
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    title: "ATS Compatibility Optimization",
    description:
      "Ensure your resume is perfectly formatted to bypass Applicant Tracking Systems (ATS). We check keyword alignment, file structure, and compliance to maximize visibility with recruiters.",
    icon: <Shield className="w-6 h-6" />,
    color: "text-purple-600 dark:text-purple-400"
  },
  {
    title: "Interactive AI Mock Interviews",
    description:
      "Prepare like a pro with simulated interviews powered by AI. Practice industry-relevant questions, receive real-time feedback, and sharpen your communication and problem-solving skills.",
    icon: <Mic className="w-6 h-6" />,
    color: "text-emerald-600 dark:text-emerald-400"
  },
  {
    title: "Performance Tracking & Analytics",
    description:
      "Monitor your readiness with detailed performance reports. Track your improvements, identify skill gaps, and gain confidence as you progress toward landing your dream job.",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "text-amber-600 dark:text-amber-400"
  }
];


  // Benefits section
  const benefits = [
    {
      title: "Instant Feedback",
      description: "Get real-time analysis and suggestions",
      icon: <Sparkles className="w-5 h-5 text-blue-500" />
    },
    {
      title: "Proven Results",
      description: "Used by thousands of successful job seekers",
      icon: <BadgeCheck className="w-5 h-5 text-purple-500" />
    },
    {
      title: "Expert Approved",
      description: "Methods trusted by career coaches",
      icon: <Star className="w-5 h-5 text-amber-500" />
    }
  ];

  // Product cards
  const products = [
    {
      title: "Resume Analyzer",
      description: "Optimize your resume for any job opportunity",
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      action: "Analyze Now",
      route: "/resume"
    },
    {
      title: "AI Interview Coach",
      description: "Practice interviews with AI-powered feedback",
      icon: <Mic className="w-8 h-8 text-purple-500" />,
      action: "Start Practice",
      route: "/interviewpanel"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300  relative`}>
      {/* HyperSpeed Background Animation */}
      <div className="fixed inset-0 w-full h-full z-0">
        <HyperSpeed />
      </div>
      
      {/* Content with background overlay for readability */}
      <div className="relative z-10 bg-gray-900/30  min-h-screen">
      {/* Navigation */}
     

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Your Complete Career Preparation Suite
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10">
            AI-powered tools to analyze resumes and practice interviews
            <br />
            <span className="inline-block mt-2 font-mono text-blue-600 dark:text-blue-400">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </p>
            {/* Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
            {products.map((product, index) => (
              <div 
                key={index}
                className=" backdrop-blur-sm bg-transparent p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-700 mb-4">
                    {product.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{product.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{product.description}</p>
                  
                  <SignedIn>
                    <button 
                      onClick={() => router.push(product.route)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                    >
                      {product.action} <ArrowRight className="w-4 h-4" />
                    </button>
                  </SignedIn>
                  
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all">
                        Sign In to {product.action} <ArrowRight className="w-4 h-4" />
                      </button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 items-center text-gray-500 dark:text-gray-400">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                {benefit.icon}
                <span>{benefit.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left side - Text content */}
            <div className="lg:w-1/2">
  <h2 className="text-3xl md:text-5xl font-bold mb-6">
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
      Designed to Impress,
      <br />
      Built for Impact
    </span>
  </h2>
  <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
    Every feature is crafted with precision, performance, and user experience in mind.
    Whether you're on desktop or mobile, light or dark mode—this section just works beautifully.
  </p>

  {/* Feature benefits list */}
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-white font-medium">
        Reliable – Always delivers a seamless and bug-free experience
      </span>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-white rounded-full"></div>
      <span className="text-white font-medium">
        Smooth – Responsive and fluid across all screen sizes
      </span>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      <span className="text-white font-medium">
        Customizable – Easily adaptable to different branding and themes
      </span>
    </div>
  </div>
</div>

            
            {/* Right side - Card animation */}
            <div className="lg:w-1/2 relative ">
              <div style={{ height: '600px', position: 'relative', width: '120%' }}>
                <CardSwap
                  cardDistance={80}
                  verticalDistance={90}
                  delay={3000}
                  pauseOnHover={true}
                  width={500}
                  height={400}
                  onCardClick={() => {}}
                >
                  {features.map((feature, index) => (
                    // @ts-ignore
                    <Card 
                      key={index} 
                      customClass="p-6  text-white border-gray-700"
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="how-it-works" className="  py-20 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  See It In Action
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Our AI analyzes your resume just like a hiring manager would, providing specific feedback to improve your chances of getting interviews.
              </p>
              <div className="space-y-4">
                {[
                  "Keyword optimization for ATS systems",
                  "Skills gap analysis",
                  "Formatting and structure recommendations",
                  "Personalized interview preparation"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-3xl blur-3xl -z-10"></div>
              <div className="bg-white dark:bg-transparent p-1.5 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                <Image
                  src="/img.png"
                  alt="Dashboard Demo"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 ">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Why Choose CareerPrepAI
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The most comprehensive career preparation platform available
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Analysis",
                description: "Our advanced algorithms evaluate your resume and interview performance with human-like precision.",
                icon: <BrainCircuit className="w-8 h-8 text-blue-500" />
              },
              {
                title: "Real-Time Feedback",
                description: "Get instant suggestions for improvement during mock interviews and resume reviews.",
                icon: <Zap className="w-8 h-8 text-purple-500" />
              },
              {
                title: "Career-Focused",
                description: "Tailored specifically for tech professionals at all experience levels.",
                icon: <Wand2 className="w-8 h-8 text-emerald-500" />
              }
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-transparent p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20  text-white">
        <div className="container mx-auto px-6  text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Job Search?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join thousands of professionals who landed their dream jobs with our help
          </p>          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <SignedIn>
              <button 
                onClick={() => router.push('/resume')}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
              >
                Analyze My Resume <FileText className="w-5 h-5" />
              </button>
              <button 
                onClick={() => router.push('/interviewpanel')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg text-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                Practice Interview <Mic className="w-5 h-5" />
              </button>
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                  Sign In to Analyze Resume <FileText className="w-5 h-5" />
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-medium transition-colors flex items-center justify-center gap-2">
                  Sign Up to Practice Interview <Mic className="w-5 h-5" />
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Wand2 className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white">CareerPrepAI</span>
              </div>
              <p className="mb-4">The complete career preparation platform for tech professionals.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Products</h3>
              <ul className="space-y-2">
                <li><a href="/resume" className="hover:text-white transition-colors">Resume Analyzer</a></li>
                <li><a href="/interview" className="hover:text-white transition-colors">AI Interview Coach</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Guides</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>© {new Date().getFullYear()} CareerPrepAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}