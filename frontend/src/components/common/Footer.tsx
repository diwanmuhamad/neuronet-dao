import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-16 px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg"></div>
              <span className="text-white font-bold text-xl">
                NeuroNet DAO
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-md">
              The premier decentralized AI marketplace for buying and selling
              prompts, datasets, and AI outputs. Built on the Internet
              Computer for true decentralization.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <span className="text-gray-400">𝕏</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <span className="text-gray-400">📧</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <span className="text-gray-400">💬</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Marketplace</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <Link href="/marketplace" className="block hover:text-white">
                Browse All
              </Link>
              <a href="#" className="block hover:text-white">
                Prompts
              </a>
              <a href="#" className="block hover:text-white">
                Datasets
              </a>
              <a href="#" className="block hover:text-white">
                AI Outputs
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Create</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="#" className="block hover:text-white">
                Sell Prompts
              </a>
              <a href="#" className="block hover:text-white">
                Creator Guide
              </a>
              <a href="#" className="block hover:text-white">
                Community
              </a>
              <a href="#" className="block hover:text-white">
                Resources
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="#" className="block hover:text-white">
                Help Center
              </a>
              <a href="#" className="block hover:text-white">
                Documentation
              </a>
              <a href="#" className="block hover:text-white">
                Contact Us
              </a>
              <a href="#" className="block hover:text-white">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} NeuroNet DAO. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}