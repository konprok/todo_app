import "./globals.css";

export const metadata = {
  title: "My TODO App",
  description: "Simple TODO Application with .NET backend",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="cupcake">
      <body className="bg-gray-50 text-gray-800">
        {children}
      </body>
    </html>
  );
}
