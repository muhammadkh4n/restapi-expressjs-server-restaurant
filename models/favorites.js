/**
 * Created by muhammadkh4n on 5/27/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dishesSchema = new Schema({

});

var FavoriteSchema = new Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Favorite', FavoriteSchema);