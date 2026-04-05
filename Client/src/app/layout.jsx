import "./globals.css";

export const metadata = {
  title: "Just Buy",
  description: "Just Buy e-commerce app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
