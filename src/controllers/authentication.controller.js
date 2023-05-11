//
// Authentication controller
//
const assert = require('assert');
const jwt = require('jsonwebtoken');
const pool = require('../util/mysql-db');
const { logger, jwtSecretKey } = require('../util/utils');

module.exports = {
  login(req, res, next) {
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error('Error getting connection from pool');
        next({
          code: 500,
          message: err.code
        });
      }
      if (connection) {
        // 1. Kijk of deze useraccount bestaat.
        connection.query(
          'SELECT `id`, `emailAdress`, `password`, `firstName`, `lastName` FROM `user` WHERE `emailAdress` = ?',
          [req.body.emailAdress],
          (err, rows, fields) => {
            connection.release();
            if (err) {
              logger.error('Error: ', err.toString());
              next({
                code: 500,
                message: err.code
              });
            }
            if (rows) {
              // 2. Er was een resultaat, check het password.
              if (
                rows &&
                rows.length === 1 &&
                rows[0].password == req.body.password
              ) {
                logger.info(
                  'passwords DID match, sending userinfo and valid token'
                );
                // Extract the password from the userdata - we do not send that in the response.
                const { password, ...userinfo } = rows[0];
                // Create an object containing the data we want in the payload.
                const payload = {
                  userId: userinfo.id
                };

                jwt.sign(
                  payload,
                  jwtSecretKey,
                  { expiresIn: '2d' },
                  (err, token) => {
                    logger.debug('User logged in, sending: ', userinfo);
                    res.status(200).json({
                      code: 200,
                      message: 'User logged in',
                      data: { ...userinfo, token }
                    });
                  }
                );
              } else {
                logger.info('User not found or password invalid');
                next({
                  code: 404,
                  message: 'User not found or password invalid',
                  data: {}
                });
              }
            }
          }
        );
      }
    });
  },

  //
  //
  //
  validateLogin(req, res, next) {
    // Verify that we receive the expected input
    try {
      assert(
        typeof req.body.emailAdress === 'string',
        'email must be a string.'
      );
      assert(
        typeof req.body.password === 'string',
        'password must be a string.'
      );
      next();
    } catch (ex) {
      res.status(422).json({
        error: ex.toString(),
        datetime: new Date().toISOString()
      });
    }
  },

  //
  //
  //
  validateToken(req, res, next) {
    logger.trace('validateToken called');
    // logger.trace(req.headers)
    // The headers should contain the authorization-field with value 'Bearer [token]'
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next({
        code: 401,
        message: 'Authorization header missing!',
        data: undefined
      });
    } else {
      // Hier moet je nog
    }
  }
};
