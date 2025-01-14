import "./globals.css"; // <-- L'essentiel est là !

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased bg-background text-foreground font-sans">
        {/* ... */}
        {children}
      </body>
    </html>
  );
}
