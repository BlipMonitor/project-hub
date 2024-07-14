import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import accountRoute from './account.route';
import ledgerRoute from './ledger.route';
import contractRoute from './contract.route';
import transactionRoute from './transaction.route';
import messageQueueRoute from './messageQueue.route';
import metricsRoute from './metrics.route';
import docsRoute from './docs.route';
import config from '../../config/config';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/account',
    route: accountRoute
  },
  {
    path: '/ledger',
    route: ledgerRoute
  },
  {
    path: '/contract',
    route: contractRoute
  },
  {
    path: '/transaction',
    route: transactionRoute
  },
  {
    path: '/message-queue',
    route: messageQueueRoute
  },
  {
    path: '/metrics',
    route: metricsRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
