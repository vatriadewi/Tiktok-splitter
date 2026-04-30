export const metadata = {
  title: 'TikTok Splitter',
  description: 'Pecah skrip jadi hook, value, cta',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
