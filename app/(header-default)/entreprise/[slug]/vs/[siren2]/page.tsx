import InvalidSiren from '#components-ui/alerts-with-explanations/invalid-siren';
import { createDefaultUniteLegale } from '#models/core/types';
import {
  shouldNotIndex,
  Siren,
  unitesLegalesComparisonPageDescription,
  unitesLegalesComparisonPageTitle,
} from '#utils/helpers';
import { cachedGetUnitesLegales } from '#utils/server-side-helper/app/cached-methods';
import {
  AppRouterCompareUnitesLegalsProps,
  extractParamsAppRouterCompare,
} from '#utils/server-side-helper/app/extract-params-comparison';
import ComparisonTableSection from 'app/(header-default)/entreprise/[slug]/_components/comparison-section';
import { Metadata } from 'next';

export const generateMetadata = async (
  props: AppRouterCompareUnitesLegalsProps
): Promise<Metadata> => {
  const { siren1, siren2, isBot } = await extractParamsAppRouterCompare(props);

  const { uniteLegale1, uniteLegale2 } = await cachedGetUnitesLegales(
    siren1,
    siren2,
    isBot
  );

  if (uniteLegale1 === null || uniteLegale2 === null) {
    return {
      title:
        "Comparaison d'unités légales - Erreur | L’Annuaire des Entreprises`",
      robots: 'noindex, nofollow',
    };
  }

  return {
    title: unitesLegalesComparisonPageTitle(uniteLegale1, uniteLegale2),
    description: unitesLegalesComparisonPageDescription(
      uniteLegale1,
      uniteLegale2
    ),
    robots:
      shouldNotIndex(uniteLegale1) || shouldNotIndex(uniteLegale2)
        ? 'noindex, nofollow'
        : 'index, follow',
  };
};

export default async function UniteLegalePage(
  props: AppRouterCompareUnitesLegalsProps
) {
  const { isBot, siren1, siren2 } = await extractParamsAppRouterCompare(props);

  const { uniteLegale1, uniteLegale2 } = await cachedGetUnitesLegales(
    siren1,
    siren2,
    isBot
  );

  return (
    <div className="content-container">
      <h1>Comparaison d&apos;entreprises</h1>
      {uniteLegale1 === null && <InvalidSiren siren={siren1} />}
      {uniteLegale2 === null && <InvalidSiren siren={siren2} />}
      <ComparisonTableSection
        uniteLegale1={uniteLegale1 ?? createDefaultUniteLegale(siren1 as Siren)}
        uniteLegale2={uniteLegale2 ?? createDefaultUniteLegale(siren2 as Siren)}
      />
    </div>
  );
}
