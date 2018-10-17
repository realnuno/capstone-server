"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const {Mylist} = require("./mylist-models");
const {User} = require("../users/router");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();
const jsonParser = bodyParser.json();
const localAuth = passport.authenticate("local", {
    session: false
});
const jwtAuth = passport.authenticate('jwt', {
    session: false
});



router.get("/", jwtAuth, (req, res) => {

    Mylist.find()
        .populate("user")
        .sort({
            creationDate: -1
        })
        .then(mylists => {
            res.json(
                mylists.map(mylist => mylist.serialize())
            );
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "something went wrong"
            });
        });
});

router.get("/test", (req, res) => {

    Mylist.find()
        .populate("user")
        .sort({
            creationDate: -1
        })
        .then(mylists => {
            res.json(
                mylists.map(mylist => mylist.serialize())
            );
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "something went wrong"
            });
        });
});



router.get("/get-user-list/", jwtAuth, (req, res) => {

    Mylist.find({
            user: req.user.id
        })
        .sort({
            creationDate: -1
        })
        .then(mylists => {
            res.json(
                mylists.map(mylist => mylist.serialize())
            );
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "something went wrong"
            });
        });
});



router.get("/:id", jwtAuth, (req, res) => {

//    console.log(req.params.id)

    Mylist.findById(req.params.id)
        .populate("user")
        .then(mylist => res.json(mylist.serialize()))
//        .then(mylist => console.log(mylist))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "something went wrong"
            });
        });
});

router.post("/add-item", jwtAuth, jsonParser, (req, res) => {

//    console.log(req);
    //change to actual fields//
    const requiredFields = [
            "venueName",
            "description",
            "phoneNumber",
            "category",
            "address",
            "website",
            "lat",
            "lng",
            "venueId",
            "photo1",
            "photo2",
            "memo"
    ];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }



    Mylist.create({
            venueName: req.body.venueName,
            description: req.body.description,
            phoneNumber: req.body.phoneNumber,
            category: req.body.category,
            address: req.body.address,
            lat: req.body.lat,
            lng: req.body.lng,
            venueId: req.body.venueId,
            website: req.body.website,
            photo1: req.body.photo1,
            photo2: req.body.photo2,
            memo: req.body.memo,
            user: req.user.id
        })
        .then(
            mylist => res.status(201).json(mylist.serialize())
        )
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "Something went wrong"
            });
        });
});


router.post("/add-item/test/", jsonParser, (req, res) => {

    //change to actual fields//
    const requiredFields = [
             "venueName",
            "description",
            "phoneNumber",
            "category",
            "address",
            "website",
            "lat",
            "lng",
            "venueId",
            "photo1",
            "photo2",
            "memo"
        ];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const item = Mylist.create({
            venueName: req.body.venueName,
            description: req.body.description,
            phoneNumber: req.body.phoneNumber,
            category: req.body.category,
            address: req.body.address,
            lat: req.body.lat,
            lng: req.body.lng,
            venueId: req.body.venueId,
            website: req.body.website,
            photo1: req.body.photo1,
            photo2: req.body.photo2,
            memo: req.body.memo,
            user: req.user.id
        })
        .then(
            mylist => res.status(201).json(mylist.serialize())
        )
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "Something went wrong"
            });
        });
});









router.put("/edit-memo/:id", jwtAuth, jsonParser, (req, res) => {

    console.log(req.body)
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: "Request path id and request body id values must match"
        });
    }

    const updated = {};
    //change to actual fields//
    const updateableFields = [
        "memo",
        "id"
    ];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });


    Mylist.findByIdAndUpdate(
            req.params.id, {
                $set: updated
            }, {
                new: true
            }
        )
        .then(updatedMylist => res.json(updatedMylist))
        .catch(err => res.status(500).json({
            message: "Something went wrong"
        }));
});



router.put("/edit-memo/test/:id", jsonParser, (req, res) => {


    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: "Request path id and request body id values must match"
        });
    }

    const updated = {};
    //change to actual fields//
    const updateableFields = [
        "memo",
        "id"
    ];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });


    Mylist.findByIdAndUpdate(
            req.params.id, {
                $set: updated
            }, {
                new: true
            }
        )
        .then(updatedMylist => res.json(updatedMylist))
        .catch(err => res.status(500).json({
            message: "Something went wrong"
        }));
});





router.delete('/:id', jwtAuth, function (req, res) {

    console.log('real');
    Mylist.findByIdAndRemove(req.params.id).then(function (entry) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});


router.delete('/test/:id', function (req, res) {
    Mylist.findByIdAndRemove(req.params.id).then(function (entry) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});




module.exports = {
    router
};
