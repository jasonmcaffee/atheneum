var React = require('react');

var ArtistTable = React.createClass({
    //getInitialState: function(){
    //    //this.props.artists.air.albums['1998 moon safari'].expanded = true;
    //    return shownAlbum;
    //},
    /**
     *
     * @returns {XML}
     */
    render:function(){
        var rows = this.createArtistRows(this.props.artists);
        return(
            <div class="artists">
            {rows}
            </div>
        );
    },

    /**
     *
     * @param artists
     * @returns {Array}
     */
    createArtistRows:function(artists){
        var rows = [],
            x = 0;
        for(var artistName in artists){
            var artist = artists[artistName];
            var row = this.createArtistRow(artist, artistName, ++x);
            rows.push(row);
        }
        return rows;
    },

    /**
     *
     * @param artist
     * @param artistName
     * @param index
     * @returns {XML}
     */
    createArtistRow:function(artist, artistName, index) {
        var id = "artist_" + index,
            albumRows = null;
        if(artist.expanded){
            albumRows = this.createAlbumRows(artist);
        }
        var row =
            <div id={id} class="artist">
                <h2 onClick={this.handleArtistClick.bind(this, artist)}>{artistName}</h2>
                {albumRows}
            </div>;
        return row;
    },

    /**
     *
     * @param artist
     * @param x
     */
    handleArtistClick:function(artist, x){
        console.log('artist is:');
        artist.expanded = !artist.expanded;
        this.setState();
    },

    /**
     *
     * @param artist
     * @returns {Array}
     */
    createAlbumRows:function(artist){
        var rows = [];
        for (var albumName in artist.albums){
            var album = artist.albums[albumName];
            var albumRow = this.createAlbumRow(album, albumName);
            rows.push(albumRow);
        }
        return rows;
    },

    /**
     *
     * @param album
     * @param albumName
     * @returns {*}
     */
    createAlbumRow: function(album, albumName){
        var songRows = this.createSongRows(album);
        var row =
            <div class="album">
                <h3>{albumName}</h3>
                {songRows}
            </div>;
        return row;
    },

    /**
     *
     * @param album
     * @returns {Array}
     */
    createSongRows: function(album){
        var rows = [];
        for(var i=0; i < album.songs.length; ++i){
            var song = album.songs[i];
            var songRow = this.createSongRow(song);
            rows.push(songRow);
        }
        return rows;
    },

    /**
     *
     * @param song
     * @returns {XML}
     */
    createSongRow: function(song){
        var row = <div class="song">{song.songName}</div>;
        return row;
    }
});

module.exports = ArtistTable;