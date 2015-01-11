var $ = require('jquery');

function ArtistsModel(artists){
    this.artists = artists;
}

$.extend(ArtistsModel.prototype, {

    getDisplayedArtists:function(){
      return this.artists;
    },
    /**
     * Searches through all artists and
     * creates an object representing below structure based on songId:
     * {
         *    artistName: 'artist',
         *    albumName: 'album',
         *    songName: 'song'
         * }
     * useful for when the song is clicked and we need to find the data.
     * @param songId
     */
    findArtistInfoBySongId : function(songId){
        songId = parseInt(songId);
        //alert('finding song');
        for(var artistName in this.artists){
            var artist = this.artists[artistName];
            for(var albumName in artist.albums){
                var album = artist.albums[albumName];
                for(var i = 0; i < album.songs.length; ++i){
                    var song = album.songs[i];
                    //log('song name: {0}, id:{1}', song.songName, song.id);
                    if(song.id === songId){   //break out of the loop with the current info.
                        //alert('done finding song');
                        return {
                            artistName : artistName,
                            albumName : albumName,
                            songName : song.songName,
                            songId : songId
                        };
                    }
                }
            }
        }
    }

});

module.exports = ArtistsModel;