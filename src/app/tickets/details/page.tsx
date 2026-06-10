"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Linha corrigida aqui!

// Interface para estruturar os popups
interface PopupConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "info" | "comment";
}

// Interface para estruturar os comentários dinâmicos
interface CommentItem {
  id: number;
  author: string;
  date: string;
  text: string;
}

export default function TicketDetailsPage() {
  const router = useRouter();
  
  // Estado para os popups
  const [popup, setPopup] = useState<PopupConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  // Estado para controlar o texto de um NOVO comentário
  const [newComment, setNewComment] = useState("");

  // Lista de comentários dinâmica
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 1,
      author: "Renata Oliveira",
      date: "12/11 - 09:04",
      text: "Problema identificado ao tentar gerar o relatório. Urgente pois precisamos dos dados para a reunião de diretoria.",
    },
    {
      id: 2,
      author: "Marcos Teixeira",
      date: "13/11 - 11:35",
      text: "Estou investigando o problema. Parece estar relacionado a uma atualização recente no módulo de exportação. Vou priorizar a correção.",
    },
    {
      id: 3,
      author: "Marcos Teixeira",
      date: "14/11 - 18:10",
      text: "Encontrei a causa raiz. Um conflito na versão da biblioteca de geração de PDF. Estou aplicando o patch agora.",
    },
  ]);

  // Estados para controle da edição em linha
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleCloseTicket = () => {
    setPopup({
      isOpen: true,
      title: "Chamado Fechado!",
      message: "O chamado foi fechado com sucesso em nosso sistema.",
      type: "success",
    });
  };

  const handleReopenTicket = () => {
    setPopup({
      isOpen: true,
      title: "Chamado Reaberto!",
      message: "O chamado foi reaberto e já está disponível para a equipe técnica.",
      type: "info",
    });
  };

  const handleOpenCommentPopup = () => {
    setNewComment(""); 
    setPopup({
      isOpen: true,
      title: "Adicionar Comentário",
      message: "Digite abaixo as informações que deseja acrescentar ao chamado:",
      type: "comment",
    });
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const newObj: CommentItem = {
      id: Date.now(),
      author: "Usuário Atual",
      date: "Agora mesmo",
      text: newComment,
    };

    setComments((prev) => [...prev, newObj]);

    setPopup({
      isOpen: true,
      title: "Comentário Enviado!",
      message: "O seu comentário foi adicionado ao histórico com sucesso.",
      type: "success",
    });
  };

  const handleStartEdit = (comment: CommentItem) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const handleSaveEdit = (id: number) => {
    if (!editText.trim()) return;

    setComments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: editText } : item))
    );

    setEditingCommentId(null);
    setEditText("");
  };

  const closePopup = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">
        
        {popup.isOpen && (
          <div className="absolute inset-0 w-full h-full z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[290px] p-5 rounded-2xl shadow-2xl border border-slate-100 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              
              {popup.type === "success" && (
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-emerald-50 text-emerald-600 text-xl font-bold border border-emerald-100">✓</div>
              )}
              {popup.type === "info" && (
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-blue-50 text-blue-600 text-xl font-bold border border-blue-100">🔄</div>
              )}
              {popup.type === "comment" && (
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-blue-50 text-blue-600 text-xl font-bold border border-blue-100">💬</div>
              )}
              
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-800">{popup.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed px-1">{popup.message}</p>
              </div>

              {popup.type === "comment" ? (
                <div className="space-y-3 text-left">
                  <textarea
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escreva aqui..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white resize-none text-slate-700 font-medium placeholder:text-slate-400 transition"
                  />
                  <div className="flex gap-2">
                    <button onClick={closePopup} className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2.5 rounded-xl transition">Cancelar</button>
                    <button onClick={handleSubmitComment} disabled={!newComment.trim()} className="w-1/2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md shadow-blue-100">Enviar</button>
                  </div>
                </div>
              ) : (
                <button onClick={closePopup} className={`w-full text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md ${popup.type === "success" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"}`}>Entendido</button>
              )}
            </div>
          </div>
        )}
        
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

        <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-24">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push("/tickets")} 
              className="text-blue-600 text-lg font-bold hover:opacity-75"
            >
              ←
            </button>
            <h1 className="text-base font-black text-slate-800">Meus Chamados</h1>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3.5">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-blue-500 font-mono">#TK-20487</span>
              <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">Em Andamento</span>
            </div>

            <h2 className="font-black text-sm text-slate-800 leading-tight">Erro ao gerar relatório financeiro mensal</h2>

            <div className="text-[11px] space-y-2 pt-1 border-t border-slate-50">
              <div className="flex justify-between"><span className="text-slate-400">Categoria</span><span className="font-bold text-slate-700">Financeiro</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Prioridade</span><span className="font-bold text-rose-600">Alta</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Criado em</span><span className="font-medium text-slate-700">12/11/2026 - 09:04</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Última atualização</span><span className="font-medium text-slate-700">14/11/2026 - 18:10</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Responsável</span><span className="font-bold text-slate-700">Marcos Teixeira</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Solicitante</span><span className="font-bold text-slate-700">Renata Oliveira</span></div>
            </div>

            <p className="text-[11px] text-slate-600 bg-slate-50/50 border border-slate-100 p-3 rounded-xl leading-relaxed">
              Ao tentar gerar o relatório financeiro do mês de outubro, o sistema exibe a mensagem Erro Interno do Servidor - código 500. O problema ocorre após selecionar o período e clicar em Gerar. Já tentei limpar o cache e usar outro navegador, mas o erro persiste.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={handleCloseTicket} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm">Fechar</button>
            <button onClick={handleReopenTicket} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm">Reabrir</button>
            <button className="w-full bg-white border border-blue-200 text-blue-600 hover:bg-slate-50 font-bold text-xs py-2.5 rounded-xl transition shadow-sm">Anexar</button>
            <button onClick={handleOpenCommentPopup} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm">Comentar</button>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><span>📎</span> Anexos (2)</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-base">📄</span>
                  <div>
                    <p className="font-bold text-slate-700">relatorio_outubro.pdf</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">345 KB</p>
                  </div>
                </div>
                <a href="#" download="relatorio_outubro.pdf" className="text-blue-500 hover:opacity-70 text-xs p-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition">📥</a>
              </div>

              <div className="flex justify-between items-center bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-base">🖼️</span>
                  <div>
                    <p className="font-bold text-slate-700">screenshot_erro.png</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">1.2 MB</p>
                  </div>
                </div>
                <a href="#" download="screenshot_erro.png" className="text-blue-500 hover:opacity-70 text-xs p-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition">📥</a>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><span>💬</span> Comentários ({comments.length})</h3>
            
            <div className="space-y-3 text-[11px]">
              {comments.map((item) => (
                <div key={item.id} className="space-y-1 pb-3 border-b border-slate-100 last:border-none last:pb-0">
                  <div className="flex justify-between items-center font-bold">
                    <div className="space-x-1.5">
                      <span className="text-blue-600">{item.author}</span>
                      <span className="text-slate-400 font-medium text-[10px]">{item.date}</span>
                    </div>
                    {editingCommentId !== item.id && (
                      <button onClick={() => handleStartEdit(item)} className="text-slate-400 hover:text-blue-600 text-[10px] transition font-semibold">Editar</button>
                    )}
                  </div>

                  {editingCommentId === item.id ? (
                    <div className="space-y-2 mt-1.5">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 text-xs bg-slate-50 border border-blue-400 rounded-xl focus:outline-none resize-none text-slate-700 font-medium"
                        rows={3}
                      />
                      <div className="flex justify-end gap-1.5">
                        <button onClick={handleCancelEdit} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-bold transition">Cancelar</button>
                        <button onClick={() => handleSaveEdit(item.id)} disabled={!editText.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1 rounded-lg text-[10px] font-bold transition">Salvar</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 leading-normal">{item.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </main>

        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-4 rounded-t-xl z-10">
          <button onClick={() => router.push("/")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-semibold mt-0.5">Início</span>
          </button>
          <button onClick={() => router.push("/tickets")} className="flex flex-col items-center text-blue-600">
            <span className="text-lg">🎟️</span>
            <span className="text-[10px] font-bold mt-0.5">Tickets</span>
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