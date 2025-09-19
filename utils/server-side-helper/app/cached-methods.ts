import { HttpNotFound } from '#clients/exceptions';
import { getEtablissementWithUniteLegaleFromSlug } from '#models/core/etablissement';
import {
  FetchRechercheEntrepriseException,
  NotASirenError,
  NotASiretError,
  SirenNotFoundError,
  SiretNotFoundError,
} from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { Exception } from '#models/exceptions';
import { extractSirenOrSiretSlugFromUrl } from '#utils/helpers';
import { logFatalErrorInSentry, logWarningInSentry } from '#utils/sentry';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const handleException = (e: any, slug: string) => {
  if (
    e instanceof NotASirenError ||
    e instanceof NotASiretError ||
    e instanceof HttpNotFound
  ) {
    logWarningInSentry(
      new Exception({
        name: 'PageNotFoundException',
        cause: e,
        context: { slug },
      })
    );
    redirect('/404');
  } else if (
    e instanceof SirenNotFoundError ||
    e instanceof SiretNotFoundError
  ) {
    logWarningInSentry(
      new Exception({
        name: 'SirenNotFoundOrInvalid',
        cause: e,
        context: { slug },
      })
    );
    redirect('/erreur/introuvable/' + slug);
  } else if (e instanceof FetchRechercheEntrepriseException) {
    logFatalErrorInSentry(e);
    throw e;
  } else {
    logFatalErrorInSentry(
      new Exception({
        name: 'ServerErrorPageException',
        cause: e,
        context: { slug },
      })
    );
  }
};

/**
 *  Call this function to rely on react cache when using an unite legale
 */
export const cachedGetUniteLegale = cache(
  async (slug: string, isBot: boolean, page = 1) => {
    const sirenSlug = extractSirenOrSiretSlugFromUrl(slug);
    try {
      return await getUniteLegaleFromSlug(sirenSlug, {
        isBot,
        page,
      });
    } catch (e) {
      handleException(e, sirenSlug);
      throw e;
    }
  }
);

// J'avais simplement utilisé cachedGetUniteLegale au début mais cette nouvelle fonction
// me permet de contrôler ce qui se passe en cas d'erreur au lieu des redirect par défaut.
export const cachedGetUnitesLegales = cache(
  async (siren1: string, siren2: string, isBot: boolean, page = 1) => {
    const [res1, res2] = await Promise.allSettled([
      getUniteLegaleFromSlug(siren1, {
        isBot,
        page,
      }),
      getUniteLegaleFromSlug(siren2, {
        isBot,
        page,
      }),
    ]);

    const uniteLegale1 = res1.status === 'fulfilled' ? res1.value : null;
    const uniteLegale2 = res2.status === 'fulfilled' ? res2.value : null;

    // if at least one is rejected we could log res.reason to Sentry
    // and also possibly use it to adapt the error message

    return { uniteLegale1, uniteLegale2 };
  }
);

export const cachedEtablissementWithUniteLegale = cache(
  async (slug: string, isBot: boolean) => {
    const siretSlug = extractSirenOrSiretSlugFromUrl(slug);
    try {
      return await getEtablissementWithUniteLegaleFromSlug(siretSlug, isBot);
    } catch (e) {
      handleException(e, siretSlug);
      throw e;
    }
  }
);
