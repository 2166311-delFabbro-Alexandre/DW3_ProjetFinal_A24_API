// import Tattoo, { ITattoo, IClient } from '@src/models/Tattoo';

// const mockify = require('@jazim/mock-mongoose');
// import mongoose, { Schema, model } from 'mongoose';

// describe('Tester le modèle Tattoo', () => {
//     it('findById doit retourner un tatouage', () => {
//         const _tattoo: ITattoo = {
//             _id: '507f191e810c19729de860ea',
//             estTermine: false,
//             client: {
//                 prenom: 'Jacques',
//                 nom: 'Dupont',
//                 age: 28,
//                 telephone: '514-555-1234',
//                 courriel: 'jacques.dupont@example.com'
//             },
//             premierRendezVous: new Date('2024-01-10'),
//             sujet: ['dragon', 'tribal']
//         };

//         mockify(Tattoo).toReturn(_tattoo, 'findOne');

//         return Tattoo.findById({ _id: '507f191e810c19729de860ea' }).then((doc) => {
//             expect(JSON.parse(JSON.stringify(doc))).toEqual(_tattoo);
//         });
//     });
// });