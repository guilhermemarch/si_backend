export type Coordenadas = {
  latitude: number;
  longitude: number;
};

export async function geocodificarEndereco(
  bairro: string,
  cidade: string,
  cep?: string | null,
): Promise<Coordenadas | null> {
  const partes = [bairro, cidade, 'Brasil'];
  if (cep?.replace(/\D/g, '')) {
    partes.unshift(cep.replace(/\D/g, ''));
  }

  const consulta = encodeURIComponent(partes.join(', '));
  const url = `https://nominatim.openstreetmap.org/search?q=${consulta}&format=json&limit=1`;

  try {
    const resposta = await fetch(url, {
      headers: { 'User-Agent': 'SI-Solucoes-Imobiliarias/1.0' },
      signal: AbortSignal.timeout(5000),
    });

    if (!resposta.ok) return null;

    const dados = (await resposta.json()) as Array<{
      lat: string;
      lon: string;
    }>;
    const primeiro = dados[0];
    if (!primeiro) return null;

    const latitude = Number(primeiro.lat);
    const longitude = Number(primeiro.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

    return { latitude, longitude };
  } catch {
    return null;
  }
}
