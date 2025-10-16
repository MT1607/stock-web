const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}

export default DashboardLayout;