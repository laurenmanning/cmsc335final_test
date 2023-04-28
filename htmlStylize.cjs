function createOptions(pokemon){
    let html_str = ""
    pokemon.forEach( x => html_str += `<option>${x}</option>` );
    return html_str;
}

function createRatingsTable(pokmeon){
    let html_str = "<table ><tr><th>Pokemon</th><th>Average Rating</th><tr>"
    pokmeon.forEach( x => {
        let nameLink = `<a href=/browse/${x.name}>${x.name}</a>`
        html_str += `<tr><td>${nameLink}</td><td>${x.stars}</td></tr>` }
         );
    html_str += "</table>"
    return html_str;
}

function createCommentsTable(comments) {
    let html_str = "<table ><tr><th>Stars</th><th>Comment</th><tr>"
    comments.forEach( x => {
        html_str += `<tr><td>${x.stars}</td><td>${x.comments}</td></tr>` }
         );
    html_str += "</table>"
    return html_str;
}
module.exports = { createOptions, createRatingsTable, createCommentsTable }