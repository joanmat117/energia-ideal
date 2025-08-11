export default function Footer(){
    return (
        <footer className="bg-accent-700 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{nicheMetadata.web_name}</h3>
                  <p className="text-gray-300">
                    {nicheMetadata.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2 text-gray-200">
                    <li>
                      <a href="/privacy-policy.html" className="hover:text-white">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="/legal-advise.html" className="hover:text-white">
                        Legal Notice
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-white/50 mt-8 pt-8 text-center text-gray-100">
                <p>&copy; 2025 {nicheMetadata.web_name}. All rights reserved.</p>
              </div>
            </div>
          </footer>
    )
}