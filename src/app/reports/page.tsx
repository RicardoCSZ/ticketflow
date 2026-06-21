"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Metricas {
  totalChamados: number;
  taxaResolucao: string;
  abertosHoje: number;
  tempoMedio: string;
}

// Interface para listar os dados do relatório gerado
interface ItemRelatorio {
  agrupador: string;
  quantidade: number;
  porcentagem: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [period, setPeriod] = useState("Últimos 7 dias");
  const [reportType, setReportType] = useState("Chamados por Status");
  
  // Estados de controle e dados
  const [stats, setStats] = useState<Metricas>({ totalChamados: 0, taxaResolucao: "0%", abertosHoje: 0, tempoMedio: "0h" });
  const [graficoBarras, setGraficoBarras] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Novos estados para a geração do relatório detalhado
  const [dadosRelatorio, setDadosRelatorio] = useState<ItemRelatorio[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [relatorioGerado, setRelatorioGerado] = useState(false);

  // Carrega o dashboard inicial (Gráfico e contadores)
  useEffect(() => {
    async function loadReportData() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/reports/stats?period=${encodeURIComponent(period)}&reportType=${encodeURIComponent(reportType)}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setStats(data.stats);
          setGraficoBarras(data.grafico);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do relatório:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReportData();
  }, [period, reportType]);

  // Função disparada ao clicar no botão "Gerar"
  // ... (mantenha seus imports e estados)

const handleGerarRelatorio = async () => {
  setIsGenerating(true);
  try {
    const res = await fetch(`/api/reports/stats?reportType=${encodeURIComponent(reportType)}`);
    const data = await res.json();

    if (data.success && data.dados) {
      const total = data.dados.reduce((acc: number, item: any) => acc + item.quantidade, 0);
      
      const itensFormatados = data.dados.map((item: any) => ({
        agrupador: item.agrupador || "N/A",
        quantidade: item.quantidade,
        porcentagem: total > 0 ? `${Math.round((item.quantidade / total) * 100)}%` : "0%"
      }));

      setDadosRelatorio(itensFormatados);
      setRelatorioGerado(true);
    }
  } catch (error) {
    console.error("Erro ao gerar:", error);
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      
      {/* Container do Dispositivo Móvel */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">
        
        {/* Header Superior Azul */}
        <header className="bg-blue-600 text-white px-5 pt-6 pb-5 rounded-b-2xl shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎫</span>
            <span className="font-bold text-lg tracking-wide">TicketMS</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <button onClick={() => router.push("/notifications")} className="hover:opacity-80">🔔</button>
            <button   onClick={() => router.push("/login")}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.8" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="transform translate-y-[-0.5px]"                    >
                      {/* O arco circular aberto no topo */}
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />

                      {/* A linha vertical central */}
                      <line x1="12" y1="2" x2="12" y2="12" />
                    </svg></button>
          </div>
        </header>

        {/* Conteúdo Principal com Scroll */}
        <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-24">
          
          {/* Título com botão de voltar */}
          <div className="flex items-center gap-3 px-0.5">
            <button 
              onClick={() => router.push("/")} 
              className="text-blue-600 text-lg font-bold hover:opacity-75"
            >
              ←
            </button>
            <h1 className="text-base font-black text-slate-800">Relatórios</h1>
          </div>

          {/* Card: Painel de Análises (Gráfico Dinâmico) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="text-xl bg-blue-50 text-blue-600 p-2 rounded-xl">📊</span>
              <div>
                <h3 className="font-extrabold text-xs text-slate-800">Painel de Análises</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Métricas baseadas em {reportType}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 h-32 flex items-end justify-between gap-1.5 pt-6 relative border border-slate-100">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-400 animate-pulse">
                  Carregando gráfico...
                </div>
              ) : (
                graficoBarras.map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col justify-end h-full">
                    <div 
                      className="w-full bg-blue-600 rounded-t-sm transition-all duration-500" 
                      style={{ height: `${height}%` }}
                    ></div>
                    <div 
                      className="w-full bg-amber-500 rounded-b-sm transition-all duration-500" 
                      style={{ height: `${height * 0.2}%` }}
                    ></div>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => router.push("/reports/dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-sm shadow-blue-100"
            >
              Ver Painel Complexo
            </button>
          </div>

          {/* Resumo Rápido Dinâmico */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 px-0.5">Resumo Rápido</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/40 text-center">
                <p className="text-xl font-black text-blue-600">{isLoading ? "..." : stats.totalChamados}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Total de Chamados</p>
              </div>
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/40 text-center">
                <p className="text-xl font-black text-blue-600">{isLoading ? "..." : stats.taxaResolucao}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Taxa de Resolução</p>
              </div>
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/40 text-center">
                <p className="text-xl font-black text-blue-600">{isLoading ? "..." : stats.abertosHoje}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Abertos Hoje</p>
              </div>
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/40 text-center">
                <p className="text-xl font-black text-blue-600">{isLoading ? "..." : stats.tempoMedio}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Tempo Médio</p>
              </div>
            </div>
          </div>

          {/* Formulário: Gerar Relatório */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold text-slate-800">Gerar Relatório</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Período</label>
                <select 
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 outline-none focus:border-blue-500 shadow-sm"
                >
                  <option>Últimos 7 dias</option>
                  <option>Últimos 30 dias</option>
                  <option>Este Mês</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Tipo de Relatório</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 outline-none focus:border-blue-500 shadow-sm"
                >
                  <option>Chamados por Status</option>
                  <option>Desempenho Técnico</option>
                  <option>Volumetria Mensal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Botão Gerar Atualizado com Função onClick */}
              <button 
                onClick={handleGerarRelatorio}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm"
              >
                {isGenerating ? "Processando..." : "Gerar"}
              </button>
              {/*<button 
                type="button"
                onClick={() => router.push("/reports/export")}
                className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs py-2.5 rounded-xl transition shadow-sm"
              >
                Exportar
              </button>*/}
            </div>
          </div>

            {/* 📊 NOVA SEÇÃO: Resultado do Relatório Gerado em tempo real */}
            {relatorioGerado && (
            <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/10 shadow-md space-y-3 animate-fadeIn">
                <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider text-emerald-700">📋 Resultado Gerado</h3>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Sucesso</span>
                </div>
                
                <div className="space-y-2">
                {/* CABEÇALHO CORRIGIDO: Usando Grid de 3 colunas para alinhar perfeitamente */}
                <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 border-b pb-1 px-1">
                    <span className="col-span-6">{reportType === "Chamados por Status" ? "Status" : "Agrupamento"}</span>
                    <span className="col-span-3 text-center">Qtd</span>
                    <span className="col-span-3 text-right">Proporção</span>
                </div>

                {/* LINHAS CORRIGIDAS: Mesma divisão de Grid para separar os números */}
                {dadosRelatorio.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 items-center text-[11px] py-1.5 border-b border-slate-100 last:border-none px-1">
                    <span className="col-span-6 font-bold text-slate-700 truncate">{item.agrupador}</span>
                    <span className="col-span-3 text-center font-semibold text-slate-600 bg-slate-50 rounded py-0.5">{item.quantidade}</span>
                    <span className="col-span-3 text-right font-black text-blue-600">{item.porcentagem}</span>
                    </div>
                ))}
                </div>
            </div>
            )}

          

        </main>

        {/* Menu de Navegação Inferior Móvel */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-2 rounded-t-xl z-10">
          <button onClick={() => router.push("/")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-semibold mt-0.5">Início</span>
          </button>
          <button onClick={() => router.push("/tickets")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🎟️</span>
            <span className="text-[10px] font-semibold mt-0.5">Tickets</span>
          </button>
          <button className="flex flex-col items-center text-blue-600">
            <span className="text-lg">📊</span>
            <span className="text-[10px] font-bold mt-0.5">Relatórios</span>
          </button>
          <button onClick={() => router.push("/profile")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">👤</span>
            <span className="text-[10px] font-semibold mt-0.5">Perfil</span>
          </button>
        </nav>

      </div>
    </div>
  );
}