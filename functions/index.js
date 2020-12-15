const functions = require('firebase-functions');
const express = require('express')
const app = express()
const fs = require('fs');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/static'));

const getArtifacts = () => {
    return new Promise((resolve,reject)=>{
        let artifacts = []
        fs.readFile('artifacts.json', (err,data)=>{
            if(err) reject(err)
            artifacts = JSON.parse(data);
            resolve(artifacts)
        })
    })
}   

const getWeapons = () =>{
    return new Promise((resolve,reject)=>{
        let weapons = []
        fs.readFile('weapons.json', (err,data)=>{
            if(err) reject(err)
            weapons = JSON.parse(data);
            resolve(weapons)
        })
    })
}

const getGastronomy = () =>{
    return new Promise((resolve,reject)=>{
        let gastronomy = []
        fs.readFile('gastronomy.json', (err,data)=>{
            if(err) reject(err)
            gastronomy = JSON.parse(data);
            resolve(gastronomy)
        })
    })
}

const getAllCharacters = () =>{
    return new Promise((resolve,reject)=>{
        let characters = []
        fs.readFile('characters.json', (err,data)=>{
            if(err) reject(err)
            characters = JSON.parse(data);
            resolve(characters)
        })
    })
}

const getCharacter = (name) =>{
    return new Promise((resolve,reject)=>{
        let character = {}
        fs.readFile('characters.json', (err,data)=>{
            if(err) reject(err)
            let allCharacters = JSON.parse(data);
            character = allCharacters.find(obj=>{
                return obj.name === name
            })
            resolve(character)
        })
    })
}


app.get('/', async (req,res)=>{
    // dont forget to set/enable caching
    let data = []
    try{
        let res = await getAllCharacters()
        data = res
    }
    catch(err){
        throw err
    }
    res.render('pages/index',{data})
})

app.get('/search?:query', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    getArtifacts()
    res.render('pages/search');
});

app.get('/artifacts', async (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    let data = []
    try{
        let res = await getArtifacts()
        data = res
    }
    catch(err){
        throw err
    }
    res.render('pages/artifacts',{data});
});

app.get('/weapons', async (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    let data = []
    try{
        let res = await getWeapons()
        data = res
    }
    catch(err){
        throw err
    }
    res.render('pages/weapons',{data});
});

app.get('/gastronomy', async (req,res)=>{
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
    let data = []
    try{
        let res = await getGastronomy()
        data = res
    }
    catch(err){
        throw err
    }
    res.render('pages/gastronomy',{data})
})

app.get('/characters/:name', async (req,res)=>{
    let data = {}
    try{
        let res = await getCharacter(req.params.name)
        console.log(res)
        data = res
    }
    catch(err){
        throw err
    }
    res.render('pages/character',{data})
})


exports.app = functions.https.onRequest(app)
