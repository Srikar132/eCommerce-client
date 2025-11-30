import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export const metadata = {
  title: 'Contact Us - THE NALA ARMOIRE',
  description: 'Get in touch with us for any questions, feedback, or support. We\'re here to help you with your shopping experience.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray050 border-b text-black py-24 lg:py-32">
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">
            GET IN TOUCH
          </h1>
          <p className="text-xl lg:text-2xl text-gray-900 max-w-3xl mx-auto font-light">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
            
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-gray-50 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-black mb-1 tracking-tight">
                  SEND MESSAGE
                </h2>
                <p className="text-gray-600 mb-6 text-base">
                  Fill out the form below and we'll get back to you shortly.
                </p>
                
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-black mb-2 uppercase tracking-wide">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full h-12 px-3 border-2 border-gray-300 rounded-none focus:border-black focus:ring-0 text-base"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-black mb-2 uppercase tracking-wide">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full h-12 px-3 border-2 border-gray-300 rounded-none focus:border-black focus:ring-0 text-base"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="query" className="block text-xs font-semibold text-black mb-2 uppercase tracking-wide">
                      Your Message *
                    </label>
                    <textarea
                      id="query"
                      name="query"
                      rows={4}
                      required
                      className="w-full px-3 py-3 border-2 border-gray-300 rounded-none focus:border-black focus:ring-0 text-base resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-black text-white rounded-none hover:bg-gray-800 transition-colors duration-300 font-semibold text-base uppercase tracking-wide flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="order-1 lg:order-2">
              <div className="space-y-8">
                
                {/* Office Address */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 tracking-tight">
                    VISIT US
                  </h2>
                  
                  <div className="space-y-5">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-black text-sm mb-1 uppercase tracking-wide">Address</h3>
                        <p className="text-gray-700 text-base leading-relaxed">
                          THE NALA ARMOIRE<br />
                          123 Fashion District<br />
                          Style Street, Suite 456<br />
                          New York, NY 10001
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-black text-sm mb-1 uppercase tracking-wide">Phone</h3>
                        <p className="text-gray-700 text-base">+1 (555) 123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-black text-sm mb-1 uppercase tracking-wide">Email</h3>
                        <p className="text-gray-700 text-base">hello@thenalaarmoire.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-black text-sm mb-1 uppercase tracking-wide">Business Hours</h3>
                        <div className="text-gray-700 text-base space-y-0.5">
                          <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                          <p>Saturday: 10:00 AM - 4:00 PM</p>
                          <p>Sunday: Closed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Service Info */}
                <div className="bg-black text-white p-6">
                  <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">Customer Service</h3>
                  <p className="text-gray-300 mb-3 text-sm leading-relaxed">
                    Our dedicated team is here to assist you with any inquiries about products, 
                    orders, returns, or general questions.
                  </p>
                  <p className="text-gray-300 text-sm">
                    <span className="font-semibold text-white">Response Time:</span> Within 24 hours
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
