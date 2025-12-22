import { Heart, Shield, Brain, Zap, Lock, Globe, CheckCircle, Star, ChevronRight, Sparkles, Instagram, MessageCircle, Youtube } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface LandingPageProps {
  onStart?: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  // URLs for the QR codes - update these with your actual app URLs
  const iosAppUrl = "https://mymatchiq.com/download/ios"; // Replace with actual App Store URL
  const androidAppUrl = "https://mymatchiq.com/download/android"; // Replace with actual Play Store URL
  
  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1 - HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-blue-50 py-20 px-6">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl text-gray-900 leading-tight">
                Match Smarter — Start With Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Compatibility Passport</span>.
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed">
                Scan your heart-shaped QR code to download the app and see your MatchIQ before you talk to anyone.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="group px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" />
                  <span className="font-medium">Download for iOS</span>
                </button>
                
                <button className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" />
                  <span className="font-medium">Download for Android</span>
                </button>
              </div>
              
              <p className="text-sm text-gray-600 italic">
                No profiles. No swiping. Pure compatibility.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-rose-500" />
                  <span>Compatibility First</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span>Privacy Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <span>AI-Enhanced Insights</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - QR Hearts */}
            <div className="relative">
              {/* Sparkle effect between hearts */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
              </div>
              
              <div className="flex justify-center items-center gap-8 flex-wrap">
                {/* Pink Heart QR - iOS */}
                <div className="group relative">
                  <div className="w-64 h-64 relative hover:scale-105 transition-transform duration-500 cursor-pointer">
                    {/* Heart SVG Frame */}
                    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full drop-shadow-2xl">
                      <defs>
                        <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#FF69B4', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#FF1493', stopOpacity: 1 }} />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      <path
                        d="M100,170 C100,170 30,120 30,80 C30,50 50,30 75,30 C85,30 95,35 100,45 C105,35 115,30 125,30 C150,30 170,50 170,80 C170,120 100,170 100,170 Z"
                        fill="white"
                        stroke="url(#pinkGradient)"
                        strokeWidth="6"
                        filter="url(#glow)"
                      />
                    </svg>
                    
                    {/* QR Code Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <QRCodeSVG
                        value={iosAppUrl}
                        size={128}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/10 rounded-full transition-all duration-500" />
                  </div>
                  
                  <div className="text-center mt-4 space-y-1">
                    <p className="text-sm text-rose-600 font-medium">Scan to Download on iPhone</p>
                    <p className="text-xs text-gray-600">Create Your Compatibility Passport</p>
                  </div>
                </div>
                
                {/* Blue Heart QR - Android */}
                <div className="group relative">
                  <div className="w-64 h-64 relative hover:scale-105 transition-transform duration-500 cursor-pointer">
                    {/* Heart SVG Frame */}
                    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full drop-shadow-2xl">
                      <defs>
                        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#4169E1', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#1E90FF', stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                      <path
                        d="M100,170 C100,170 30,120 30,80 C30,50 50,30 75,30 C85,30 95,35 100,45 C105,35 115,30 125,30 C150,30 170,50 170,80 C170,120 100,170 100,170 Z"
                        fill="white"
                        stroke="url(#blueGradient)"
                        strokeWidth="6"
                        filter="url(#glow)"
                      />
                    </svg>
                    
                    {/* QR Code Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <QRCodeSVG
                        value={androidAppUrl}
                        size={128}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 rounded-full transition-all duration-500" />
                  </div>
                  
                  <div className="text-center mt-4 space-y-1">
                    <p className="text-sm text-blue-600 font-medium">Scan to Download on Android</p>
                    <p className="text-xs text-gray-600">Start Your First Compatibility Scan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - VALUE PROPOSITION STRIP */}
      <section className="py-12 px-6 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            <ValueProp icon={Brain} text="Science-Based Compatibility Scores" color="text-purple-600" />
            <ValueProp icon={Shield} text="Privacy-First Matching" color="text-blue-600" />
            <ValueProp icon={Sparkles} text="AI-Assisted Insights" color="text-yellow-600" />
            <ValueProp icon={Zap} text="Zero Swiping or Guessing" color="text-orange-600" />
            <ValueProp icon={Lock} text="Connection Approval Required" color="text-green-600" />
          </div>
        </div>
      </section>

      {/* SECTION 3 - SHARE YOUR COMPATIBILITY PASSPORT */}
      <section className="py-20 px-6 bg-gradient-to-br from-white via-pink-50/30 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Visual */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-center gap-6 mb-6">
                  {/* Mini Heart QRs */}
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mb-2">
                      <Heart className="w-16 h-16 text-rose-500" fill="currentColor" />
                    </div>
                    <p className="text-xs text-gray-600">Your Heart</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-2">
                      <Heart className="w-16 h-16 text-blue-500" fill="currentColor" />
                    </div>
                    <p className="text-xs text-gray-600">Your Story</p>
                  </div>
                </div>
                
                {/* Mock Phone UI */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Compatibility Score</span>
                    <span className="text-2xl text-rose-600">87%</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Communication</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-[92%] bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Values</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-pink-200 rounded-full blur-2xl opacity-50" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-50" />
            </div>
            
            {/* Right - Text */}
            <div className="space-y-6">
              <h2 className="text-4xl text-gray-900">
                Your Compatibility Passport — Designed to Be Shared <Heart className="inline w-8 h-8 text-rose-500" fill="currentColor" /><Heart className="inline w-8 h-8 text-blue-500" fill="currentColor" />
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Before you match with someone, share your heart-shaped QR code.
                Let your compatibility speak before you do.
              </p>
              
              <ul className="space-y-4">
                <FeatureBullet icon={Shield} text="Safe" description="no one can message you without approval" />
                <FeatureBullet icon={Zap} text="Fast" description="scan and match in seconds" />
                <FeatureBullet icon={Lock} text="Private" description="your data stays protected" />
                <FeatureBullet icon={CheckCircle} text="Real" description="science-based compatibility results" />
              </ul>
              
              <button className="mt-6 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3">
                <span className="font-medium">Create Your Compatibility Passport</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - HOW IT WORKS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl text-center text-gray-900 mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Three simple steps to find your most compatible matches
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Complete Your Self-Assessment"
              description="Answer 50 questions across 10 categories to build your compatibility profile"
              icon={Brain}
              color="from-purple-500 to-purple-600"
            />
            <StepCard
              number="2"
              title="Get Your Heart-Shaped QR Passport"
              description="Choose pink or blue and share your unique compatibility code"
              icon={Heart}
              color="from-rose-500 to-pink-600"
            />
            <StepCard
              number="3"
              title="Scan, Compare & Connect"
              description="See instant compatibility scores and decide who to connect with"
              icon={Sparkles}
              color="from-blue-500 to-blue-600"
            />
          </div>
        </div>
      </section>

      {/* SECTION 5 - FEATURE GRID */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl text-center text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Everything you need for meaningful connections
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Brain}
              title="Full 10-Category Assessment"
              description="Deep dive into values, lifestyle, communication, intimacy and more"
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
            <FeatureCard
              icon={Sparkles}
              title="AI Relationship Analyst"
              description="Get personalized insights and coaching from our advanced AI"
              color="text-yellow-600"
              bgColor="bg-yellow-50"
            />
            <FeatureCard
              icon={CheckCircle}
              title="Red & Green Flag Map"
              description="Instantly see compatibility strengths and potential concerns"
              color="text-green-600"
              bgColor="bg-green-50"
            />
            <FeatureCard
              icon={Heart}
              title="Match History & Requests"
              description="Track all your scans and manage connection requests"
              color="text-rose-600"
              bgColor="bg-rose-50"
            />
            <FeatureCard
              icon={Lock}
              title="Private QR Sharing"
              description="You control who sees your profile and when"
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <FeatureCard
              icon={Globe}
              title="Multi-Language Support"
              description="Available in English, Spanish, French, German & Italian"
              color="text-indigo-600"
              bgColor="bg-indigo-50"
            />
          </div>
        </div>
      </section>

      {/* SECTION 6 - SOCIAL PROOF */}
      <section className="py-20 px-6 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl text-center text-gray-900 mb-4">Real People, Real Compatibility, Real Results</h2>
          <p className="text-center text-gray-600 mb-12">See what our users are saying</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah M."
              image="SM"
              rating={5}
              text="Finally, an app that focuses on what actually matters. No more wasting time on incompatible matches!"
            />
            <TestimonialCard
              name="James K."
              image="JK"
              rating={5}
              text="The compatibility passport is genius. I shared mine at a networking event and made real connections."
            />
            <TestimonialCard
              name="Maria L."
              image="ML"
              rating={5}
              text="The AI coach helped me understand what I truly need in a relationship. This app is a game-changer."
            />
          </div>
        </div>
      </section>

      {/* SECTION 7 - FINAL CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl mb-6">
            Ready to Find Your Best Match? Start With Your Passport.
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Download MyMatchIQ now and create your Compatibility Passport in minutes
          </p>
          
          {/* QR Hearts Again */}
          <div className="flex justify-center items-center gap-12 flex-wrap mb-8">
            {/* Pink Heart - iOS */}
            <div className="text-center group cursor-pointer">
              <div className="w-48 h-48 bg-white rounded-3xl flex items-center justify-center mb-4 hover:scale-105 transition-transform duration-300 shadow-2xl">
                <Heart className="w-32 h-32 text-rose-500" fill="currentColor" />
              </div>
              <p className="font-medium text-rose-400">Scan for iOS</p>
            </div>
            
            {/* Blue Heart - Android */}
            <div className="text-center group cursor-pointer">
              <div className="w-48 h-48 bg-white rounded-3xl flex items-center justify-center mb-4 hover:scale-105 transition-transform duration-300 shadow-2xl">
                <Heart className="w-32 h-32 text-blue-500" fill="currentColor" />
              </div>
              <p className="font-medium text-blue-400">Scan for Android</p>
            </div>
          </div>
          
          <button className="px-10 py-5 bg-white text-gray-900 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-medium text-lg">
            Download MyMatchIQ
          </button>
        </div>
      </section>

      {/* SECTION 8 - FOOTER */}
      <footer className="py-12 px-6 bg-[#1D2B44] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Tagline */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-rose-400" fill="currentColor" />
                <h3 className="text-2xl">MyMatchIQ</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Where hearts meet minds. Find your most compatible matches through science-based compatibility.
              </p>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            {/* Social */}
            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            © 2025 MyMatchIQ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function ValueProp({ icon: Icon, text, color }: { icon: any; text: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className={`w-6 h-6 ${color}`} />
      <span className="text-gray-700 text-sm">{text}</span>
    </div>
  );
}

function FeatureBullet({ icon: Icon, text, description }: { icon: any; text: string; description: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <span className="font-medium text-gray-900">{text}</span>
        <span className="text-gray-600"> — {description}</span>
      </div>
    </li>
  );
}

function StepCard({ number, title, description, icon: Icon, color }: { number: string; title: string; description: string; icon: any; color: string }) {
  return (
    <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6`}>
        <Icon className="w-8 h-8 text-white" fill={Icon === Heart ? 'currentColor' : 'none'} />
      </div>
      <div className="absolute top-8 right-8 text-6xl font-bold text-gray-100">{number}</div>
      <h3 className="text-xl text-gray-900 mb-3 relative z-10">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color, bgColor }: { icon: any; title: string; description: string; color: string; bgColor: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <h3 className="text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({ name, image, rating, text }: { name: string; image: string; rating: number; text: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-white font-medium">
          {image}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{name}</p>
          <div className="flex gap-1">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed italic">&ldquo;{text}&rdquo;</p>
    </div>
  );
}