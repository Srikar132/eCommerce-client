import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import Header from '@/components/header';
import { getStoreSettings } from '@/lib/actions/store-settings-actions';

export const metadata = {
  title: 'Contact Us - THE NALA ARMOIRE',
  description: 'Get in touch with us for any questions, feedback, or support. We\'re here to help you with your shopping experience.',
};

export default async function ContactPage() {
  const settings = await getStoreSettings();
  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <Header
        title="Get In Touch"
        subtitle="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
      />

      {/* Main Content */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

            {/* Contact Form */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-light text-foreground">
                        Send a Message
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Fill out the form below
                      </p>
                    </div>
                  </div>

                  <form className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full h-11 border-border bg-background focus:border-primary focus:ring-primary/20"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full h-11 border-border bg-background focus:border-primary focus:ring-primary/20"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="query" className="block text-sm font-medium text-foreground mb-2">
                        Your Message
                      </label>
                      <textarea
                        id="query"
                        name="query"
                        rows={5}
                        required
                        className="w-full px-3 py-3 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-colors"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="space-y-6">

                <div>
                  <h2 className="text-2xl font-serif font-light text-foreground mb-6">
                    Visit Us
                  </h2>

                  <div className="space-y-5">
                    <Card className="border-border bg-card hover:shadow-md transition-shadow duration-300">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground text-sm mb-2">Address</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              NALA ARMOIRE<br />
                              {settings.address}<br />
                              {settings.city}, {settings.state} {settings.pincode}<br />
                              {settings.country}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border bg-card hover:shadow-md transition-shadow duration-300">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground text-sm mb-2">Phone</h3>
                            <p className="text-sm text-muted-foreground">{settings.phone}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border bg-card hover:shadow-md transition-shadow duration-300">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground text-sm mb-2">Email</h3>
                            <p className="text-sm text-muted-foreground">{settings.email}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border bg-card hover:shadow-md transition-shadow duration-300">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground text-sm mb-2">Business Hours</h3>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                              <p>Saturday: 10:00 AM - 4:00 PM</p>
                              <p>Sunday: Closed</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Customer Service Info */}
                <Card className="border-border bg-primary text-primary-foreground">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-serif font-light mb-3">Customer Service</h3>
                    <p className="text-sm opacity-90 mb-3 leading-relaxed">
                      Our dedicated team is here to assist you with any inquiries about products,
                      orders, returns, or general questions.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Response Time: Within 24 hours</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
