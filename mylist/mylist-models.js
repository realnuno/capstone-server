"use strict";
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

function timeStamp(now) {
    var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
    var time = [now.getHours(), now.getMinutes()];
    var suffix = time[0] < 12 ? "AM" : "PM";
    time[0] = time[0] < 12 ? time[0] : time[0] - 12;
    time[0] = time[0] || 12;
    for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }
    return date.join("/") + " " + time.join(":") + " " + suffix;
}

const mylistSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    venueName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lat: {
        type:String,
        required: true
    },
    lng: {
        type:String,
        required: true
    },
	venueId: {
        type:String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    photo1: {
        type: String,
        required: true
    },
    photo2: {
        type: String,
        required: true
    },
    memo: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: new Date()
    }
});


mylistSchema.methods.serialize = function () {
    return {
        id: this._id || "",
        venueName: this.venueName || "",
        description: this.description || "",
        phoneNumber: this.phoneNumber || "",
        category: this.category || "",
        address: this.address || "",
        lat: this.lat || "",
        lng: this.lng || "",
        venueId: this.venueId || "",
        website: this.website || "",
        photo1: this.photo1 || "",
        photo2: this.photo2 || "",
        memo: this.memo || "",
        creationDate: timeStamp(this.creationDate)
    };
};

const Mylist = mongoose.model("Mylist", mylistSchema);

module.exports = {
    Mylist
};
