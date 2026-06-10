"use client";

import { useState, useRef } from "react"; // Importação do useRef adicionada
import { useRouter } from "next/navigation";

export default function NewTicketPage() {
  const router = useRouter();
  const [priority, setPriority] = useState("Baixa");
  
  // 1. Estados e Referências adicionados para gerenciar o arquivo nativo
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 2. Função para simular o clique no input oculto
  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 3. Função para capturar o arquivo quando selecionado
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">
        
        {/* Header Superior Azul */}
        <header className="bg-blue-600 text-white px-5 pt-6 pb-5 rounded-b-2xl shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎫</span>
            <span className="font-bold text-lg tracking-wide">TicketMS</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <button className="hover:opacity-80">🔔</button>
            <button className="hover:opacity-80">⚙️</button>
          </div>
        </header>

        {/* Formulário */}
        <main className="flex-1 px-5 py-5 space-y-5 overflow-y-auto pb-24">
          
          {/* Título com botão de voltar */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push("/")} 
              className="text-blue-600 text-lg font-bold hover:opacity-75"
            >
              ←
            </button>
            <h1 className="text-base font-black text-slate-800">Novo Chamado</h1>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            
            {/* Título do Chamado */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Título do Chamado
              </label>
              <input 
                type="text" 
                placeholder="Ex: Erro ao acessar o sistema" 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Categoria
              </label>
              <div className="relative">
                <select className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-500 outline-none appearance-none shadow-sm focus:border-blue-500">
                  <option>Selecione uma categoria</option>
                  <option>Suporte de TI</option>
                  <option>Infraestrutura</option>
                  <option>Sistemas</option>
                </select>
                <span className="absolute right-4 top-3.5 text-slate-400 text-[10px]">▼</span>
              </div>
            </div>

            {/* Prioridade */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Prioridade
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["Baixa", "Média", "Alta", "Crítica"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      priority === p
                        ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm"
                        : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Descrição
              </label>
              <textarea 
                rows={4}
                placeholder="Descreva o problema detalhadamente..." 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm resize-none"
              ></textarea>
            </div>

            {/* Anexar Arquivo — Atualizado e Funcional */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Anexar Arquivo
              </label>
              
              {/* O input HTML real fica invisível aqui através da classe hidden */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.png,.jpg,.jpeg,.docx"
              />

              {/* A caixa estilizada agora escuta o evento de clique */}
              <div 
                onClick={handleBoxClick}
                className={`border-2 border-dashed rounded-xl p-6 bg-white text-center cursor-pointer transition ${
                  selectedFile ? "border-blue-500 bg-blue-50/20" : "border-slate-200 hover:bg-slate-50/50"
                }`}
              >
                {selectedFile ? (
                  <>
                    <span className="text-xl block mb-2">📎</span>
                    <p className="text-xs font-bold text-slate-800 truncate px-4">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      { (selectedFile.size / (1024 * 1024)).toFixed(2) } MB — Clique para alterar
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-xl block mb-2">☁️</span>
                    <p className="text-xs font-bold text-blue-600">Toque para anexar arquivos</p>
                    <p className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG, DOCX (máx. 10MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                type="button"
                onClick={() => router.push("/")}
                className="w-full bg-white border border-blue-500 text-blue-600 py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
              > Cancelar
              </button>
              <button   
                type="submit"   
                onClick={(e) => {    
                  e.preventDefault(); 
                  router.push("/tickets/new-tickets/success");   
                }}  
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition"
              >
                Enviar Chamado
              </button>
            </div>
          </form>

        </main>

        {/* Menu de Navegação Inferior */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-4 rounded-t-xl z-10">
          <button onClick={() => router.push("/")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-semibold mt-0.5">Início</span>
          </button>
          <button onClick={() => router.push("/tickets")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🎟️</span>
            <span className="text-[10px] font-semibold mt-0.5">Tickets</span>
          </button>
          <button className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">👤</span>
            <span className="text-[10px] font-semibold mt-0.5">Perfil</span>
          </button>
        </nav>

      </div>
    </div>
  );
}