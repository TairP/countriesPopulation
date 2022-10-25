function getCountryPopulation(country){
    return new Promise((resolve,reject)=> {
        const url = `https://countriesnow.space/api/v0.1/countries/population`;
        const options = {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({country})
        };
        fetch(url,options)
            .then(res => res.json())
            .then(json => {
                if (json?.data?.populationCounts) resolve(json.data.populationCounts.at(-1).value);
                else reject(new Error(`My Error: no data for ${country}`)) //app logic error message
            })
            .catch(err => reject(err)) // network error - server is down for example...
            // .catch(reject)  // same same, only shorter... 
    })
}


//--------------------------------------------------------
//  Manual - call one by one...
//--------------------------------------------------------
function manual() {
    getCountryPopulation("France")
        .then(population => {
            console.log(`Population of France is ${population}`);
            return getCountryPopulation("Germany")
        })
        .then(population => console.log(`Population of Germany is ${population}`))
        .catch(err=> console.log('Error in manual: ',err.message));
}
manual()


//------------------------------
//   Sequential processing 
//------------------------------
const countries = ["France","Russia","Germany","United Kingdom","Portugal","Spain","Netherlands","Sweden","Greece","Czechia","Romania","Israel"];

function sequence() {
    Promise.each(countries, country => {
        return getCountryPopulation(country)
        .then(population => {
            console.log(`Population of ${country} is ${population}`)
        })
        .catch(err => {
            console.log(`${country} failed: ${err.message}`)
        })
    }).then(countries => {
        console.log|(`Got all population of all countries`)
        console.log(`Countries: ${countries}`)
    }).catch(err => {
        console.log(`Error is sequence: `, err.message)
    })

}
sequence()

//--------------------------------------------------------
//  Parallel processing 
//--------------------------------------------------------
function parallel() {
    Promise.map(countries, country => {
        return getCountryPopulation(country)
        // .then(population => {
        //     console.log(`Population of ${country} is: ${population}`)
        // })
        .catch(err => {
            console.log(`${country} failed: ${err.message}`)
        })
    }).then(populations => {
        populations.forEach((population, i) => {
            console.log(`population of ${countries[i]} is ${population}`)
        });
    }).catch(err => console.log('Error is parallel: ', err.message))
}
parallel()