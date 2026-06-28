import { useState, useEffect } from "react";
import "./index.css";

const BOSSES = ["Brock", "Misty", "Lt. Surge", "Erika", "Sabrina", "Koga", "Blaine", "Giovanni"];
const TYPES = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];
const MOVES = [
  "Tackle", "Scratch", "Pound", "Ember", "Water Gun", "Thunderbolt", "Vine Whip", "Poison Powder",
  "Earthquake", "Fly", "Psychic", "Bug Bite", "Stone Edge", "Shadow Ball", "Dragon Rage", "Crunch",
  "Iron Head", "Dazzling Gleam", "Surf", "Thunder", "Solar Beam", "Blizzard", "Flamethrower", "Ice Beam"
];

export default function App() {
  const [team, setTeam] = useState([
    { name: "Empty", level: 0, type: "Normal", moves: ["", "", "", ""], fainted: false },
    { name: "Empty", level: 0, type: "Normal", moves: ["", "", "", ""], fainted: false },
    { name: "Empty", level: 0, type: "Normal", moves: ["", "", "", ""], fainted: false },
    { name: "Empty", level: 0, type: "Normal", moves: ["", "", "", ""], fainted: false },
    { name: "Empty", level: 0, type: "Normal", moves: ["", "", "", ""], fainted: false },
    { name: "Empty", level: 0, type: "Normal", moves: ["", "", "", ""], fainted: false },
  ]);

  const [deaths, setDeaths] = useState(0);
  const [badges, setBadges] = useState(0);
  const [nextBoss, setNextBoss] = useState("Brock");
  const [levelCap, setLevelCap] = useState(15);
  const [expandedSlot, setExpandedSlot] = useState(null);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("rr-nuzlocke");
    if (saved) {
      const data = JSON.parse(saved);
      setTeam(data.team || team);
      setDeaths(data.deaths || 0);
      setBadges(data.badges || 0);
      setNextBoss(data.nextBoss || "Brock");
      setLevelCap(data.levelCap || 15);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(
      "rr-nuzlocke",
      JSON.stringify({ team, deaths, badges, nextBoss, levelCap })
    );
  }, [team, deaths, badges, nextBoss, levelCap]);

  const updateTeam = (index, field, value) => {
    const newTeam = [...team];
    newTeam[index][field] = value;
    setTeam(newTeam);
  };

  const updateMove = (index, moveIndex, value) => {
    const newTeam = [...team];
    newTeam[index].moves[moveIndex] = value;
    setTeam(newTeam);
  };

  const toggleFainted = (index) => {
    const newTeam = [...team];
    newTeam[index].fainted = !newTeam[index].fainted;
    if (newTeam[index].fainted) {
      setDeaths(deaths + 1);
    } else {
      setDeaths(Math.max(deaths - 1, 0));
    }
    setTeam(newTeam);
  };

  const nextBossIndex = BOSSES.indexOf(nextBoss);
  const activeTeam = team.filter(p => !p.fainted && p.name !== "Empty").length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-red-400 mb-4">
        🎮 Pokémon Nuzlocke Companion
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800 p-3 rounded border border-red-500/30">
          ☠️ Deaths: <span className="text-red-400 font-bold text-lg">{deaths}</span>
        </div>
        <div className="bg-gray-800 p-3 rounded border border-yellow-500/30">
          🏅 Badges: <span className="text-yellow-400 font-bold text-lg">{badges}</span>
        </div>
        <div className="bg-gray-800 p-3 rounded border border-blue-500/30">
          🎯 Next Boss: <span className="text-blue-400 font-bold">{nextBoss}</span>
        </div>
        <div className="bg-gray-800 p-3 rounded border border-green-500/30">
          📈 Level Cap: <span className="text-green-400 font-bold text-lg">{levelCap}</span>
        </div>
        <div className="bg-gray-800 p-3 rounded border border-purple-500/30">
          👥 Active: <span className="text-purple-400 font-bold text-lg">{activeTeam}/6</span>
        </div>
      </div>

      {/* TEAM */}
      <h2 className="text-2xl mb-3 font-bold text-gray-100">Current Team</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {team.map((p, i) => (
          <div
            key={i}
            className={`p-4 rounded border-2 transition cursor-pointer ${
              p.fainted
                ? "bg-gray-900 border-gray-600 opacity-60"
                : "bg-gray-800 border-gray-700 hover:border-blue-500/50"
            }`}
            onClick={() => setExpandedSlot(expandedSlot === i ? null : i)}
          >
            {/* HEADER ROW */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <label className="text-xs text-gray-400 font-semibold">Slot {i + 1}</label>
                <input
                  className="w-full bg-gray-700 p-2 rounded mb-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Pokémon Name"
                  value={p.name}
                  onChange={(e) => updateTeam(i, "name", e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {p.name !== "Empty" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFainted(i);
                  }}
                  className={`ml-2 px-3 py-2 rounded font-bold transition ${
                    p.fainted
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {p.fainted ? "💀" : "✓"}
                </button>
              )}
            </div>

            {/* COLLAPSED VIEW */}
            {expandedSlot !== i && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">Level</label>
                  <input
                    className="w-full bg-gray-700 p-2 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    placeholder="Level"
                    value={p.level}
                    onChange={(e) => updateTeam(i, "level", parseInt(e.target.value) || 0)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Type</label>
                  <select
                    value={p.type}
                    onChange={(e) => updateTeam(i, "type", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-gray-700 p-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* EXPANDED VIEW */}
            {expandedSlot === i && (
              <div className="space-y-3 pt-2 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-400">Level</label>
                    <input
                      className="w-full bg-gray-700 p-2 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="number"
                      placeholder="Level"
                      value={p.level}
                      onChange={(e) => updateTeam(i, "level", parseInt(e.target.value) || 0)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Type</label>
                    <select
                      value={p.type}
                      onChange={(e) => updateTeam(i, "type", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-gray-700 p-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* MOVES */}
                <div>
                  <label className="text-sm text-gray-300 font-semibold">Moves</label>
                  <div className="space-y-2">
                    {p.moves.map((move, moveIndex) => (
                      <select
                        key={moveIndex}
                        value={move}
                        onChange={(e) => updateMove(i, moveIndex, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-gray-700 p-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Move {moveIndex + 1}</option>
                        {MOVES.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedSlot(null);
                  }}
                  className="w-full bg-gray-700 hover:bg-gray-600 p-2 rounded transition text-sm"
                >
                  Collapse
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="mb-6">
        <h2 className="text-2xl mb-3 font-bold text-gray-100">Controls</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setDeaths(deaths + 1)}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition shadow-lg hover:shadow-red-500/50"
          >
            + Death
          </button>

          <button
            onClick={() => setBadges(badges + 1)}
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-semibold transition shadow-lg hover:shadow-yellow-500/50"
          >
            + Badge
          </button>

          {nextBossIndex < BOSSES.length - 1 && (
            <button
              onClick={() => setNextBoss(BOSSES[nextBossIndex + 1])}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition shadow-lg hover:shadow-blue-500/50"
            >
              Next Boss →
            </button>
          )}

          <button
            onClick={() => {
              setTeam(team.map(() => ({ name: "Empty", level: 0, type: "Normal", moves: ["", "", "", ""], fainted: false })));
              setDeaths(0);
              setBadges(0);
              setNextBoss("Brock");
              setLevelCap(15);
            }}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-semibold transition"
          >
            🔄 Reset Run
          </button>
        </div>
      </div>

      {/* LEVEL CAP ADJUSTMENT */}
      <div className="bg-gray-800 p-4 rounded border border-green-500/30 mb-6">
        <h2 className="text-xl mb-3 font-bold text-gray-100">Level Cap Control</h2>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setLevelCap(Math.max(levelCap - 1, 1))}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-bold transition text-lg"
          >
            −
          </button>
          <input
            type="number"
            value={levelCap}
            onChange={(e) => setLevelCap(parseInt(e.target.value) || 15)}
            className="bg-gray-700 px-4 py-2 rounded w-24 text-white text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => setLevelCap(levelCap + 1)}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-bold transition text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center text-gray-400 text-sm border-t border-gray-700 pt-4">
        <p>💾 Your progress is automatically saved to your browser's local storage</p>
      </div>
    </div>
  );
}
