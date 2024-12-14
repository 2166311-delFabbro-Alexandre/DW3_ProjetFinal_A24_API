import Tattoo, { ITattoo } from '@src/models/Tattoo';

/**
 * Repo des tatouages
 * 
 * D'après Projet complet en Mongoose [https://web3.profinfo.ca/projet_complet_mongoose/]
 * et Exercice 6 - Mongoose [https://web3.profinfo.ca/exercice6_mongoose/]. (27 septembre 2024)
 * 
 * Auteur: Alexandre del Fabbro
 */

/**
 * Vérifie si le tatouage existe.
 */
async function persists(id: string): Promise<boolean> {
  const tattoo = await Tattoo.findById(id);
  return tattoo !== null;
}

/**
 * Lire tous les tatouages.
 */
async function getAll(): Promise<ITattoo[]> {
  const tattoos = await Tattoo.find({});
  return tattoos;
}

/**
 * Lire un tatouage par son id
 */
async function getById(id: string): Promise<ITattoo | null> {
  const tattoo = await Tattoo.findById(id);
  return tattoo;
}

/**
 * Rechercher par le sujet
 */
async function rechercheSujet(sujet: string): Promise<ITattoo[]> {
    console.log(`Fonction rechercheSujet appellée avec le sujet: "${sujet}"`);
    const regexSujet = new RegExp(sujet, 'i');
    const resultats = await Tattoo.find({ sujet: regexSujet }).exec();
    console.log(`Recherche pour le sujet "${sujet} :`, resultats);
    return resultats;
}

/**
 * Rechercher tous les tatouages d'un client par son courriel
 */
async function rechercheCourrielClient(courriel: string): Promise<ITattoo[]> {
  const regexCourriel = new RegExp(courriel, 'i');
  const tattoosClient = await Tattoo.find({
    'client.courriel': regexCourriel
  })

  return tattoosClient;
}

/**
 * Ajoute un tatouage
 */
async function add(tattoo: ITattoo): Promise<ITattoo> {
  const nouveauTattoo = new Tattoo(tattoo);
  await nouveauTattoo.save();
  return nouveauTattoo;
}

/**
 * Met à jour un tatouage
 */
async function update(tattoo: ITattoo): Promise<ITattoo> {
  const tattooAMettreAJour = await Tattoo.findById(tattoo._id);
  
  if (tattooAMettreAJour === null) {
    throw new Error('Tatouage non trouvé');
  }

  tattooAMettreAJour.estTermine = tattoo.estTermine ?? tattooAMettreAJour.estTermine;
  tattooAMettreAJour.client = tattoo.client ?? tattooAMettreAJour.client;
  tattooAMettreAJour.premierRendezVous = tattoo.premierRendezVous ?? tattooAMettreAJour.premierRendezVous;
  tattooAMettreAJour.sujet = tattoo.sujet ?? tattooAMettreAJour.sujet;

  await tattooAMettreAJour.save();
  return tattooAMettreAJour;
}

/**
 * Delete un tatouage
 */
async function delete_(id: string): Promise<void> {
  await Tattoo.findByIdAndDelete(id);
}

export default {
  getAll,
  getById,
  persists,
  rechercheSujet,
  rechercheCourrielClient,
  add,
  update,
  delete: delete_
} as const;