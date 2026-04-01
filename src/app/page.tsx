import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🚀 HyperZone</h1>
        <p className="text-xl text-gray-600 mb-8">
          Cross-border E-commerce Fulfillment System - Project initialized successfully!
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-semibold mb-3 text-blue-900">
            Project successfully initialized
          </h2>
          <ul className="text-left text-sm space-y-2 text-blue-800">
            <li>Next.js 14 App Router</li>
            <li>TypeScript strict mode</li>
            <li>Tailwind CSS</li>
            <li>Figma design resources imported</li>
            <li>Development specification files created</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
