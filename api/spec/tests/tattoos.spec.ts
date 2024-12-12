import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';
import insertUrlParams from 'inserturlparams';

import app from '@src/server';

import Tattoo, { ITattoo, IClient } from '@src/models/Tattoo';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { TATTOO_NOT_FOUND_ERR } from '@src/services/TattooService';

import Paths from 'spec/support/Paths';
import apiCb from 'spec/support/apiCb';
import { TApiCb } from 'spec/types/misc';
import { ValidationErr } from '@src/common/classes';
import TattooRepo from '@src/repos/TattooRepo';

const mockify = require('@jazim/mock-mongoose');

// Dummy tatouages pour GET req
const obtenirDonneesBidonTatouages = (): ITattoo[] => {
    return [
        {
            estTermine: false,
            client: {
                prenom: 'Jacques',
                nom: 'Dupont',
                age: 28,
                telephone: '514-555-1234',
                courriel: 'jacques.dupont@example.com'
            },
            premierRendezVous: new Date('2024-01-10'),
            sujet: ['dragon', 'tribal'],
            _id: '5c5dd07a381aba23c6193f3a'
        },
        {
            estTermine: true,
            client: {
                prenom: 'Mylène',
                nom: 'Smith',
                age: 34,
                telephone: '438-555-9876',
                courriel: 'mylene.smith@example.com'
            },
            premierRendezVous: new Date('2023-11-15'),
            sujet: ['fleur', 'papillon'],
            _id: '5c5dd07a4d06e5f1614b4231'
        },
        {
            estTermine: false,
            client: {
                prenom: 'Madame',
                nom: 'Ponpon',
                age: 45,
                telephone: '450-555-6543',
                courriel: 'ponpon@example.com'
            },
            premierRendezVous: new Date('2024-02-05'),
            sujet: ['chiffres romains', 'chat'],
            _id: '5c5dd07a2a96522453966b30'
        }
    ];
};



// Tests
describe('TattooRouter', () => {

    let agent: TestAgent<Test>;

    // Run avant tous les tests
    beforeAll(done => {
        agent = supertest.agent(app);
        done();
    });

    beforeEach(() => {
        mockify.resetAll();
      });

    // Test Get tous tatouages
    describe(`"GET:${Paths.Tattoos.Get}"`, () => {

        const api = (cb: TApiCb) =>
            agent
                .get(Paths.Tattoos.Get)
                .end(apiCb(cb));

        // Succès
        it('Doit retourner un JSON avec tous les tatouages et un status code ' +
            `de "${HttpStatusCodes.OK}" si la requête est un succès.`, (done) => {

                const data = obtenirDonneesBidonTatouages();
                mockify(Tattoo).toReturn(data, 'find');

                api(res => {
                    expect(res.status).toBe(HttpStatusCodes.OK);

                    // Assert the type of res.body.tattoos
                    const tattoos = res.body.tattoos as ITattoo[];

                    // Normaliser les dates et supprimer les propriétés inattendues
                    const normalizedData = data.map(tattoo => ({
                        ...tattoo,
                        premierRendezVous: tattoo.premierRendezVous.toISOString(),
                        client: {
                            prenom: tattoo.client.prenom,
                            nom: tattoo.client.nom,
                            age: tattoo.client.age,
                            telephone: tattoo.client.telephone,
                            courriel: tattoo.client.courriel
                        }
                    }));

                    const normalizedResponse = tattoos.map(tattoo => ({
                        ...tattoo,
                        premierRendezVous: new Date(tattoo.premierRendezVous).toISOString(),
                        client: {
                            prenom: tattoo.client.prenom,
                            nom: tattoo.client.nom,
                            age: tattoo.client.age,
                            telephone: tattoo.client.telephone,
                            courriel: tattoo.client.courriel
                        }
                    }));

                    expect(normalizedResponse).toEqual(normalizedData);

                    done();
                });
            });
    });

    // Test Get un tatouage
    describe(`"GET:${Paths.Tattoos.GetUn}"`, () => {

        const callApi = (id: string, cb: TApiCb) =>
            agent
                .get(insertUrlParams(Paths.Tattoos.GetUn, { id }))
                .end(apiCb(cb));

        // Succès
        it('Doit retourner un JSON avec un tatouage et un status code ' +
            `de "${HttpStatusCodes.OK}" si la requête est un succès.`, (done) => {

                const data = obtenirDonneesBidonTatouages()[0];
                mockify(Tattoo).toReturn(data, 'findOne');

                callApi("1", res => {
                    expect(res.status).toBe(HttpStatusCodes.OK);

                    const tattoo = res.body.tattoo as ITattoo;

                    expect(tattoo).toBeDefined();

                    const normalizedData = {
                        ...data,
                        premierRendezVous: data.premierRendezVous.toISOString(),
                        client: {
                            prenom: data.client.prenom,
                            nom: data.client.nom,
                            age: data.client.age,
                            telephone: data.client.telephone,
                            courriel: data.client.courriel
                        }
                    };

                    const normalizedResponse = {
                        ...tattoo,
                        premierRendezVous: new Date(tattoo.premierRendezVous).toISOString(),
                        client: {
                            prenom: tattoo.client.prenom,
                            nom: tattoo.client.nom,
                            age: tattoo.client.age,
                            telephone: tattoo.client.telephone,
                            courriel: tattoo.client.courriel
                        }
                    };

                    expect(normalizedResponse).toEqual(normalizedData);
                    done();
                });
            });

        // Tatouage 404
        it('doit retourner un objet JSON avec message erreur ' +
            `"${TATTOO_NOT_FOUND_ERR}" et un status code ` +
            `"${HttpStatusCodes.NOT_FOUND}" si le tatouage n'est pas trouvé.`, done => {
                mockify(Tattoo).toReturn(null, 'findOne');
                callApi("xxx", res => {
                    expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
                    expect(res.body.error).toBe(TATTOO_NOT_FOUND_ERR);
                    done();
                });
            });
    });

    // Test add tatouage
    describe(`"POST:${Paths.Tattoos.Add}"`, () => {

        const ERROR_MSG = ValidationErr.GetMsg('tattoo'),
            DUMMY_TATTOO = obtenirDonneesBidonTatouages()[0];

        // Setup API
        const callApi = (tattoo: ITattoo | null, cb: TApiCb) =>
            agent
                .post(Paths.Tattoos.Add)
                .send({ tattoo })
                .end(apiCb(cb));

        // Test add résident succès
        it(`doit retourner un status code de "${HttpStatusCodes.CREATED}" si la ` +
            'requête est un succès.', (done) => {

                mockify(Tattoo).toReturn(DUMMY_TATTOO, 'save');

                callApi(DUMMY_TATTOO, res => {
                    expect(res.status).toBe(HttpStatusCodes.CREATED);
                    done();
                });
            });

        // Manque param
        it(`doit retourner un objet JSON avec le message d'erreur "${ERROR_MSG}" ` +
            `et un status code "${HttpStatusCodes.BAD_REQUEST}" si le param ` +
            'tattoo est manquant.', (done) => {

                callApi(null, res => {
                    expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
                    expect(res.body.error).toBe(ERROR_MSG);
                    done();
                });
            });
    });

    // Test Update tatouages
    describe(`"PUT:${Paths.Tattoos.Update}"`, () => {

        const ERROR_MSG = ValidationErr.GetMsg('tattoo'),
            DUMMY_TATTOO = obtenirDonneesBidonTatouages()[0];

            console.log("DUMMY_TATTOO: " , DUMMY_TATTOO);

        const callApi = (id: string, tattoo: ITattoo | null, cb: TApiCb) =>
            agent
                .put(insertUrlParams(Paths.Tattoos.Update, { id }))
                .send({ tattoo })
                .end(apiCb(cb));

        // Succès
        it('Doit retourner un status code ' +
            `de "${HttpStatusCodes.OK}" si la requête est un succès.`, (done) => {

                const updatedTattoo = { ...DUMMY_TATTOO, estTermine: true };
                mockify(Tattoo).toReturn(updatedTattoo, 'updateOne')

                callApi(DUMMY_TATTOO._id as string, updatedTattoo, res => {
                    expect(res.status).toBe(HttpStatusCodes.OK);

                    const tattoo = res.body.tattoo as ITattoo;
                    
                    expect(tattoo).toBeDefined();
                    // Normaliser les dates et supprimer les propriétés inattendues
                    const normalizedResponse = {
                        ...tattoo,
                        premierRendezVous: new Date(tattoo.premierRendezVous).toISOString(),
                        client: {
                            prenom: tattoo.client.prenom,
                            nom: tattoo.client.nom,
                            age: tattoo.client.age,
                            telephone: tattoo.client.telephone,
                            courriel: tattoo.client.courriel
                        }
                    };

                    const normalizedData = {
                        ...updatedTattoo,
                        premierRendezVous: updatedTattoo.premierRendezVous.toISOString(),
                        client: {
                            prenom: updatedTattoo.client.prenom,
                            nom: updatedTattoo.client.nom,
                            age: updatedTattoo.client.age,
                            telephone: updatedTattoo.client.telephone,
                            courriel: updatedTattoo.client.courriel
                        }
                    };

                    expect(normalizedResponse).toEqual(normalizedData);
                    done();
                });
            });

        // Param manquant
        it(`doit retourner un objet JSON avec le message d'erreur "${ERROR_MSG}" ` +
            `et un status code "${HttpStatusCodes.BAD_REQUEST}" ` +
            'si données sont non valides.', (done) => {

                mockify(Tattoo).toReturn(null, 'findOneAndUpdate');

                callApi(DUMMY_TATTOO._id as string, null, res => {
                    expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
                    expect(res.body.error).toBe(ERROR_MSG);
                    done();
                });
            });

        // Tatouage 404
        it('doit retourner un objet JSON avec le message erreur ' +
            `"${TATTOO_NOT_FOUND_ERR}" et un status code ` +
            `"${HttpStatusCodes.NOT_FOUND}" si le id pas trouvé.`, (done) => {

                mockify(Tattoo).toReturn(null, 'updateOne');

                callApi("id invalide", DUMMY_TATTOO, res => {
                    expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
                    expect(res.body.error).toBe(TATTOO_NOT_FOUND_ERR);
                    done();
                });
            });
    });

    // Test delete tatouage
    describe(`"DELETE:${Paths.Tattoos.Delete}"`, () => {

        // Call API
        const callApi = (id: string, cb: TApiCb) =>
            agent
                .delete(insertUrlParams(Paths.Tattoos.Delete, { id }))
                .end(apiCb(cb));

        // Succès
        it(`doit retourner un status code "${HttpStatusCodes.OK}" si la ` +
            'suppression est un succès.', (done) => {

                mockify(Tattoo).toReturn({ deletedCount: 1 }, 'deleteOne');

                callApi("5c5dd07a381aba23c6193f3a", res => {
                    expect(res.status).toBe(HttpStatusCodes.OK);
                    done();
                });
            });

        // Tatouage 404
        it('doit retourner un objet JSON avec message erreur ' +
            `"${TATTOO_NOT_FOUND_ERR}" et un status code ` +
            `"${HttpStatusCodes.NOT_FOUND}" si le id pas trouvé.`, (done) => {

                mockify(Tattoo).toReturn(null, 'findById');
                // mockify(Tattoo).toReturn({ deletedCount: 0 }, 'deleteOne');

                callApi("673b6b02ac2ca6a19e67ee62", res => {
                    expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
                    expect(res.body.error).toBe(TATTOO_NOT_FOUND_ERR);
                    done();
                });
            });
    });
});
