/**
 * Created by muhammadkh4n on 5/27/16.
 */

var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorite = require('../models/favorites');
var Verify = require('./verify');

router.use(bodyParser.json());

router.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorite.findOne({postedBy: req.decoded._id}).populate(['postedBy','dishes']).exec(function (err, favorites) {
            if (err) next(err);
            res.json(favorites);
        });
    })
    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorite.findOne({postedBy: req.decoded._id}, function (err, favorites) {
            if (err) next(err);

            if (favorites != null) {
                for (var i = 0; i < favorites.dishes.length; i++) {
                    if (favorites.dishes[i] == req.body._id) {
                        var err = new Error('Already Favorite!');
                        err.status = 409;
                        return next(err);
                    }
                }
                favorites.dishes.push(req.body._id);
                favorites.save(function (err, resp) {
                    if (err) next(err);
                    return res.json(resp);
                });
            } else {
                favorites = {
                    postedBy: req.decoded._id,
                    dishes: [req.body._id]
                };
                Favorite.create(favorites, function (err, fav) {
                    if (err) next(err);
                    return res.json(fav);
                });
            }
        });

        /*
        Favorite.findOneAndUpdate({
            postedBy: req.decoded._id
        }, {
            $push: { dishes: req.body._id },
            $setOnInsert: { postedBy: req.decoded._id }
        }, {
            upsert: true
        }).exec(function (err, fav) {
            if (err) next(err);

            return res.status(200).json({
                message: 'Added to Favorites'
            });
        });
        */
    })
    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorite.remove({postedBy: req.decoded._id}, function (err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });

router.route('/:dishObjectId')
    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorite.findOne({postedBy: req.decoded._id}, function (err, fav) {
            if (err) next(err);

            /*for (var i = 0; i < fav.dishes.length; i++) {
                if (fav.dishes[i] == req.params.dishObjectId) {
                    fav.dishes.splice(i, 1);
                }
            }*/

            fav.dishes.splice(fav.dishes.indexOf(req.params.dishObjectId), 1);

            fav.save(function (err, fav) {
                if (err) next(err);
                res.json(fav);
            });
        });
    });

module.exports = router;