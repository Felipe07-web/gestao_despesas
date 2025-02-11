import LoginLinks from "@/app/LoginLinks";

export const metadata = {
  title: "Gestão de Despesas - Laravel Breeze + Next.js",
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white flex flex-col items-center justify-center px-6">
      {/* Navbar */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Gestão de Despesas</h1>
        <LoginLinks />
      </header>

      {/* Hero Section */}
      <main className="text-center max-w-3xl mt-10">
        <h2 className="text-4xl font-extrabold leading-tight">
          Controle suas Finanças <span className="text-blue-400">com Facilidade</span>
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Uma plataforma simples, eficiente e intuitiva para gerenciar suas despesas. 
          Acompanhe gastos, visualize relatórios e mantenha o controle do seu orçamento.
        </p>
        <a
          href="/dashboard"
          className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg"
        >
          Comece Agora
        </a>
      </main>

      {/* Features Section */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        <FeatureCard
          title="Monitoramento Inteligente"
          description="Veja gráficos e relatórios detalhados para entender melhor seus gastos."
          icon="📊"
        />
        <FeatureCard
          title="Orçamento Personalizado"
          description="Defina metas financeiras e receba alertas para manter seu orçamento em dia."
          icon="💰"
        />
        <FeatureCard
          title="Segurança Garantida"
          description="Seus dados são protegidos com as melhores práticas de segurança."
          icon="🔒"
        />
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-400">
        <p>© 2025 Gestão de Despesas. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

// Componente para cada Feature
const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-300 mt-2">{description}</p>
    </div>
  );
};

export default Home;
