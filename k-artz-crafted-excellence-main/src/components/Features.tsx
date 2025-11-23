import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Lightbulb, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const AnimatedCounter = ({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [inView, end, duration]);

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-bold text-gradient">
      {count}
      {suffix}
    </span>
  );
};

const features = [
  {
    icon: Award,
    title: 'Years of Excellence',
    value: 28,
    suffix: '+',
    description: 'Decades of crafting quality',
  },
  {
    icon: Users,
    title: 'Happy Clients',
    value: 1000,
    suffix: '+',
    description: 'Satisfied customers nationwide',
  },
  {
    icon: Lightbulb,
    title: 'Custom Designs',
    value: 5000,
    suffix: '+',
    description: 'Unique creations delivered',
  },
  {
    icon: Zap,
    title: 'Quick Turnaround',
    value: 48,
    suffix: 'hrs',
    description: 'Average delivery time',
  },
];

const Features = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      
      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-gradient">K'artz</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Setting industry standards with unmatched quality and expertise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="glass p-8 rounded-2xl text-center group cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center glow-primary"
              >
                <feature.icon className="h-8 w-8 text-primary-foreground" />
              </motion.div>
              
              <AnimatedCounter end={feature.value} suffix={feature.suffix} />
              
              <h3 className="text-xl font-bold mt-4 mb-2 group-hover:text-accent transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
