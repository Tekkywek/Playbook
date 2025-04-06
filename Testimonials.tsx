
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

type TestimonialType = {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
};

const testimonials: TestimonialType[] = [
  {
    name: "Michael Johnson",
    role: "Basketball Player, Age 16",
    avatar: "https://i.pravatar.cc/150?img=11",
    quote: "PlayBook transformed my training routine. The personalized workouts and ability to track my progress have helped me improve my shooting percentage by 15% in just three months.",
    rating: 5,
  },
  {
    name: "Sarah Williams",
    role: "High School Volleyball Coach",
    avatar: "https://i.pravatar.cc/150?img=5",
    quote: "Managing my team has never been easier. The scheduling and communication features keep everyone on the same page, and the performance analytics help me identify areas where my players need to improve.",
    rating: 5,
  },
  {
    name: "Alex Rodriguez",
    role: "Basketball Player, Age 15",
    avatar: "https://i.pravatar.cc/150?img=12",
    quote: "The matchmaking feature helped me find other players in my area to practice with. I've made new friends and improved my game by competing against different styles of play.",
    rating: 4,
  },
  {
    name: "Emma Chen",
    role: "Volleyball Player, Age 17",
    avatar: "https://i.pravatar.cc/150?img=9",
    quote: "I love how PlayBook tracks my vertical jump progress! The workout plans are challenging but fun, and I've seen real improvements in my blocking and hitting skills.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Athletes Say</h2>
          <p className="text-muted-foreground">
            Join thousands of athletes who are training smarter and playing better with PlayBook.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative px-4 py-10">
            <div className="absolute top-0 left-0 text-playbook-primary opacity-20">
              <Quote size={60} />
            </div>
            
            <div className="card-playbook relative z-10">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-playbook-secondary flex-shrink-0">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < testimonials[currentIndex].rating
                            ? "text-playbook-primary fill-playbook-primary"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-lg italic mb-4">
                    "{testimonials[currentIndex].quote}"
                  </p>
                  
                  <div>
                    <h4 className="font-bold">{testimonials[currentIndex].name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute right-4 bottom-4 flex gap-2">
              <button
                onClick={goToPrev}
                className="p-2 rounded-full bg-playbook-secondary text-playbook-text hover:bg-playbook-primary hover:text-white transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNext}
                className="p-2 rounded-full bg-playbook-secondary text-playbook-text hover:bg-playbook-primary hover:text-white transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex justify-center mt-4 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index 
                    ? "bg-playbook-primary" 
                    : "bg-playbook-secondary"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
