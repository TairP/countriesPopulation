// async function getCountryPopulation(country){
//     return new Promise((resolve,reject)=> {
//         const url = `https://countriesnow.space/api/v0.1/countries/population`;
//         const options = {
//           method: 'POST', 
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({country})
//         };
//         fetch(url,options)
//             const result = await ((res) => res.json())()
//             .then(json => {
//                 if (json?.data?.populationCounts) resolve(json.data.populationCounts.at(-1).value);
//                 else reject(new Error(`My Error: no data for ${country}`)) //app logic error message
//             })
//             .catch(err => reject(err)) // network error - server is down for example...
//             // .catch(reject)  // same same, only shorter... 
//     })
// }
async function getCountryPopulation(country) {
    try {
      const url = `https://countriesnow.space/api/v0.1/countries/population`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country }),
      };
      let res = await fetch(url, options);
      let json = await res.json();
      if (json?.data?.populationCounts) {
        return json.data.populationCounts.at(-1).value;
      } else {
        throw new Error(`My Error: no data for ${country}`);
      }
    } catch (err) {
      console.log("You Got Error!");
      throw err;
    }
  }


//--------------------------------------------------------
//  Manual - call one by one...
//--------------------------------------------------------

async function manual() {
    try {
      let population = await getCountryPopulation("France");
      console.log(`population of France is ${population}`);
      population = await getCountryPopulation("Germany");
      console.log(`population of Germany is ${population}`);
    } catch (err) {
      console.log("Error in manual: ", err.message);
    }
  }
// (async()=> {
//     const populationFrance = await getCountryPopulation("France")
//             console.log(`Population of France is ${population}`)
//     const populationGermany = await getCountryPopulation("Germany")
//             console.log(`Population of Germany is ${population}`)
// })().catch(err=> console.log('Error in manual: ',err.message));
// function manual() {
//     getCountryPopulation("France")
//         .then(population => {
//             console.log(`Population of France is ${population}`);
//             return getCountryPopulation("Germany")
//         })
//         .then(population => console.log(`Population of Germany is ${population}`))
//         .catch(err=> console.log('Error in manual: ',err.message));
// }
manual()


//------------------------------
//   Sequential processing 
//------------------------------
const countries = ["France","Russia","Germany","United Kingdom","Portugal","Spain","Netherlands","Sweden","Greece","Czechia","Romania","Israel"];

async function sequence() {
    try {
        for(let country of countries) {
            try {
                const population = await getCountryPopulation(country);
                console.log(`population of ${country} is ${population}`);
            } catch (err) {
                console.error(`${country} failed: ${err.message}`);
            }
        }

        console.log(`Got population for ALL countries!`);
        console.log(`countries: ${countries}`);
    } catch(err) {
        console.log("Error in sequence: ", err.message)
    }
}

// function sequence() {
//     Promise.each(countries, country => {
//         return getCountryPopulation(country)
//         .then(population => {
//             console.log(`Population of ${country} is ${population}`)
//         })
//         .catch(err => {
//             console.log(`${country} failed: ${err.message}`)
//         })
//     }).then(countries => {
//         console.log|(`Got all population of all countries`)
//         console.log(`Countries: ${countries}`)
//     }).catch(err => {
//         console.log(`Error is sequence: `, err.message)
//     })

// }
sequence()

//--------------------------------------------------------
//  Parallel processing 
//--------------------------------------------------------
async function parallel() {
    try{
        let promises = countries.map(country => getCountryPopulation(country))
        const populations = await Promise.allSettled(promises)
        console.log(populations)
        populations.forEach((population,i)=> console.log(`population of ${countries[i]} is ${population.value? population.value: population.reason}`));
    }catch(err){
        console.log('Error in sequence: ',err.message);
    }
}
parallel();

// function parallel() {
//     Promise.map(countries, country => {
//         return getCountryPopulation(country)
//         // .then(population => {
//         //     console.log(`Population of ${country} is: ${population}`)
//         // })
//         .catch(err => {
//             console.log(`${country} failed: ${err.message}`)
//         })
//     }).then(populations => {
//         populations.forEach((population, i) => {
//             console.log(`population of ${countries[i]} is ${population}`)
//         });
//     }).catch(err => console.log('Error is parallel: ', err.message))
// }
// parallel()