"use client";

import { useRouter } from "next/navigation"; // 1. Importa o roteador do Next.js

export default function LoginPage() {
  const router = useRouter(); // 2. Inicializa o roteador

  // 3. Função que lida com o clique de login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui no futuro você colocará a validação de e-mail e senha.
    // Por enquanto, ele vai direto para a tela inicial:
    router.push("/"); 
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        
        {/* Cabeçalho do Formulário */}
        <div className="text-center mb-8">
          <span className="text-3xl">🎫</span>
          <h1 className="text-3xl font-bold text-slate-800 mt-2">TicketFlow</h1>
          <p className="text-sm text-slate-500 mt-1">Sistema de gerenciamento de tickets</p>
        </div>

        {/* Mensagem de Boas-vindas */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-700">Bem-vindo!</h2>
          <p className="text-sm text-slate-400">Inicie sessão na sua conta para continuar.</p>
        </div>

        {/* Formulário de Login */}
        <form className="space-y-4" onSubmit={handleLogin}> {/* 4. Chama a função de login aqui */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              E-mail
            </label>
            <input 
              type="email" 
              placeholder="seuemail@gmail.com"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              Senha
            </label>
            <input 
              type="password" 
              placeholder="sua senha"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800"
              required
            />
          </div>

          <button 
  type="button"
  onClick={() => router.push("/forgot-password")}
  className="text-xs text-blue-600 hover:underline font-semibold"
>
  Esqueceu sua senha?
</button>

          <button 
            type="submit" 
            className="w-full rounded-lg bg-blue-600 p-3 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-md shadow-blue-200"
          >
            Login
          </button>
        </form>

        {/* Rodapé */}
        <div className="text-center mt-6 text-sm text-slate-500">
          Não tem uma conta? <a href="#" className="text-blue-600 font-medium hover:underline">Contate Administrador</a>
        </div>

      </div>
    </main>
  );
}