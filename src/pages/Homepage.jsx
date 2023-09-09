import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';

const Homepage = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState({
    fullName: ''
  });

  // Recupera il token da sessionStorage all'avvio del componente
  const token = JSON.parse(sessionStorage.getItem('token'));

  if (!token) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token'); // Rimuovi il token da sessionStorage
    navigate('/');
  }

  async function fetchPlayers() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('therapist', token.user.id)
      .order('id', { ascending: true });
    setPlayers(data);
  }

  function handleChange(event) {
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      [event.target.name]: event.target.value
    }));
  }

  async function createPlayer() {
    await supabase.from('players').insert({
      full_name: player.fullName
    });
    fetchPlayers();
  }

  return (
    <div className="container mx-auto px-4">
      <Header fullName={token?.user?.user_metadata?.full_name} handleLogout={handleLogout} />

      <div className="flex justify-center flex-col items-center">
              <form onSubmit={createPlayer} className="mb-4">
        <input
          type="text"
          placeholder="Full Name"
          name="fullName"
          onChange={handleChange}
          className="mb-4 mx-4 py-2 px-3 border border-gray-300 rounded-full"
        />

        <button
          type="submit"
          className=" mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
          Create
        </button>
      </form>

      <table className="table-auto rounded-lg overflow-hidden shadow-lg">
  <thead className="bg-blue-500 text-white">
    <tr>
      <th className="px-4 py-2">ID</th>
      <th className="px-4 py-2">Name</th>
      <th className="px-4 py-2">Points</th>
    </tr>
  </thead>
  <tbody>
    {players.map((player, index) => (
      <tr key={player.id} className="bg-white">
        <td className="px-4 py-2 border">{index + 1}</td>
        <td className="px-4 py-2 border cursor-pointer">
          <Link
            to={`/players/${player.id}`}
            state={{ playerId: player.id }}
            className="hover:underline text-blue-500"
          >
            {player.full_name}
          </Link>
        </td>
        <td className="px-4 py-2 border">{player.points}</td>
      </tr>
    ))}
  </tbody>
</table>

      </div>


    </div>
  );
};

export default Homepage;
