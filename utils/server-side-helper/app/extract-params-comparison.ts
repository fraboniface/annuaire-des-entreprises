import isUserAgentABot from '#utils/user-agent';
import { headers } from 'next/headers';

/*j
J'ai hésité sur où placer ce code.
Vu qu'il n'est utilisé qu'à un seul endroit, cela ne me paraissait pas forcément pertinent de le mettre dans utils.
Après avoir considéré les autres options cela me semble tout de même le meilleur endroit.
*/

type ICompareUnitesLegalesProps = {
  slug: string;
  siren2: string;
};

export type AppRouterCompareUnitesLegalsProps = {
  params: Promise<ICompareUnitesLegalesProps>;
};

export async function extractParamsAppRouterCompare({
  params,
}: AppRouterCompareUnitesLegalsProps) {
  const resolvedParams = await params;
  const siren1 = (resolvedParams?.slug || '') as string;
  const siren2 = (resolvedParams?.siren2 || '') as string;

  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  const isBot = isUserAgentABot(userAgent);

  return {
    siren1,
    siren2,
    isBot,
  };
}
