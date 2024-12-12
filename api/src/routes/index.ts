import { Router, Request, Response, NextFunction } from 'express';
import Paths from '../common/Paths';
import TattooRoutes from './TattooRoutes';
import Tattoo from '@src/models/Tattoo';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import jetValidator from 'jet-validator';

// **** Variables **** //

const apiRouter = Router(),
    validate = jetValidator();

// ** Validation d'un tatouage ** //
function validateTattoo(req: Request, res: Response, next: NextFunction) {
    if (!req.body || !req.body.tattoo) {
        res
            .status(HttpStatusCodes.BAD_REQUEST)
            .send({ error: 'Le paramètre suivant est manquant ou invalide "tattoo".' })
            .end();
        return;
    }

    const nouveauTattoo = new Tattoo(req.body.tattoo);
    const error = nouveauTattoo.validateSync();
    if (error) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(error).end();
    } else {
        next();
    }
}

// ** Ajoute TattooRouter ** //
const tattooRouter = Router();

tattooRouter.get(Paths.Tattoos.Get, TattooRoutes.getAll);
tattooRouter.get(
    Paths.Tattoos.GetUn,
    validate(['id', 'string', 'params']),
    TattooRoutes.getById
);
tattooRouter.get(
    Paths.Tattoos.RechercheSujet,
    (req, _, next) => {
        console.log('Route RechercheSujet utilisée avec param: ', req.params);
        next();
    },
    validate(['sujet', 'string', 'params']),
    TattooRoutes.rechercheSujet
);
tattooRouter.get(
    Paths.Tattoos.RechercheCourriel,
    validate(['courriel', 'string', 'params']),
    TattooRoutes.rechercheCourrielClient
);
tattooRouter.post(
    Paths.Tattoos.Add,
    (req, _, next) => {
        console.log('Route Add utilisée avec param: ', req.params);
        next();
    },
    validateTattoo,
    TattooRoutes.add
);
tattooRouter.put(
    Paths.Tattoos.Update,
    validateTattoo,
    TattooRoutes.update
);
tattooRouter.delete(
    Paths.Tattoos.Delete,
    validate(['id', 'string', 'params']),
    TattooRoutes.delete
);

apiRouter.use(Paths.Tattoos.Base, tattooRouter);

// ** Add UserRouter ** //

// Init router
// const userRouter = Router();

// // Get all users
// userRouter.get(Paths.Users.Get, UserRoutes.getAll);
// userRouter.post(Paths.Users.Add, UserRoutes.add);
// userRouter.put(Paths.Users.Update, UserRoutes.update);
// userRouter.delete(Paths.Users.Delete, UserRoutes.delete);

// Add UserRouter
// apiRouter.use(Paths.Users.Base, userRouter);


// **** Export default **** //

export default apiRouter;
