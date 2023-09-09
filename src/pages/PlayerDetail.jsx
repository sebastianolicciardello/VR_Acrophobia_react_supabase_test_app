import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useLocation, useNavigate } from 'react-router-dom'

const PlayerDetail = () => {
    const [player, setPlayer] = useState({
        difficulty: 0,
        no_movement: false,
        no_turn: false
    })
    const location = useLocation()
    const playerId = location.state.playerId
    const navigate = useNavigate()

    // Recupera il token da sessionStorage all'avvio del componente
    const token = JSON.parse(sessionStorage.getItem('token'))

    if (!token) {
        navigate("/")
    }

    useEffect(() => {
        fetchPlayers()
    }, [])

    async function fetchPlayers() {
        const { data } = await supabase.from('players').select().eq('id', playerId).single()
        setPlayer(data)
    }

    function handleDifficultyChange(event) {
        const value = event.target.value
        updateValue('difficulty', value)
    }

    function handleNoMovementChange(event) {
        const value = event.target.checked
        updateValue('no_movement', value)
    }

    function handleNoTurnChange(event) {
        const value = event.target.checked
        updateValue('no_turn', value)
    }

    async function updateValue(key, value) {
        const { data } = await supabase
            .from('players')
            .update({ [key]: value })
            .eq('id', playerId)
            .single()
        setPlayer(prevPlayer => ({ ...prevPlayer, [key]: value }))
    }

    async function deletePlayer() {
        const {data, error} = await supabase.from('players').delete().eq('id', playerId)
        navigate('/homepage')
        if (error) {
            console.log(error)
        }
        if (data) {
            console.log(data)
        }
      }

    return (
        <div className="p-4">
            <div>
                <button
                    onClick={() => navigate('/homepage')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4"
                >
                    Back
                </button>
            </div>
            <div className="flex  flex-col justify-center items-center">
                <h1 className="text-4xl font-light mb-4">{player.full_name}</h1>
                <h1 className="text-2xl font-medium mb-4">
                    Points: <span className="font-bold">{player.points}</span>
                </h1>
                <h1 className="mb-4">
                    Floor Unlocked: <span className="font-bold">{player.floor_unlocked}</span>
                </h1>

                <h1 className="mb-4">
                Difficulty:
                <select
                    value={player.difficulty}
                    onChange={handleDifficultyChange}
                    className="mx-4 py-1 px-1 border border-gray-300 rounded-lg align-middle"
                >
                    <option value={0}>Easy</option>
                    <option value={1}>Medium</option>
                    <option value={2}>Hard</option>
                </select>
            </h1>
            <h1 className="mb-4 align-middle">
                No Movement:
                <input
                    type="checkbox"
                    checked={player.no_movement}
                    onChange={handleNoMovementChange}
                    className="ml-2 align-middle"
                />
            </h1>
            <h1 className="mb-4 align-middle">
                No Turn:
                <input
                    type="checkbox"
                    checked={player.no_turn}
                    onChange={handleNoTurnChange}
                    className="ml-2 align-middle"
                />
            </h1>
            <button
                    onClick={()=>{deletePlayer()}}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mb-4"
                >
                    Delete
                </button>
            </div>

            
        </div>
    );

}

export default PlayerDetail
