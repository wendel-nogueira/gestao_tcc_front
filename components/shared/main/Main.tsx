export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full max-w-7xl h-full min-h-[calc(100vh-56px)] py-2 px-3 mx-auto">
      {children}
    </main>
  );
}
