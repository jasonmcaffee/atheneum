var express = require('express');
var router = express.Router();

var musicItemRepository = require('./../model/musicItemRepository.js').musicItemRepository;//fetching files
var musicItemsViewModelFactory = require('./../model/musicItemsViewModel').musicItemsViewModelFactory;

var config = {
  musicRootFilePath : '/volumes/fourtera_2012/music'
};

//app startup
var viewModel = {viewModel:{musicItems:[]}};
musicItemRepository.init(config.musicRootFilePath);

musicItemRepository.getMusicItems(function(musicItems){
  console.log('getMusicItems callback');
  //viewModel = musicItemsViewModelFactory.createViewModel(musicItems);
  viewModel = musicItemsViewModelFactory.createArtistViewModel(musicItems);
  //console.log('testing : ' + viewModel.viewModel.artists['air'].albums['2006 - late night tales'].songs.length);
  //var air = JSON.stringify(viewModel.viewModel.artists['air']);
  //console.log(air);
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.html', {
    viewModel: viewModel,
    title: 'Antheneum'
  });
});

module.exports = router;
