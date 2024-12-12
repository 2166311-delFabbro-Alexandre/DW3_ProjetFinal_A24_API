/**
 * Modèle d'un tatouage
 * D'après Projet complet en Mongoose [https://web3.profinfo.ca/projet_complet_mongoose/]
 */
import mongoose, { Schema, model } from 'mongoose';

//**** types **** //
export interface IClient {
    prenom: string;
    nom: string;
    age: number;
    telephone: string;
    courriel: string;
}

export interface ITattoo {
    estTermine: boolean;
    client: IClient;
    premierRendezVous: Date;
    sujet: string[];
    _id?: string;
}

const ClientSchema = new Schema<IClient>({
    prenom: { type: String, required: [true, 'Le prénom du client est requis.']},
    nom: { type: String, required: [true, 'Le nom du client est requis.']},
    age: { 
        type: Number,
        required: [true, 'L\'âge du client est requis.'],
        min: [18, 'Le client doit être majeur.']},
    telephone: { type: String, required: [true, 'Le numéro de téléphone du client est requis.']},
    courriel: { 
        type: String, 
        required: [true, 'Le courriel du client est requis'],
        validate: {
            validator: function(v: string) {
                return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v);
            },
            message: 'Le courriel du client est invalide.'
        }
    }
});

const TattooSchema = new Schema<ITattoo>({
    estTermine: { type: Boolean, required: [true, 'Le status du tatouage est requis.']},
    client: { type: ClientSchema, required: [true, 'Un client est requis.']},
    premierRendezVous: { type: Date, required: [true, 'La date du premier rendez-vous est requise.']},
    sujet: { type: [String], required: [true, 'Au moins un sujet est requis.']}
});

export function isTattoo(arg: unknown): arg is ITattoo {
    return (
        !!arg &&
        typeof arg === 'object' &&
        'estTermine' in arg &&
        'client' in arg &&
        'premierRendezVous' in arg &&
        'sujet' in arg
    );
}

mongoose.pluralize(null);
export default model<ITattoo>('tattoos', TattooSchema);