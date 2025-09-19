import { Error } from '#components-ui/alerts';

const InvalidSiren: React.FC<{ siren: string }> = ({ siren }) => {
  return <Error full>{siren} n'est pas un SIREN valide.</Error>;
};
export default InvalidSiren;
