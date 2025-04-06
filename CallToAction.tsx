
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-16 gradient-primary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Your Game to the Next Level?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of athletes who are training smarter, competing stronger, and connecting better with PlayBook.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="text-playbook-text font-medium">
              <Link to="/signup">Create Your Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10 font-medium">
              <Link to="/features" className="flex items-center gap-2">
                Explore Features
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
