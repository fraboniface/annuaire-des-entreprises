import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { IUniteLegale } from '#models/core/types';

const ComparisonTableSection: React.FC<{
  uniteLegale1: IUniteLegale;
  uniteLegale2: IUniteLegale;
}> = ({ uniteLegale1, uniteLegale2 }) => {
  return (
    <Section
      title={`Comparaison de ${uniteLegale1.nomComplet || 'INVALIDE'} et ${
        uniteLegale2.nomComplet || 'INVALIDE'
      }`}
    >
      <FullTable
        head={['', uniteLegale1.nomComplet, uniteLegale2.nomComplet]}
        body={[
          ['SIREN', uniteLegale1.siren, uniteLegale2.siren],
          [
            'Adresse du siège',
            uniteLegale1.siege.adresse,
            uniteLegale2.siege.adresse,
          ],
          [
            'Code NAF',
            uniteLegale1.activitePrincipale,
            uniteLegale2.activitePrincipale,
          ],
        ]}
      />
    </Section>
  );
};

export default ComparisonTableSection;
