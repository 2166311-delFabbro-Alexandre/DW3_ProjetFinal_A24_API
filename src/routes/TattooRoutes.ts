import HttpStatusCodes from '@src/common/HttpStatusCodes';

import TattooService from '@src/services/TattooService';
import { ITattoo, isTattoo } from '@src/models/Tattoo';
import { IReq, IRes } from './common/types';
import check from './common/check';
// **** Functions **** //

/**
 * Lire tous les tatouages.
 */
async function getAll(_: IReq, res: IRes) {
  const tattoos = await TattooService.getAll();
  return res.status(HttpStatusCodes.OK).json({ tattoos });
}

/**
 * Lire un tatouage par son id
 */
async function getById(req: IReq, res: IRes) {
    const id = check.isStr(req.params, 'id');
    const tattoo = await TattooService.getById(id);
    return res.status(HttpStatusCodes.OK).json({ tattoo });
}

/**
 * Recherche par sujet
 */
async function rechercheSujet(req: IReq, res: IRes) {
  console.log(`Route rechercheSujet appellée avec le req.params: `, req.params);
  const sujet = check.isStr(req.params, 'sujet');
  const tattoos = await TattooService.rechercheSujet(sujet);
  return res.status(HttpStatusCodes.OK).json({ tattoos });
}

/**
 * Recherche par le courriel du client
 */
async function rechercheCourrielClient(req: IReq, res: IRes) {
    const courriel = check.isStr(req.params, 'courriel');
    const tattoos = await TattooService.rechercheCourrielClient(courriel);
    return res.status(HttpStatusCodes.OK).json({ tattoos });
}

/**
 * Ajouter un tatouage.
 */
async function add(req: IReq, res: IRes) {
  let tattooAAjouter: ITattoo = check.isValid(req.body, 'tattoo', isTattoo);
  await TattooService.add(tattooAAjouter);
  return res.status(HttpStatusCodes.CREATED).json({ tattooAAjouter });
}

/**
 * Mise à jour d'un tatouage.
 */
async function update(req: IReq, res: IRes) {
  const tattoo = check.isValid(req.body, 'tattoo', isTattoo);
  if(!tattoo) {
    throw new Error('Le tatouage est requis pour la mise à jour');
  }
  if(!tattoo._id) {
    throw new Error('L\'identifiant du tatouage est requis pour la mise à jour');
  }
  if(tattoo){
    console.log(`Tatouage à mettre à jour: `, tattoo);
  }
  await TattooService.updateOne(tattoo);
  return res.status(HttpStatusCodes.OK).json({ tattoo });
}

/**
 * Delete un tatouage
 */
async function delete_(req: IReq, res: IRes) {
    const id = check.isStr(req.params, 'id');
    await TattooService.delete(id);
    return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //

export default {
  getAll,
  getById,
  rechercheSujet,
  rechercheCourrielClient,
  add,
  update,
  delete: delete_
} as const;
