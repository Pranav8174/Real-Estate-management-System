import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Star, Users, Building } from "lucide-react";
import Header from "@/components/Header";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Home className="h-8 w-8 text-primary" />
              <CardTitle className="text-4xl font-bold text-primary">About EstateHub</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl mb-6 text-muted-foreground text-center">
              <span className="font-semibold text-primary">EstateHub</span> is your trusted partner in real estate. Our mission is to make buying, selling, and renting properties simple, transparent, and enjoyable for everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="mb-4">
                  We offer a comprehensive platform where buyers, sellers, and renters can connect, explore properties, and make informed decisions. Our team is dedicated to providing the best experience, with verified listings, expert support, and innovative tools.
                </p>
                <ul className="list-none space-y-3">
                  <li className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                    <span>Wide selection of properties across major cities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span>Easy-to-use search and filter options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-green-500" />
                    <span>Secure and transparent transactions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Expert support for buyers and sellers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-500" />
                    <span>Modern, user-friendly interface</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80"
                  alt="EstateHub Team"
                  className="rounded-xl shadow-lg mb-4 w-full object-cover"
                  style={{ maxHeight: 220 }}
                />
                  <div className="text-center text-muted-foreground text-sm">
                  Our dedicated team is here for you!
                </div>
              </div>
            </div>
            <p className="text-lg text-center mt-8 font-medium text-primary">
              Whether you're looking for your dream home, a smart investment, or a place to rent,<br />
              <span className="font-bold">EstateHub</span> is here to help you every step of the way.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}