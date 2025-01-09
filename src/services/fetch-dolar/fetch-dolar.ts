import axios from "axios";

interface Cotacao {
  code: string; // 'USD',
  codein: string; // 'BRL',
  name: string; // 'Dólar Americano/Real Brasileiro',
  high: string; // Máximo: '6.216',
  low: string; // Mínimo: '6.1894',
  varBid: string; // Variação: '-0.0023',
  pctChange: string; // Porcentagem de Variação: '-0.04',
  bid: string; // Compra: '6.1903',
  ask: string; // Venda: '6.1933',
  timestamp: string; // '1735067365',
  create_date: string; // '2024-12-24 16:09:25'
}

export const fetchCotacaoDolar = async (): Promise<Cotacao | null> => {
  const url = "https://economia.awesomeapi.com.br/json/last/USD-BRL";
  try {
    const response = await axios.get(url);
    const cotacao = response.data["USDBRL"] as Cotacao;

    console.log(`>>> fetchCotacaoDolar:`, cotacao);
    return cotacao;
  } catch (error) {
    console.log(`fetchCotacaoDolar: Erro buscando cotação`);
    if (error.response?.data?.error) {
      console.error(
        "Response error:",
        JSON.stringify(error.response.data.error, null, 2)
      );
    }
    return null;
  }
};
