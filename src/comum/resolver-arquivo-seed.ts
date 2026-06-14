import * as fs from 'fs';
import * as path from 'path';

export function resolverArquivoSeed(
  envVar: string | undefined,
  candidatosRelativos: string[],
): string {
  if (envVar) {
    return path.isAbsolute(envVar)
      ? envVar
      : path.resolve(process.cwd(), envVar);
  }

  const candidatos = candidatosRelativos.map((relativo) =>
    path.resolve(process.cwd(), relativo),
  );
  return (
    candidatos.find((candidato) => fs.existsSync(candidato)) ?? candidatos[0]
  );
}
