import { AuthButton } from "@/components/auth/AuthButton";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import { 
  CheckCircle, 
  Calendar, 
  Target, 
  Zap, 
  Star, 
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  Rocket,
  Shield,
  Users,
  Award
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Floating particles component
function FloatingParticles() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-gradient-to-r from-primary/40 to-accent/40 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, -200, -300],
            x: [0, Math.random() * 50 - 25, Math.random() * 100 - 50, Math.random() * 150 - 75],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1.5, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

// Animated background grid
function AnimatedGrid() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div 
        className="absolute inset-0 opacity-[0.02]"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
      </motion.div>
    </div>
  );
}

// Floating orbs
function FloatingOrbs() {
  const orbs = [
    { color: "from-primary/20 to-primary/10", size: 200, delay: 0, duration: 8 },
    { color: "from-accent/20 to-accent/10", size: 150, delay: 2, duration: 10 },
    { color: "from-purple-500/20 to-pink-500/10", size: 180, delay: 4, duration: 12 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl bg-gradient-to-r ${orb.color}`}
          style={{
            width: orb.size,
            height: orb.size,
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Glowing text effect
function GlowingText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`${className} relative`}>
      {children}
      <span className="absolute inset-0 blur-sm bg-gradient-to-r from-primary to-accent opacity-50 animate-pulse" />
    </span>
  );
}

// Animated counter
function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const currentCount = Math.floor(end * progress);
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return <span>{count.toLocaleString()}+</span>;
}

// Magnetic button effect
function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const handleMouse = (e: React.MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set(e.clientX - centerX);
      y.set(e.clientY - centerY);
    }
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}

export default function Landing() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      {/* Background effects */}
      <AnimatedGrid />
      <FloatingOrbs />
      <FloatingParticles />
      
      {/* Custom cursor effect */}
      <motion.div
        className="fixed w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <motion.nav 
        className="w-full py-6 px-4 md:px-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <CheckCircle className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <GlowingText className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              TaskFlow
            </GlowingText>
          </motion.div>
          
          <AuthButton 
            trigger={
              <MagneticButton className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg px-6 py-2 rounded-full">
                Get Started Free
              </MagneticButton>
            }
          />
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground mb-8 backdrop-blur-sm border border-accent/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span className="text-sm font-medium">The Future of Task Management</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <GlowingText className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Organize Your Life
            </GlowingText>
            <br />
            <GlowingText className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Like Never Before
            </GlowingText>
          </motion.h1>

          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Experience the most intuitive and powerful todo app. Boost your productivity with smart prioritization, beautiful design, and seamless organization.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <AuthButton 
              trigger={
                <MagneticButton size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-xl px-8 py-6 text-lg rounded-full relative overflow-hidden group">
                  <span className="relative z-10 flex items-center">
                    Start Organizing Now
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </motion.div>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </MagneticButton>
              }
            />
            <MagneticButton variant="outline" size="lg" className="px-8 py-6 text-lg border-2 rounded-full backdrop-blur-sm bg-background/50 hover:bg-background/80 transition-all duration-300">
              Watch Demo
            </MagneticButton>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="max-w-4xl mx-auto px-4 md:px-8 py-16 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Users, label: "Active Users", value: 12500 },
            { icon: Award, label: "Awards Won", value: 8 },
            { icon: Shield, label: "Security Score", value: 99 },
            { icon: Rocket, label: "Tasks Completed", value: 2500000 }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center backdrop-blur-sm border border-primary/20">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">
                <AnimatedCounter end={stat.value} />
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        className="max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            Everything You Need to Stay Productive
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            Powerful features designed to make task management effortless
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Smart Prioritization",
              description: "Automatically organize tasks by urgency and importance with our intelligent priority system.",
              color: "from-red-500 to-orange-500"
            },
            {
              icon: Calendar,
              title: "Due Date Tracking",
              description: "Never miss a deadline with smart reminders and beautiful calendar integration.",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Add, edit, and complete tasks in seconds with our streamlined interface.",
              color: "from-yellow-500 to-orange-500"
            },
            {
              icon: Star,
              title: "Categories & Tags",
              description: "Organize tasks with customizable categories and tags for perfect organization.",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: Clock,
              title: "Time Tracking",
              description: "Track how long tasks take and optimize your workflow for maximum efficiency.",
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: TrendingUp,
              title: "Progress Analytics",
              description: "Visualize your productivity with detailed stats and progress tracking.",
              color: "from-indigo-500 to-purple-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group p-8 rounded-2xl gradient-card border shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-background/50 hover:bg-background/80 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <motion.div 
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              
              {/* Hover effect overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="max-w-4xl mx-auto px-4 md:px-8 py-20 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <motion.div 
          className="text-center p-12 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border backdrop-blur-sm relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already revolutionized their task management with TaskFlow.
            </p>
            <AuthButton 
              trigger={
                <MagneticButton size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-xl px-12 py-6 text-lg rounded-full relative overflow-hidden group">
                  <span className="relative z-10 flex items-center">
                    Get Started for Free
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </motion.div>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </MagneticButton>
              }
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="border-t bg-muted/30 py-12 relative z-10 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <motion.div 
            className="flex items-center justify-center gap-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <CheckCircle className="w-4 h-4 text-primary-foreground" />
            </motion.div>
            <GlowingText className="font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              TaskFlow
            </GlowingText>
          </motion.div>
          <p className="text-muted-foreground">
            © 2024 TaskFlow. Built with ❤️ for productivity enthusiasts.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}