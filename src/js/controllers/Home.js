var $ = require('jquery');
var React = require('react');
var HomePage = require('pages/Home.react');
var ArtistsModel = require('model/Artists');

function Home(){
    this.artistsModel = new ArtistsModel(viewModel.viewModel.artists);

}

$.extend(Home.prototype, {
    action:function(){
        this.displayHomePage();
    },
    displayHomePage:function(){
        React.render(
            <HomePage artistsModel = {this.artistsModel}/>,
            document.getElementById('pageContainer')
        );
    }
});



module.exports = new Home();