import './globals.css';
import SkipLink from '../components/SkipLink';

export const metadata = {
  title: 'Lifeline Core | Universal Intent-to-Action Bridge',
  description: 'Gemini-powered AI bridge that translates messy, unstructured human input into structured, life-saving emergency actions.',
  keywords: ['emergency', 'AI', 'Gemini', 'triage', 'crisis', 'dispatch', 'Google'],
  authors: [{ name: 'Lifeline Core Team' }],
  openGraph: {
    title: 'Lifeline Core',
    description: 'From Chaos to Structured Action — powered by Google Gemini AI.',
    type: 'website',
  },
};

/**
 * Root layout component. Wraps the entire application with global styles,
 * semantic HTML structure, accessibility attributes, and skip-navigation link.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child page content.
 * @returns {JSX.Element}
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
