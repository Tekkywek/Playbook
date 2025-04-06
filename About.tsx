import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Award, Heart, Globe, Zap, Medal, Users } from "lucide-react";

const ValueCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <Card className="bg-white border-[#E8D6B0]">
    <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
      <div className="h-12 w-12 rounded-full bg-[#FF7F2A]/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-[#FF7F2A]" />
      </div>
      <h3 className="text-lg font-semibold text-[#3E2723] mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

const TeamMember = ({ name, role, imageUrl }: { name: string, role: string, imageUrl: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
      <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
    </div>
    <h3 className="font-semibold text-[#3E2723]">{name}</h3>
    <p className="text-sm text-gray-600">{role}</p>
  </div>
);

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#FF7F2A] to-[#D35400] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Mission</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Empowering youth athletes to reach their full potential through innovative training and meaningful connections.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-[#FAF8F1]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-[#3E2723] mb-8">Our Story</h2>
              <div className="space-y-4 text-[#3E2723]">
                <p>
                  PlayBook was born from a simple observation: young athletes need better tools to develop their skills and connect with like-minded peers. Founded in 2023 by a team of former athletes and tech enthusiasts, we set out to create a platform that addresses the unique needs of basketball and volleyball players.
                </p>
                <p>
                  We noticed that while there were plenty of fitness apps on the market, very few catered specifically to youth team sports. Training resources were scattered, team management was inefficient, and finding practice partners was unnecessarily difficult.
                </p>
                <p>
                  Our platform combines structured training programs with team management tools and a unique matchmaking system that helps athletes find peers with complementary skills and goals. By bringing these elements together in one seamless experience, PlayBook aims to revolutionize how young athletes train, connect, and grow.
                </p>
                <p>
                  Today, PlayBook is used by thousands of athletes, coaches, and teams across the country. But we're just getting started. Our vision is to expand to more sports and continue enhancing our platform based on feedback from our growing community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#3E2723] mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ValueCard 
                icon={Award}
                title="Excellence"
                description="We strive for excellence in everything we do, just like the athletes we serve."
              />
              <ValueCard 
                icon={Heart}
                title="Passion"
                description="We're passionate about sports and technology, and the positive impact they can have together."
              />
              <ValueCard 
                icon={Users}
                title="Community"
                description="We believe in the power of community to inspire, motivate, and support growth."
              />
              <ValueCard 
                icon={Medal}
                title="Integrity"
                description="We act with honesty and transparency in all our operations and communications."
              />
              <ValueCard 
                icon={Zap}
                title="Innovation"
                description="We constantly explore new ideas and technologies to better serve our users."
              />
              <ValueCard 
                icon={Globe}
                title="Accessibility"
                description="We're committed to making quality training accessible to athletes of all backgrounds."
              />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-[#F5E8C7]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#3E2723] mb-12">Our Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <TeamMember 
                name="Sarah Johnson"
                role="Founder & CEO"
                imageUrl="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fDB8fHww"
              />
              <TeamMember 
                name="Marcus Chen"
                role="CTO"
                imageUrl="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MHx8MHx8fDA%3D"
              />
              <TeamMember 
                name="Alicia Rodriguez"
                role="Head of Product"
                imageUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MHx8MHx8fDA%3D"
              />
              <TeamMember 
                name="David Wilson"
                role="Head Coach"
                imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDB8fDB8fHww"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About; 