import TattooRepo from '@src/repos/TattooRepo';
import Tattoo, { ITattoo } from '@src/models/Tattoo';
import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

// **** Variables **** //

export const TATTOO_NOT_FOUND_ERR = 'Tatouage non trouvé';

// **** Functions **** //

/**
 * Lire tous les tatouages.
 */
function getAll(): Promise<ITattoo[]> {
  return TattooRepo.getAll();
}

/**
 * Lire un tatouage par son id
 */
async function getById(id: string): Promise<ITattoo | null> {
  const persists = await TattooRepo.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, TATTOO_NOT_FOUND_ERR);
  }
    return TattooRepo.getById(id);
}
/**
 * Recherche par sujet
 */
async function rechercheSujet(sujet: string): Promise<ITattoo[]> {
  const tattoos = await TattooRepo.rechercheSujet(sujet);
  if (!tattoos || tattoos.length === 0) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Aucun tatouage trouvé pour ce sujet.');
  }
  return tattoos;
}

/**
 * Recherche par courriel du client
 */
async function rechercheCourrielClient(courriel: string): Promise<ITattoo[]> {
  const tattoos = await TattooRepo.rechercheCourrielClient(courriel);
  if (!tattoos || tattoos.length === 0) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Aucune entrée trouvée avec ce courriel');
  }
  return tattoos;
}

/**
 * Ajouter un tatouage.
 */
function add(tattoo: ITattoo): Promise<ITattoo> {
  return TattooRepo.add(tattoo);
}

/**
 * Mise à jour d'un tatouage.
 */
async function updateOne(tattoo: ITattoo): Promise<ITattoo> {
  if (!tattoo._id) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, "L'identifiant du tatouage est requis.");
  }

  const persists = await TattooRepo.persists(tattoo._id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, TATTOO_NOT_FOUND_ERR);
  }
  // Mise à jour du facture
  return TattooRepo.update(tattoo);
}

/**
 * Supprimer un tatouage par son id
 */
async function _delete(id: string): Promise<void> {
    const persists = await TattooRepo.persists(id);
    console.log("persist: ", persists)
    if (!persists) {
        throw new RouteError(HttpStatusCodes.NOT_FOUND, TATTOO_NOT_FOUND_ERR);
    }
    return TattooRepo.delete(id);
}
// **** Export default **** //

export default {
  getAll,
  getById,
  rechercheSujet,
  rechercheCourrielClient,
  add,
  updateOne,
  delete: _delete
} as const;
