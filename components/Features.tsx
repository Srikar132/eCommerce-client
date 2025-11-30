import { useState } from 'react';
import Image from "next/image";
import {features} from "@/constants";

const Features = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        if (email && email.includes('@')) {
            alert('Thank you for subscribing!');
            setEmail('');
        }
    };

    return (
        <div className="w-full">

            {/* ---------- Features Section ---------- */}
            <section className="bg-white py-12 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="flex flex-col items-center text-center group">

                            {/* Replaced SVG with Image */}
                            <div className="mb-4 text-black transition-colors">
                                <Image
                                    src={feature.icon}
                                    alt={feature.title}
                                    width={60}
                                    height={50}
                                    className="object-contain"
                                />
                            </div>

                            <h3 className="text-sm font-semibold tracking-wider mb-2 ">
                                {feature.title}
                            </h3>
                            <p className="text-sm font-medium text-black">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- Newsletter Section ---------- */}
            <section className="bg-zinc-100 py-16 px-4">
                <div className="max-w-2xl mx-auto text-center">

                    <h2 className="text-2xl md:text-3xl font-thin tracking-wide mb-4 text-black">
                        JOIN OUR NEWSLETTER
                    </h2>

                    <p className="text-gray-600 mb-8 text-sm md:text-base">
                        Be the first to know about new collections and exclusive offers.
                    </p>

                    {/* Input + Button */}
                    <div className="flex flex-col sm:flex-row max-w-xl mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="Email"
                            className="flex-1 px-6 py-3 border bg-white border-gray-400 focus:border-gray-900 transition text-sm outline-none"
                        />

                        <button
                            onClick={handleSubmit}
                            className="bg-gray-900 text-white px-8 py-3 text-sm font-medium uppercase tracking-wide cursor-pointer"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Features;
