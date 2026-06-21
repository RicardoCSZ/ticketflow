import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "uninga2025",
  database: "db_ticket_ms",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get("reportType") || "Chamados por Status";

    // Busca colunas para dinamismo
    const [columns]: any = await pool.query("SHOW COLUMNS FROM chamados");
    const listaDeColunas = columns.map((c: any) => c.Field.toLowerCase());
    const colunaStatus = listaDeColunas.includes("status_chamado") ? "status_chamado" : "status";

    // Variáveis que sempre serão enviadas
    let graficoFormatado: number[] = [40, 60, 35, 70, 80];
    let dadosResposta: any[] = [];

    // Query de dados reais
    if (reportType === "Chamados por Status") {
      const [rows]: any = await pool.query(
        `SELECT ${colunaStatus} AS agrupador, COUNT(*) AS quantidade 
         FROM chamados GROUP BY ${colunaStatus} LIMIT 10`
      );
      
      dadosResposta = rows;
      const valores = rows.map((r: any) => r.quantidade);
      const max = Math.max(...valores, 1);
      graficoFormatado = valores.map((v: number) => Math.round((v / max) * 90) + 10);
    }

    // Busca estatísticas gerais (Resumo Rápido)
    const [totalRows]: any = await pool.query("SELECT COUNT(*) AS total FROM chamados");
    const [resolvidosRows]: any = await pool.query(`SELECT COUNT(*) AS total FROM chamados WHERE LOWER(${colunaStatus}) IN ('resolvido', 'fechado')`);
    
    return NextResponse.json({
      success: true,
      stats: {
        totalChamados: totalRows[0].total || 0,
        taxaResolucao: totalRows[0].total > 0 ? `${Math.round((resolvidosRows[0].total / totalRows[0].total) * 100)}%` : "0%",
        abertosHoje: 0, 
        tempoMedio: "2.4h"
      },
      grafico: graficoFormatado,
      dados: dadosResposta
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}