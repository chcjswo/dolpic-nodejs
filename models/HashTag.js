var mongoose = require('mongoose');
var schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var hashTagSchema = schema({
  initial: {
    type: String
  },
  twitterHashTag: {
    type: String,
    unique: true
  },
  instagramHashTag: {
    type: String
  },
  image: {
    type: String
  },
  likeCount: {
    type: Number,
    default: 0
  },
  subscriber: [{
    userId: {
      type: schema.Types.ObjectId,
      ref: 'User'
    },
    regDate: {
      type: Date,
      default: Date.now
    }
  }],
  subscriberCount: {
    type: Number,
    default: 0
  },
  regDate: {
    type: Date,
    default: Date.now
  }
});

hashTagSchema.plugin(mongoosePaginate);
var HashTag = module.exports = mongoose.model("HashTag", hashTagSchema);


module.exports.addHashTag = function(hashTag, callBack) {
  hashTag.save(callBack);
}


module.exports.getHashTagById = function(hashTagId, callback){
  HashTag.findById(hashTagId, callback);
}


module.exports.updateHashTag = function(hashTagId, hashTag, callBack) {
  HashTag.update({_id: hashTagId}, hashTag, callBack);
}


module.exports.deleteHashTag = function(hashTagId, callBack) {
  HashTag.remove({_id: hashTagId}, callBack);
}


module.exports.getHashTags = function(query, page, limit, callback) {
  HashTag.paginate(
    query,
    {
      select: '_id initial twitterHashTag instagramHashTag image likeCount subscriberCount subscriber regDate',
      page: page,
      limit: limit,
      sort: 'initial'
    },
    callback
  );
}


module.exports.getAllHashTags = function(callback) {
  HashTag
    .find(callback)
    .select('_id twitterHashTag instagramHashTag');
}


module.exports.getHotDolPics = function(callback) {
  HashTag
    .find(callback)
    .select('_id twitterHashTag likeCount')
    .limit(5)
    .sort({likeCount: -1});
}


module.exports.updateSubscibeCount = function(user, callback) {
  HashTag.update(
    {_id: user.hashTagId},
    {$inc: {subscriberCount: 1},
    $push: {'subscriber': {userId: user.userId}}},
    {upsert: true},
    callback
  );
}


module.exports.getMyHashTags = function(query, page, limit, callback) {
  HashTag.paginate(
    query,
    {
      select: '_id twitterHashTag image likeCount subscriberCount',
      page: page,
      limit: limit,
      sort: 'initial'
    },
    callback
  );
}


module.exports.deleteMyHashTag = function(data, callback) {
  HashTag.update(
    {_id: data.hashTagId},
    {
      $inc: {subscriberCount: -1},
      $pull: {'subscriber': {userId: data.userId}}
    },
    {upsert: true},
    callback
  );
}


module.exports.addImageLike = function(data, callback) {
  HashTag.update(
    {_id: data.hashTagId},
    {$inc: {likeCount: 1}},
    {upsert: true},
    callback
  );
}


module.exports.getMainList = function(random, callback) {
  HashTag
    .find({})
    .limit(5)
    .skip(random)
    .select('_id')
    .exec(callback);
}


module.exports.getHashTagId = function(random, callback) {
  HashTag
    .findOne({})
    .skip(random)
    .select('_id')
    .exec(callback);
}


module.exports.getHashTagIdByHasTag = function(query, callback) {
  HashTag
    .findOne(query)
    .select('_id')
    .exec(callback);
}