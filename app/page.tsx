

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Briefcase,
  Shield,
  Star,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import Lancer from "@/public/images/lancer.jpeg"
import LancerCollaborating from "@/public/images/lancer_collaborating.jpeg"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <MainNav />
          <div className="flex items-center space-x-4">
            <Link href="/auth/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Connect with top talent and clients worldwide
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Our end-to-end platform handles the entire freelance workflow
                  from proposal to payment, so you can focus on what matters
                  most.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/sign-up?role=client">
                    <Button size="lg" className="w-full sm:w-auto">
                      Hire Talent
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up?role=freelancer">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Find Work
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={LancerCollaborating}
                  alt="Freelancers collaborating"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Our Platform
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We have designed a comprehensive solution that makes freelancing
                and hiring easier than ever before.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="mb-4 text-primary">{feature?.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature?.title}
                  </h3>
                  <p className="text-muted-foreground">{feature?.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform simplifies the freelancing process with a
                structured workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <span className="text-xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to transform your freelance experience?
                </h2>
                <p className="text-lg opacity-90">
                  Join thousands of freelancers and clients already using our
                  platform to connect, collaborate, and create.
                </p>
                <Link href="/auth/sign-up">
                  <Button size="lg" variant="secondary" className="group">
                    Get Started Now
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="relative h-[300px] w-full rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={Lancer}
                  alt="Successful freelancer"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const features = [
  {
    icon: <Briefcase className="h-10 w-10" />,
    title: "Multi-Tier Contracts",
    description:
      "Our structured contract system ensures clear expectations and milestones throughout the project lifecycle.",
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Secure Payments",
    description:
      "Escrow-based payment protection gives both clients and freelancers peace of mind.",
  },
  {
    icon: <CheckCircle className="h-10 w-10" />,
    title: "Quality Assurance",
    description:
      "Our review and rating system helps maintain high quality standards across the platform.",
  },
  {
    icon: <Star className="h-10 w-10" />,
    title: "Talent Matching",
    description:
      "Our advanced algorithms help match the right talent with the right projects.",
  },
  {
    icon: <CheckCircle className="h-10 w-10" />,
    title: "Milestone Tracking",
    description:
      "Track progress with our intuitive milestone system that keeps projects on schedule.",
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Dispute Resolution",
    description:
      "Our fair dispute resolution system protects both clients and freelancers.",
  },
];

const steps = [
  {
    title: "Project Creation",
    description:
      "Clients post detailed project requirements and set their budget.",
  },
  {
    title: "Bidding & Selection",
    description:
      "Freelancers submit proposals and clients select the best fit.",
  },
  {
    title: "Milestone Setup",
    description:
      "Break down the project into manageable milestones with clear deliverables.",
  },
  {
    title: "Work & Payment",
    description:
      "Track progress, approve work, and release payments upon completion.",
  },
];
