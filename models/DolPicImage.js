var mongoose = require('mongoose');
var schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var dolpicImageSchema = schema({
  hashTagId:{
      type: schema.Types.ObjectId,
      ref: 'HashTag'
  },
  url:{
    type: String,
    unique: true
  },
  urlType:{
    type: Number
  },
  isView: {
    type: Boolean,
    default: true
  },
  regDate:{
    type: Date,
    default: Date.now
  },
  imageLike:[{
    userId: {
      type: schema.Types.ObjectId,
      ref: 'User'
    },
    regDate:{
      type: Date,
      default: Date.now
    }
  }],
  imageReport:[{
    userId: {
      type: schema.Types.ObjectId,
      ref: 'User'
    },
    regDate:{
      type: Date,
      default: Date.now
    }
  }],
  likeCount: {
    type: Number,
    default: 0
  }
});

//db.getCollection('dolpicimages').find({imagesLike: { $elemMatch: {userId: ObjectId("57cbbc3fd612e0f41d58044b")}}})


dolpicImageSchema.plugin(mongoosePaginate);
var DolPicImage = module.exports = mongoose.model('DolPicImage', dolpicImageSchema);


module.exports.addImage = function(dolpicImage, callBack) {
  dolpicImage.save(callBack);
}


module.exports.getImage = function(query, callBack) {
  DolPicImage.findOne(query, callBack);
}


module.exports.getImages = function(query, page, limit, callback) {
  DolPicImage.paginate(query, {page: page, limit: limit}, callback);
}


module.exports.getImagesByQueryAndOptions = function(query, options, callback) {
  DolPicImage.paginate(query, options, callback);
}


module.exports.deleteImage = function(where, callBack) {
  DolPicImage.remove(where, callBack);
};


module.exports.getImagesByHashTagId = function(hashTagId, page, limit, callback) {
  var query = {'hashTagId': hashTagId};
  var options = {
    select: 'url urlType likeCount hashTagId',
    sort: {regDate: -1},
    populate: [{path: 'hashTagId', select: "twitterHashTag subscriberCount image"}],
    lean: true,
    page: page,
    limit: limit
  };
  DolPicImage.paginate(query, options, callback);
}


module.exports.addImageLike = function(data, callback) {
  DolPicImage.update(
    {_id: data.imageId},
    {
      $inc: {likeCount: 1},
      $push: {'imageLike': {userId: data.userId}}
    },
    {upsert: true},
    callback
  );
}


module.exports.getPrevImage = function(query, callback) {
  DolPicImage
    .findOne(query)
    .sort({_id: 1})
    .limit(1)
    .select('_id')
    .exec(callback);
}


module.exports.getNextImage = function(query, callback) {
  DolPicImage
    .findOne(query)
    .sort({_id: -1})
    .limit(1)
    .select('_id')
    .exec(callback);
}


module.exports.getMainList = function(query, random, limit, callback) {
  DolPicImage
    .find(query)
    .limit(limit)
    .skip(random)
    .select('_id hashTagId url urlType likeCount')
    .populate([{path: 'hashTagId', select: "twitterHashTag subscriberCount"}])
    .exec(callback);
}


module.exports.checkReport = function(query, callBack) {
  DolPicImage.findOne(query, callBack);
}


module.exports.addImageReport = function(data, callback) {
  DolPicImage.update(
    {_id: data.imageId},
    {
      'isView': false,
      $push: {'imageReport': {userId: data.userId}}
    },
    {upsert: true},
    callback
  );
}


module.exports.checkImageLike = function(query, callback) {
  DolPicImage
    .findOne(query)
    .select('_id')
    .exec(callback);
}