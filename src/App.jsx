import "./App.css"
import random from "./api"
import {useEffect, useState} from 'react';

function App() {

  const [pokemon, setPokemon] = useState({});
  const [newPokemon, setNewPokemon] = useState(true);
  const [pokemonName, setPokemonName] = useState('');
  const [gameState, setGameState] = useState(0);
  const [score, setScore] = useState({'win':0,'lose':0});

  useEffect(() => {
    const getPokemon = async()=>{
      const pokemonRandom = await random();
      pokemonRandom['hidden'] = true;
      setPokemon(pokemonRandom)
    }
    getPokemon();
  }, [newPokemon]);

  useEffect(() => {
    
    const scoreSaved = sessionStorage.getItem('score')
    if(scoreSaved){
      const scoreSavedJSON=  JSON.parse(scoreSaved)
      setScore(scoreSavedJSON)
    }
    
  }, []);
  const handlerClickGuess = ()=>{
    setPokemon(prevPokemon =>({
      ...prevPokemon,
      ['hidden']:false
    }));
    const regex = /\W/i;
    if(pokemonName.toLowerCase().replace(regex, '') === pokemon.name.toLowerCase().replace(regex, '')){
      setGameState(1)
      setPokemonName('')
      setScore(prevScore =>({
        ...prevScore,
        ['win']:prevScore.win +1
      }))
      sessionStorage.setItem('score', JSON.stringify({
        ...score,
        ['win']:score.win +1
      }))
    }else{
      setGameState(2)
      setPokemonName('')
      setScore(prevScore =>({
        ...prevScore,
        ['lose']:prevScore.lose +1
      }))
      sessionStorage.setItem('score', JSON.stringify({
        ...score,
        ['lose']:score.lose +1
      }))
    }

  }
    
  const handlerClickReset = ()=>{
    setNewPokemon(!newPokemon)
    setGameState(0)
    setPokemonName('')
  }
  return (
    <div className="app">
      <div className="score">
        <p className="win">Aciertos: {score.win}</p>
        <p className="lose">Fallos: {score.lose}</p>
      </div>
        <div className={`card ${gameState == 0 ? 'card-normal' : (gameState == 1 ?'card-win' : 'card-lose')  }`}>
          <div className="card-title">
            <h2>
              {
                gameState == 0 ? 'Quién es este Pokemon?':
                (gameState == 1 ? 'Acertaste: ' + pokemon.name : 'Fallaste: ' + pokemon.name )  
              }
            </h2>
          </div>
          <div className="card-image">
            <img 
              src={pokemon.image} 
              className={pokemon.hidden ? 'img-hidden': ''}
            />
          </div>
          <div className="card-footer">
            <div className="nes-field is-inline">
              <input 
                type="text" 
                className="input nes-input"
                placeholder="Name"
                value={pokemonName}
                onChange={e => setPokemonName(e.target.value)}
                />
              <button 
                className="nes-btn is-primary inline_field" 
                onClick={handlerClickGuess}>
                  Adivinar
              </button>
            </div>
            <div >
              <button 
                className="nes-btn"
                onClick={handlerClickReset}>
                  Volver a jugar
              </button>
            </div>
            
          </div>
        </div>
        <footer className="footer">
        &copy; edwinnm {new Date().getFullYear()}
        </footer>
    </div>
  )
}

export default App
