var React = require('react');
var HomePage = require('./pages/Home.react.js');

var artists = viewModel.viewModel.artists;

React.render(
    <HomePage artists = {artists}/>,
    document.getElementById('pageContainer')
);