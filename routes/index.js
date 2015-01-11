var express = require('express');
var router = express.Router();
var fs = require('fs');

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
    title: 'Atheneum'
  });
});




router.get('/getSong', function(request, response){
  var songId = request.query['songId'];
  var self = this;
  console.log('====================getSong with id: ' + songId);
  //musicItemRepository.init(nodeMusic.options.musicRootFilePath);

  console.log('--- request range: '+ request.headers.range);



  musicItemRepository.getMusicItemById(songId, (function(req, res){
    return function(musicItem){
      if(!musicItem) {//end things if we can't find the song
        //musicItem = {id:-1, songName: 'not found', artist: 'not found'};
        res.write('sorry, I couldnt find the id: ' + songId);
        res.end();
      }else{//we have found the song, so read it from disk and send it to them.
        console.log('getMusicItemById callback. found item with id: ' + musicItem.id);
        console.log('attempting to read file: ' + musicItem.fullPath);

        var range = req.headers.range;
        try{
          var end;
          if(range){
            var byteRanges = range.replace(/bytes=/, '').split('-');
            var ini = parseInt(byteRanges[0], 10);
            end = parseInt(byteRanges[1], 10);
            console.log('end is :' + end);
          }

          //https://groups.google.com/forum/#!msg/jplayer/nSM2UmnSKKA/bC-l3k0pCPMJ

          //https://groups.google.com/forum/?fromgroups=#!topic/nodejs/gzng3IJcBX8
          //if the range was requested, caclulate appropriate byte range
          //set response status to 206
          if(!isNaN(end)){//iphone & ipad
            var byteRanges = range.replace(/bytes=/, '').split('-');
            var ini = parseInt(byteRanges[0], 10);
            var end = parseInt(byteRanges[1], 10);
            // if(isNaN(end)){ //chrome doesn't send 0-X, sometimes just 0-
            //     end = musicItem.size;
            // }
            console.log('byteranges: ' + JSON.stringify(byteRanges));
            console.log('ini: ' + ini);
            console.log('end: ' + end);

            var total = end - ini + 1;

            console.log('total is: ' + total);

            var contentRangeString = 'bytes '+ ini + '-'+ end +'/' + musicItem.size;
            console.log('contentRangeString is: ' + contentRangeString);

            //var data = fs.readFileSync(musicItem.fullPath);
            res.writeHead(206,{
              'Content-Type':'audio/mpeg',
              'Content-Length':total,
              //'Content-Length':data.length,
              'Content-Range': contentRangeString,
              'Accept-Ranges': 'bytes',
              'X-Pad':'avoid browser bug',
              'Cache-Control': 'public, must-revalidate, max-age:0',
              'Content-Transfer-Encoding':'binary',
              'Pragma':'no-cache',
              'Content-Disposition': 'inline; filename="/getSong?songId=' + songId + '"'
            });

            //res.end(data);
            var stream = fs.createReadStream(musicItem.fullPath, { start: ini, end: end })
              .on("open", function() {
                stream.pipe(res);
              }).on("error", function(err) {
                res.end(err);
              });

          }else{ //chrome
            console.log('chrome way...');

            //just write out the whole file.
            var data = fs.readFileSync(musicItem.fullPath);

            res.writeHead(200,{
              'Content-Type':'audio/mpeg',
              'Content-Length': data.length,
              'Content-Disposition': 'inline; filename="/getSong?songId=' + songId + '"'
            });
            res.end(data);
          }

        }catch(ex){
          console.log('music server exception: ' + ex);
        }

      }
    }
  })(request, response), function(errorMessage){
    res.write('sorry, I couldnt find the id: ' + songId);
    res.end();
  });

});

module.exports = router;







//
//router.get('/getSong', function(request, response){
//  var songId = request.query['songId'];
//  var self = this;
//  console.log('====================getSong with id: ' + songId);
//  //musicItemRepository.init(nodeMusic.options.musicRootFilePath);
//
//  console.log('--- request range: '+ request.headers.range);
//
//
//
//  musicItemRepository.getMusicItemById(songId, (function(req, res){
//    return function(musicItem){
//      if(!musicItem) {//end things if we can't find the song
//        //musicItem = {id:-1, songName: 'not found', artist: 'not found'};
//        res.write('sorry, I couldnt find the id: ' + songId);
//        res.end();
//      }else{//we have found the song, so read it from disk and send it to them.
//        console.log('getMusicItemById callback. found item with id: ' + musicItem.id);
//        console.log('attempting to read file: ' + musicItem.fullPath);
//
//        var range = req.headers.range;
//        try{
//          var end;
//          if(range){
//            var byteRanges = range.replace(/bytes=/, '').split('-');
//            var ini = parseInt(byteRanges[0], 10);
//            end = parseInt(byteRanges[1], 10);
//            console.log('end is :' + end);
//          }
//
//          //https://groups.google.com/forum/#!msg/jplayer/nSM2UmnSKKA/bC-l3k0pCPMJ
//
//          //https://groups.google.com/forum/?fromgroups=#!topic/nodejs/gzng3IJcBX8
//          //if the range was requested, caclulate appropriate byte range
//          //set response status to 206
//          if(!isNaN(end)){//iphone & ipad
//            var byteRanges = range.replace(/bytes=/, '').split('-');
//            var ini = parseInt(byteRanges[0], 10);
//            var end = parseInt(byteRanges[1], 10);
//            // if(isNaN(end)){ //chrome doesn't send 0-X, sometimes just 0-
//            //     end = musicItem.size;
//            // }
//            console.log('byteranges: ' + JSON.stringify(byteRanges));
//            console.log('ini: ' + ini);
//            console.log('end: ' + end);
//
//            var total = end - ini + 1;
//
//            console.log('total is: ' + total);
//
//            //new
//            //if(musicItem.size -1 < chunk){
//            //  chunk = musicItem.size -1;
//            //}
//
//            var contentRangeString = 'bytes '+ ini + '-'+ end +'/' + musicItem.size;
//            console.log('contentRangeString is: ' + contentRangeString);
//
//            var data = fs.readFileSync(musicItem.fullPath);
//            res.writeHead(206,{
//              'Content-Type':'audio/mpeg',
//              'Content-Length':total,
//              //'Content-Length':data.length,
//              'Content-Range': contentRangeString,
//              'Accept-Ranges': 'bytes',
//              'X-Pad':'avoid browser bug',
//              'Cache-Control': 'public, must-revalidate, max-age:0',
//              'Content-Transfer-Encoding':'binary',
//              'Pragma':'no-cache',
//              'Content-Disposition': 'inline; filename="/getSong?songId=' + songId + '"'
//            });
//
//            res.end(data);
//
//
//          }else{ //chrome
//            console.log('chrome way...');
//
//            //just write out the whole file.
//            var data = fs.readFileSync(musicItem.fullPath);
//
//            res.writeHead(200,{
//              'Content-Type':'audio/mpeg',
//              'Content-Length': data.length,
//              'Content-Disposition': 'inline; filename="/getSong?songId=' + songId + '"'
//            });
//            res.end(data);
//          }
//
//        }catch(ex){
//          console.log('music server exception: ' + ex);
//        }
//
//      }
//    }
//  })(request, response), function(errorMessage){
//    res.write('sorry, I couldnt find the id: ' + songId);
//    res.end();
//  });
//
//});