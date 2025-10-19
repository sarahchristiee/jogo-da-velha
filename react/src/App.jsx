import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { FiRefreshCw } from 'react-icons/fi'; // icone de reset
import cliqueSom from './assets/sounds/clique.mp3'; // efeito sonoro para clique
import gameOverSom from './assets/sounds/fim.wav'; // som pra fim de jogo

function App() {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [animatingIndex, setAnimatingIndex] = useState(null);

  const popSomRef = useRef();
  const gameOverSomRef = useRef();

  // para puxar os efeitos sonoros
  useEffect(() => {
    popSomRef.current = new Audio(cliqueSom);
    gameOverSomRef.current = new Audio(gameOverSom);
  }, []);


  // para calcular quem ganhou
  const calculateWinner = (squares) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    for (let [a,b,c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  // cliques
  const handleClick = (index) => {
    if (board[index] || winner) return;

    // Tocar som de clique
    if(popSomRef.current){
      popSomRef.current.currentTime = 0;
      popSomRef.current.play();
    }
    
    // animação de clique
    setAnimatingIndex(index);

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    // variaveis de fim de jogo
    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win);
      if(gameOverSomRef.current) gameOverSomRef.current.play();
    } else if (!newBoard.includes(null)) {
      setWinner('Empate');
      if(gameOverSomRef.current) gameOverSomRef.current.play();
    } else {
      setIsXNext(!isXNext);
    }

    setTimeout(() => setAnimatingIndex(null), 400);
  };

  // para resetar o jogo
  const resetGame = () => {
    setBoard(initialBoard);
    setIsXNext(true);
    setWinner(null);
  };

  // Renderiza o status do jogo, vez do jogador, se deu empate ou quem ganhou, isso vai ser exibido na tela
  const renderStatus = () => {
    if (winner === 'Empate') return 'Empate!';
    if (winner) return `Vencedor: ${winner}`;
    return `Vez de jogar: ${isXNext ? 'X' : 'O'}`;
  };

 // conteudo html
  return (
    <div className="container">

       <h1>🍓 Jogo da Velha 🍓</h1>
      
      {/* status do jogo (vez, vitpria, empate) */}
      <div className="status">{renderStatus()}</div> 

      {/* tabuleiro */}
      <div className="board">
        {board.map((square, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className={`square ${animatingIndex === idx ? 'pulse' : ''}`}
          >
            {square}
          </button>
        ))}
      </div>

      {/* botão para reset */}
      <button onClick={resetGame} className="reset-button">
        <FiRefreshCw size={30} /> Reiniciar
      </button>
    </div>
  );
}

export default App;
