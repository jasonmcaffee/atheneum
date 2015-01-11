var $ = require('jquery');
var React = require('react');
var HomePage = require('pages/Home.react');
var Signal = require('core/Signal');
var ArtistsModel = require('model/Artists');

function Home(){
    this.artistsModel = new ArtistsModel(viewModel.viewModel.artists);
    this.signal = new Signal();
}

$.extend(Home.prototype, {
    action:function(){
        this.displayHomePage();
    },
    displayHomePage:function(){
        React.render(
            <HomePage artistsModel = {this.artistsModel} signal={this.signal}/>,
            document.getElementById('pageContainer')
        );
    }
});



module.exports = new Home();