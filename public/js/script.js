const route = function (id = null) {
    parseUrl(id).then(url => {
        switch (url.page) {
            case 'team':
                displayTeam(url.query.id)
                break
            case 'pertandingan':
                if (url.query.teamId != undefined) {
                    displayMatch(url.query.teamId)
                } else {
                    displayMatch()
                }
                break
            case 'favorit':
                displayFavTeam()
                break
            default:
                loadPage(url.page).then(page => {
                    if (page == 'home') displayKlasemen()
                })
                break
        }
    })
}

document.addEventListener('DOMContentLoaded', async function () {
    loadNav()
    route()
})

// * Home
async function displayKlasemen() {
    const tbody = document.querySelector('tbody')
    let rowTable = ''
    const data = await getKlasemen()
    await data.standings[0].table.forEach(dTeam => {
        rowTable += `<tr>
                <td>${dTeam.position}</td>
                    <td><a href="#team?id=${dTeam.team.id}" class="link-to-team valign-wrapper">
                    <img src="${dTeam.team.crestUrl.replace(/^http:\/\//i, 'https://')}" class="show-on-medium-and-up show-on-medium-and-down" alt="logo club" style="float:left;width:22px;height:22px;margin-right:20px"> ${dTeam.team.name}</a> 
                    </td>
                    <td>${dTeam.playedGames}</td><td>${dTeam.won}</td><td>${dTeam.draw}</td><td>${dTeam.lost}</td><td>${dTeam.goalsFor}</td><td>${dTeam.goalsAgainst}</td><td>${dTeam.goalDifference}</td><td>${dTeam.points}</td>
                </tr>`
    })
    tbody.innerHTML = rowTable

    document.getElementById('preloaderklasemen').style.display = 'none';

    document.querySelectorAll('.link-to-team').forEach(link => {
        link.addEventListener('click', async click => {
            // click.preventDefault()
            route(click.target.getAttribute('href'))
        })
    })
}

// * Team
async function displayTeam(id) {
    const data = await getTeam(id)
    const matchdata = await getMatchTeam(id)

    let squadLeft = '',
        squadRight = '',
        league = '',
        match = ''

    data.activeCompetitions.forEach(v => {
        league += `<a href="">${v.name}</a> ,`
    })

    loadPage('team').then(function () {
        initCollapsable()

        let dataFav = {
            id: data.id,
            name: data.name,
            address: data.address,
            phone: data.phone,
            website: data.website,
            founded: data.founded,
            clubColors: data.clubColors,
            vanue: data.vanue,
            crestUrl: data.crestUrl,
            league,
            squadLeft,
            squadRight,
            match,
        }

        document.querySelector('.team-name h3').innerHTML = data.name

        document.querySelector('#information').innerHTML = `
            <li class="collection-item">Address : ${data.address}</li>
            <li class="collection-item">Phone : ${data.phone}</li>
            <li class="collection-item">Website : <a href="${data.website}" target="_blank">${data.website}</a></li>
            <li class="collection-item">Email : ${data.email}</li>
            <li class="collection-item">Founded : ${data.founded}</li>
            <li class="collection-item">Club Colors : ${data.clubColors}</li>
            <li class="collection-item">Stadium : ${data.venue}</li>
        `
        crestImage = document.querySelector('.team-wraper-top img')
        crestImage.setAttribute('src', data.crestUrl.replace(/^http:\/\//i, 'https://'))
        crestImage.setAttribute('alt', data.name)

        checkFavId(data.id)
        const teamFavButton = document.querySelector('.fav-btn')
        teamFavButton.addEventListener('click', click => {
            click.preventDefault()
            checkFav(data.id, true)
        })

        function checkFavId(id) {
            isFav(id).then(v => {
                if (v) {
                    teamFavButton.style.backgroundColor = '#2D8A92'
                    teamFavButton.innerHTML = 'Unfavorite'
                } else {
                    teamFavButton.style.backgroundColor = '#2D8A92'
                    teamFavButton.innerHTML = 'add to favorite'
                }
            })
        }


        function checkFav(id, event = false) {
            isFav(id).then(v => {
                if (v) {
                    teamFavButton.style.backgroundColor = '#2D8A92'
                    if (event) {
                        M.toast({html: data.name+' removed from favorites'})
                        deleteTeamFav(id);
                        teamFavButton.style.backgroundColor = '#2D8A92'
                        teamFavButton.innerHTML = 'add to favorite'
                    }
                } else {
                    teamFavButton.style.backgroundColor = '#2D8A92'

                    if (event) {
                        M.toast({html: data.name + ' added to favorite'})
                        addTeamFav(dataFav);
                        teamFavButton.style.backgroundColor = '#2D8A92'
                        teamFavButton.innerHTML = 'unfavorite'
                    }
                }
            })
        }
    })
}

// * match page 
async function displayMatch(id = null) {
    const data = await getMatch(id)
    let match = ''

    data.matches.forEach(v => {
        match += `
        <div class="col s12 m6 l6">
        <div class="card tinggi horizontal d-flex f-width-100 align-item-center">
            <div class="card-content">
            <div class="row">
            <div class="col s12 m12 l12 justify-center">
                <p class=" text-darken-3">${new Date(v.utcDate).toLocaleDateString('en-ID',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>
        <div class="row mb-0">
            <div class="col s5 m5 l5">
                <h6>Home</h6> 
                <a id="home-team-link" href="#team?id=${v.homeTeam.id}">${v.homeTeam.name}</a> 
            </div>
            <div class="col s2 m2 l2">
                <h5>VS</h5>
            </div>
            <div class="col s5 m5 l5">
                <h6>Away</h6> 
                <a id="away-team-link" href="#team?id=${v.awayTeam.id}">${v.awayTeam.name}</a>   
            </div>
        </div>
            </div>
        </div>
    </div>
        `
    })

    loadPage('pertandingan').then(function () {
        document.querySelector('#match').innerHTML = match

        document.querySelectorAll('#home-team-link , #away-team-link').forEach(link => {
            link.addEventListener('click', click => {
                route(click.target.getAttribute('href'))
            })
        })
    })
}

// * page favorite team
function displayFavTeam() {
    let data = ''

    getAllTeamFav().then(favs => {

        if(favs == null || favs ==""){
            M.toast({html: 'Favorite is empty'})
        }
        else{
            for (const f of favs) {
                data += `
                        <li class="collection-item left-align" id="unfav-id-${f.id}">
                        <div class="d-flex space-betwen align-item-center">
                        <p class="left-align"><img src="${f.crestUrl.replace(/^http:\/\//i, 'https://')}" class="show-on-medium-and-up show-on-medium-and-down" alt="logo club" style="float:left;width:22px;height:22px;margin-right:20px"> ${f.name}</p> 
                        <a href="#unfav-me" class="waves-effect waves-light btn unfav" data-id="${f.id}">unfavorite</a>
                        </div>
                            </li>
                                `
            }
        }
    })

    loadPage('favorit').then(function () {
        const ulTeamFav = document.querySelector('#favorite')
        ulTeamFav.innerHTML = data

        document.querySelectorAll('.unfav').forEach( btn => {
            btn.addEventListener('click',click => {
                click.preventDefault()
                deleteTeamFav(parseInt(click.target.getAttribute('data-id')))
                ulTeamFav.querySelector('#unfav-id-'+click.target.getAttribute('data-id')).style.display = 'none'
            })
        })

    })
}