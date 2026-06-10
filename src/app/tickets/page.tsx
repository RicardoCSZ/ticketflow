"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TicketsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Todos");

  const [tickets] = useState([
    { id: "MTS-1042", title: "Erro ao acessar relatório financeiro", desc: "Sistema apresenta erro 500 ao tentar gerar relatório manual de finanças.", date: "10 Jun 2026", status: "Aberto", priority: "Alta", priorityColor: "text-rose-600 bg-rose-50" },
    { id: "MTS-1039", title: "Solicitação de novo equipamento", desc: "Preciso de um monitor adicional para a estação de trabalho TI-03.", date: "10 Jun 2026", status: "Em Andamento", priority: "Média", priorityColor: "text-amber-600 bg-amber-50" },
    { id: "MTS-1028", title: "Atualização do sistema de e-mail", desc: "Migração das contas de e-mail para o novo servidor concluída.", date: "08 Jun 2026", status: "Aberto", priority: "Baixa", priorityColor: "text-teal-600 bg-teal-50" },
    { id: "MTS-1025", title: "VPN não conecta remotamente", desc: "Conexão VPN falha ao tentar acessar a rede corporativa de casa.", date: "03 Jun 2026", status: "Aberto", priority: "Alta", priorityColor: "text-rose-600 bg-rose-50" },
    { id: "MTS-1021", title: "Permissão de acesso à pasta compartilhada", desc: "Necessito acesso de leitura e escrita na pasta do departamento de RH.", date: "25 Mai 2026", status: "Em Andamento", priority: "Média", priorityColor: "text-amber-600 bg-amber-50" },
  ]);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">
        
        {/* Header Superior Azul */}
        <header className="bg-blue-600 text-white px-5 pt-6 pb-5 rounded-b-2xl shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎫</span>
            <span className="font-bold text-lg tracking-wide">TicketMS</span>
          </div>
        </header>

        {/* Listagem */}
        <main className="flex-1 px-4 py-5 space-y-4 overflow-y-auto pb-24">
          
          {/* Cabeçalho de Seção com Link para voltar ao Dashboard */}
          <div className="flex justify-between items-center px-0.5">
            <h1 className="text-xl font-black text-slate-800">Meus Chamados</h1>
            <button 
              onClick={() => router.push("/reports")} 
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Dashboard
            </button>
          </div>

          {/* Campo de Busca */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar chamados..." 
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm"
            />
            <span className="absolute right-3.5 top-3 text-slate-400 text-xs">🔍</span>
          </div>

          {/* Filtros horizontais em carrossel */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["Todos", "Abertos", "Em Andamento", "Fechados"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                  activeFilter === filter 
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100" 
                    : "bg-white border-slate-200 text-blue-500 hover:bg-slate-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Lista de Cards de Chamados */}
          <div className="space-y-3">
            {/* Lista de Cards de Chamados */}
<div className="space-y-3">
  {tickets.map((ticket) => (
      
    <div 
      key={ticket.id} 
      onClick={() => router.push("/tickets/details")} // <-- AJUSTE AQUI: Redireciona para a tela de detalhes
      className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-2.5 cursor-pointer hover:border-blue-300 transition active:scale-[0.99]" // <-- AJUSTE AQUI: Adicionado cursor e efeito visual
    >
      
      {/* ID do Ticket & Status Flutuante se houver */}
      <div className="flex justify-between items-center text-[11px] font-bold">
        <span className="text-blue-500 font-mono">{ticket.id}</span>
        {ticket.status === "Em Andamento" && (
          <span className="text-slate-700 text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
            Em Andamento
          </span>
        )}
      </div>

      {/* Título e Descrição */}
      <div>
        <h3 className="font-extrabold text-sm text-slate-800 leading-tight">{ticket.title}</h3>
        <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">{ticket.desc}</p>
      </div>

      {/* Rodapé do Card */}
      <div className="flex justify-between items-center pt-1 border-t border-slate-50 text-[10px] text-slate-400 font-medium">
        <div className="flex items-center gap-1">
          <span>📅</span>
          <span>{ticket.date}</span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold ${ticket.priorityColor}`}>
          <span>🔴</span>
          <span>{ticket.priority}</span>
        </div>
      </div>

    </div>
  ))}
</div>
          </div>

        </main>

        {/* Menu de Navegação Inferior Fixo */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-4 rounded-t-xl z-10">
          <button onClick={() => router.push("/")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-semibold mt-0.5">Início</span>
          </button>
          <button className="flex flex-col items-center text-blue-600">
            <span className="text-lg">🎟️</span>
            <span className="text-[10px] font-bold mt-0.5">Tickets</span>
          </button>
          <button  onClick={() => router.push("/")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">👤</span>
            <span className="text-[10px] font-semibold mt-0.5">Perfil</span>
          </button>
        </nav>

      </div>
    </div>
  );
}