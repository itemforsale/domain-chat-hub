import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AboutContent = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-blue-500 hover:underline">
        DomainChatbox.com: Connecting Domain Name Investors Worldwide
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            About DomainChatbox.com
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(80vh-100px)] pr-4">
          <div className="space-y-6 text-left">
            <p className="text-lg">
              Welcome to DomainChatbox.com, the ultimate platform for domain name investors to connect, collaborate, and thrive in the dynamic world of digital real estate. Whether you're a seasoned domain trader or just stepping into the domain investment arena, this is your hub for building relationships, sharing insights, and staying ahead of market trends.
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-4">Why DomainChatbox.com?</h2>
              <h3 className="text-lg font-semibold mb-2">A Thriving Community</h3>
              <p>
                Join a vibrant network of domain enthusiasts, industry experts, and aspiring investors. Exchange ideas, strategies, and tips with like-minded individuals who understand the value of a great domain name.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Exclusive Forums and Discussions</h3>
              <p>Dive into topic-specific forums tailored to your interests:</p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Buy/Sell/Trade Domains: Connect with buyers and sellers to close profitable deals.</li>
                <li>Investment Strategies: Discover techniques to maximize ROI in the domain market.</li>
                <li>Industry Trends: Stay informed about the latest developments in domains, including TLD launches, market prices, and emerging niches.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Expert Advice</h3>
              <p>
                Tap into the expertise of seasoned domain investors who've navigated the ups and downs of the industry. Get practical advice on valuation, acquisitions, branding, and legal considerations.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Tools and Resources</h3>
              <p>Explore a suite of tools designed to make your domain investing journey smoother:</p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Valuation calculators</li>
                <li>Marketplace analysis</li>
                <li>Portfolio management tips</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Real-Time Networking</h3>
              <p>
                Utilize live chat features to connect instantly with investors worldwide. Build partnerships, negotiate deals, or simply share your passion for the business.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Get Started Today!</h2>
              <p>
                DomainChatbox.com is more than just a website; it's a community-driven platform where opportunities are created and connections are made. Whether you're flipping domains for a quick profit or building a long-term portfolio, this is your go-to space for everything domains.
              </p>
              <p className="mt-4">
                Sign up now and start a conversation that could lead to your next big deal. At DomainChatbox.com, your network is your net worth!
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};