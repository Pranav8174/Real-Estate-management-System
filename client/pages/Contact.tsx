import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you can add your API call to send the message
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Header/>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-2">Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Have questions or need support? Reach out to our team and we'll be happy to assist you.
            </p>
            <div className="flex items-center mb-4">
              <Mail className="h-5 w-5 mr-2 text-primary" />
              <span className="text-lg">info@estatehub.com</span>
            </div>
            <div className="flex items-center mb-4">
              <Phone className="h-5 w-5 mr-2 text-primary" />
              <span className="text-lg">+1 (555) 123-4567</span>
            </div>
            <p className="mb-6">
              You can also use our <a href="/help" className="text-primary underline">Help Center</a> for quick answers.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <Input
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90 w-full">
                Send Message
              </Button>
              {submitted && (
                <div className="text-green-600 text-center mt-2">
                  Thank you for contacting us! We'll get back to you soon.
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}