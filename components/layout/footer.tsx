import Link from "next/link";
import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6" />
              <span className="font-bold text-xl">Lancer</span>
            </div>
            <p className="text-muted-foreground">
              Connecting talent with opportunity in the digital economy.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">For Clients</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">How to Hire</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Talent Marketplace</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Payment Protection</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Success Stories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">For Freelancers</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Find Work</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Create Profile</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Skill Tests</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help & Support</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Lancer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}