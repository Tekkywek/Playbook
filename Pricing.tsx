
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface PlanFeature {
  included: boolean;
  text: string;
}

interface PricingPlanProps {
  name: string;
  description: string;
  price: string;
  features: PlanFeature[];
  highlight?: boolean;
  buttonText: string;
}

const PricingPlan = ({ name, description, price, features, highlight = false, buttonText }: PricingPlanProps) => {
  return (
    <Card className={`flex flex-col h-full ${highlight ? 'border-playbook-primary shadow-lg' : ''}`}>
      <CardHeader>
        {highlight && (
          <div className="text-center mb-2">
            <span className="bg-playbook-primary/10 text-playbook-primary text-sm px-3 py-1 rounded-full">
              Most Popular
            </span>
          </div>
        )}
        <CardTitle className="text-center text-xl">{name}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center flex-grow">
        <div className="mb-6">
          <span className="text-4xl font-bold">{price}</span>
          {price !== 'Free' && <span className="text-muted-foreground">/month</span>}
        </div>
        <ul className="space-y-3 text-left">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className={`mt-1 ${feature.included ? 'text-green-500' : 'text-muted-foreground'}`}>
                {feature.included ? <Check className="h-4 w-4" /> : <span className="text-sm">-</span>}
              </div>
              <span className={feature.included ? '' : 'text-muted-foreground'}>{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          asChild 
          className={`w-full ${highlight ? 'bg-playbook-primary hover:bg-playbook-accent' : ''}`}
          variant={highlight ? 'default' : 'outline'}>
          <Link to="/signup">{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              Choose the plan that's right for you and start optimizing your sports experience today.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <PricingPlan 
                name="Basic"
                description="Perfect for individuals"
                price="Free"
                buttonText="Get Started"
                features={[
                  { included: true, text: "Personal workout tracking" },
                  { included: true, text: "Basic analytics" },
                  { included: true, text: "Access to public workouts" },
                  { included: false, text: "Team management" },
                  { included: false, text: "Video analysis" },
                  { included: false, text: "Advanced analytics" },
                  { included: false, text: "Priority support" },
                ]}
              />
              
              <PricingPlan 
                name="Pro"
                description="Great for coaches and athletes"
                price="$19.99"
                buttonText="Start Free Trial"
                highlight={true}
                features={[
                  { included: true, text: "Everything in Basic" },
                  { included: true, text: "Team management (up to 20)" },
                  { included: true, text: "Custom workout creation" },
                  { included: true, text: "Advanced analytics" },
                  { included: true, text: "Email support" },
                  { included: false, text: "Custom branding" },
                  { included: false, text: "API access" },
                ]}
              />
              
              <PricingPlan 
                name="Elite"
                description="For professional teams"
                price="$49.99"
                buttonText="Contact Sales"
                features={[
                  { included: true, text: "Everything in Pro" },
                  { included: true, text: "Unlimited team members" },
                  { included: true, text: "Video analysis" },
                  { included: true, text: "Custom branding" },
                  { included: true, text: "API access" },
                  { included: true, text: "Dedicated account manager" },
                  { included: true, text: "24/7 priority support" },
                ]}
              />
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-playbook-light">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
              <div>
                <h3 className="font-semibold mb-2">Can I cancel my subscription?</h3>
                <p className="text-muted-foreground">Yes, you can cancel your subscription anytime with no cancellation fees.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">Yes, all paid plans come with a 14-day free trial.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I upgrade or downgrade?</h3>
                <p className="text-muted-foreground">You can change your plan at any time, and we'll prorate the difference.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer team discounts?</h3>
                <p className="text-muted-foreground">Yes, contact our sales team for special pricing for large teams or organizations.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
