var mongoose = require('mongoose');
var Transaction = require('mongoose-transaction')(mongoose);
var bcrypt = require('bcryptjs');
var schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var userSchema = schema({
  username:{
    type: String,
    unique: true
  },
  kakaoId:{
    type: String
  },
  facebookId:{
    type: String
  },
  password:{
    type:String,
    bcrypt: true
  },
  userType:{
    type: Number,
    default: 2
  },
  regDate:{
    type: Date,
    default: Date.now
  },
  lastLoginDate:{
    type: Date,
    default: Date.now
  },
  passwdUpdateDate:{
    type: Date,
    default: Date.now
  },
  subscribeHashTag:[{
    hashTagId: {
      type: schema.Types.ObjectId,
      ref: 'HashTag'
    },
    regDate:{
      type: Date,
      default: Date.now
    }
  }],
  likeImage:[{
    hashTagId: {
      type: schema.Types.ObjectId,
      ref: 'HashTag'
    },
    regDate:{
      type: Date,
      default: Date.now
    }
  }]
});

userSchema.plugin(mongoosePaginate);
var User = module.exports = mongoose.model("User", userSchema);


module.exports.getUsers = function(query, page, limit, callBack) {
  User.paginate(query, { page: page, limit: limit, sort: 'username'}, callBack);
}


module.exports.getFavoriteHashTag = function(username, callBack) {
  User.findOne({username: username}, callBack);
}


module.exports.getUserById = function(userId, callBack){
  User.findOne({_id: userId }, callBack);
}


module.exports.getUserByQuery = function(query, callBack){
  User.findOne(query, callBack);
}


module.exports.comparePassword = function(candidatePassword, hash, callBack){
  bcrypt.compare(candidatePassword, hash, function(error, isMatch){
    if (error) throw error;

    callBack(null, isMatch);
  });
}


module.exports.addUser = function(user, callBack) {
  bcrypt.hash(user.password, 10, function(error, hash) {
    if (error) throw error;

    user.password = hash;
    user.save(callBack);
  });
}


module.exports.deleteUser = function(username, callBack) {
  User.remove({_id: username}, callBack);
}


module.exports.addSubscibe = function(data, callBack) {
  User.update(
    {_id: data.userId},
    {$push: {'subscribeHashTag': {hashTagId: data.hashTagId}}},
    {upsert: true},
    callBack
  );

  // var transaction = new Transaction();
  // transaction.insert('User', {userId:'someuser1' , emailId:'test email1'});
  // transaction.update('User', id, {userId:'someuser2' , emailId:'test email2'});
  // transaction.remove('User', id2);
  // transaction.run(function(err, docs){
  //   // your code here
  // });
}

module.exports.checkSubscibe = function(query, callBack) {
  User.findOne(query, callBack);
}


module.exports.deleteSubscibe = function(data, callBack) {
  User.update(
    {_id: data.userId},
    {$pull: {'subscribeHashTag': {hashTagId: data.hashTagId}}},
    {upsert: true},
    callBack
  );
}