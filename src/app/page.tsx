import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image
              src="/logo.svg"
              alt="Mistral AI"
              width={120}
              height={40}
              priority
            />
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                Models Benchmarking
              </h1>
              <p className="text-sm text-gray-600">
                Project for the Software Engineer Internship Application
              </p>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Prompt Input Area */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Test Prompt</h3>
          </div>
          <div className="p-6">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              rows={4}
              placeholder="Enter your prompt here to test all models..."
              disabled
            />
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                This will send the same prompt to all selected models
              </div>
              <button
                className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Run Benchmark
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Model Comparison</h2>
            <p className="text-sm text-gray-500 mt-1">
              Compare responses from different Mistral AI models
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judge 1 (Unbiased)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judge 2 (Biased)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Premier Models */}
                <tr className="bg-orange-50">
                  <td colSpan={4} className="px-6 py-2 text-xs font-semibold text-orange-800 uppercase tracking-wider">
                    Premier Models
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Mistral Large</div>
                    <div className="text-sm text-gray-500">mistral-large-latest</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 italic">
                      Waiting for prompt...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">-</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">-</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Mistral Small</div>
                    <div className="text-sm text-gray-500">mistral-small-latest</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 italic">
                      Waiting for prompt...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">-</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">-</div>
                  </td>
                </tr>
                
                {/* Open Models */}
                <tr className="bg-blue-50">
                  <td colSpan={4} className="px-6 py-2 text-xs font-semibold text-blue-800 uppercase tracking-wider">
                    Open Models
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Mistral 7B</div>
                    <div className="text-sm text-gray-500">open-mistral-7b</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 italic">
                      Waiting for prompt...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">-</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">-</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Mixtral 8x7B</div>
                    <div className="text-sm text-gray-500">open-mixtral-8x7b</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 italic">
                      Waiting for prompt...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">-</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">-</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
