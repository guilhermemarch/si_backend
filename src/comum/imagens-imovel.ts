const MAX_IMAGENS = 5;

type DadosImagensImovel = {
  imagensUrls?: string[];
};

export function resolverUrlsImovel(dados: DadosImagensImovel): string[] {
  return (dados.imagensUrls ?? []).filter(Boolean).slice(0, MAX_IMAGENS);
}

export function dadosGaleriaImovel(imovelId: string, urls: string[]) {
  return urls.slice(0, MAX_IMAGENS).map((url, ordem) => ({
    imovelId,
    url,
    ordem,
  }));
}
