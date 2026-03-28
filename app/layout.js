import './globals.css';

export const metadata = {
  title: 'Lifeline Core | Universal Intent-to-Action Bridge',
  description: 'Gemini-powered AI bridge that translates messy, unstructured human input into structured, life-saving emergency actions.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
