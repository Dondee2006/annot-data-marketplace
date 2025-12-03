import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Navigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            The Ethical African Data
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Marketplace for the World
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Upload datasets, earn tokens, and access high-quality, ethically sourced African data
            to power AI innovation worldwide.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/upload"
              className="px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start Uploading
            </Link>
            <Link
              href="/marketplace"
              className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-bold text-lg hover:bg-purple-50 transition-all"
            >
              Browse Datasets
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">5-7</div>
            <div className="text-gray-600">Tokens per Upload</div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">8+</div>
            <div className="text-gray-600">File Formats Supported</div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-gray-600">Quality Verified</div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-5xl mb-4">📤</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Upload Data</h3>
              <p className="text-gray-600">
                Upload text, audio, images, video, or tabular datasets
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. Get Verified</h3>
              <p className="text-gray-600">
                Our team reviews your data for quality and authenticity
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Earn Tokens</h3>
              <p className="text-gray-600">
                Receive tokens when your data is approved
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">4. Power AI</h3>
              <p className="text-gray-600">
                Your data helps build fair, inclusive AI systems
              </p>
            </div>
          </div>
        </div>

        {/* Supported Formats */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-12 text-white mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Supported Data Formats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">📄</div>
              <div className="font-medium">Text (.txt, .json)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎵</div>
              <div className="font-medium">Audio (.mp3, .wav)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🖼️</div>
              <div className="font-medium">Images (.jpg, .png)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎬</div>
              <div className="font-medium">Video (.mp4)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="font-medium">Tabular (.csv)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🔜</div>
              <div className="font-medium">More Coming Soon</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the movement to make AI more inclusive and representative.
            Upload your data today and start earning tokens.
          </p>
          <Link
            href="/upload"
            className="inline-block px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Upload Your First Dataset
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-gray-400">
            © 2025 Annot Data Marketplace. Empowering AI with African data.
          </p>
        </div>
      </footer>
    </div>
  );
}

