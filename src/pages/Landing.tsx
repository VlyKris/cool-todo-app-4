import { AuthButton } from "@/components/auth/AuthButton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Calendar, 
  Target, 
  Zap, 
  Star, 
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation */}
      <motion.nav 
        className="w-full py-6 px-4 md:px-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </motion.div>
          
          <AuthButton 
            trigger={
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg">
                Get Started Free
              </Button>
            }
          />
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="max-w-7xl mx-auto px-4 md:px-8 py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">The Future of Task Management</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Organize Your Life
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Like Never Before
            </span>
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
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-xl px-8 py-6 text-lg">
                  Start Organizing Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              }
            />
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-2">
              Watch Demo
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        className="max-w-7xl mx-auto px-4 md:px-8 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Stay Productive
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed to make task management effortless
          </p>
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
              className="group p-8 rounded-2xl gradient-card border shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="max-w-4xl mx-auto px-4 md:px-8 py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <div className="text-center p-12 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already revolutionized their task management with TaskFlow.
          </p>
          <AuthButton 
            trigger={
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-xl px-12 py-6 text-lg">
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            }
          />
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2024 TaskFlow. Built with ❤️ for productivity enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  );
}