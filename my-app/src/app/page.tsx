'use client';

import { useState } from 'react';
import { supabase } from '../utils/supabase';

export default function WorkoutLogger() {
  const [sets, setSets] = useState([
    { id: 1, targetWeight: 225, targetReps: 10, targetRir: 2, actualWeight: '', actualReps: '', actualRir: '2', completed: false },
    { id: 2, targetWeight: 225, targetReps: 10, targetRir: 2, actualWeight: '', actualReps: '', actualRir: '2', completed: false },
  ]);

  const [feedback, setFeedback] = useState({ pump: 0, soreness: 0, jointPain: false });
  const [exerciseFinished, setExerciseFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleSet = (id: number) => {
    setSets(sets.map(set => (set.id === id ? { ...set, completed: !set.completed } : set)));
    if (sets.filter(s => s.id !== id && !s.completed).length === 0) {
      setExerciseFinished(true);
    }
  };

  const handleSaveWorkout = async () => {
    setIsSaving(true);
    
    const insertData = sets.map((set, index) => ({
      mesocycle_id: '11111111-1111-1111-1111-111111111111',
      exercise_id: '22222222-2222-2222-2222-222222222222',
      week_number: 1,
      day_number: 1,
      set_number: index + 1,
      target_weight_lbs: set.targetWeight,
      target_reps: set.targetReps,
      weight_left_lbs: Number(set.actualWeight),
      weight_right_lbs: Number(set.actualWeight),
      reps_left: Number(set.actualReps),
      reps_right: Number(set.actualReps),
      rir_achieved: Number(set.actualRir),
      muscle_pump: feedback.pump,
      muscle_soreness: feedback.soreness,
      joint_pain: feedback.jointPain
    }));

    const { error } = await supabase.from('sets_log').insert(insertData);

    if (error) {
      alert('Database Error: ' + error.message);
    } else {
      alert('Success! Your workout and biofeedback were saved to the cloud.');
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 font-sans selection:bg-red-500">
      <header className="mb-6 border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Week 2: Day 1</h1>
        <p className="text-zinc-400 text-sm">Hypertrophy Meso - Full Body</p>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-800/50 p-4 border-b border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-red-500">Barbell Back Squat</h2>
            <p className="text-xs text-zinc-400">Target: Quads • Prioritize Depth</p>
          </div>
          <button className="text-sm bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded">Swap</button>
        </div>

        <div className="grid grid-cols-12 gap-2 p-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center border-b border-zinc-800/50">
          <div className="col-span-1">Set</div>
          <div className="col-span-3">lbs</div>
          <div className="col-span-3">Reps</div>
          <div className="col-span-3">RIR</div>
          <div className="col-span-2">Done</div>
        </div>

        {sets.map((set, index) => (
          <div key={set.id} className={`grid grid-cols-12 gap-2 p-3 items-center text-center border-b border-zinc-800/50 transition-colors ${set.completed ? 'bg-zinc-900/50 opacity-50' : 'bg-transparent'}`}>
            <div className="col-span-1 font-bold text-zinc-400">{index + 1}</div>
            <div className="col-span-3">
              <input type="number" placeholder={set.targetWeight.toString()} value={set.actualWeight} onChange={(e) => setSets(sets.map(s => s.id === set.id ? { ...s, actualWeight: e.target.value } : s))} className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-center focus:border-red-500 focus:outline-none" />
            </div>
            <div className="col-span-3">
              <input type="number" placeholder={set.targetReps.toString()} value={set.actualReps} onChange={(e) => setSets(sets.map(s => s.id === set.id ? { ...s, actualReps: e.target.value } : s))} className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-center focus:border-red-500 focus:outline-none" />
            </div>
            <div className="col-span-3">
              <select value={set.actualRir} onChange={(e) => setSets(sets.map(s => s.id === set.id ? { ...s, actualRir: e.target.value } : s))} className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-center appearance-none focus:border-red-500 focus:outline-none">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div className="col-span-2 flex justify-center">
              <button onClick={() => toggleSet(set.id)} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${set.completed ? 'bg-red-500 border-red-500 text-white' : 'border-zinc-600 text-transparent'}`}>
                ✓
              </button>
            </div>
          </div>
        ))}

        {exerciseFinished && (
          <div className="p-4 bg-zinc-800/30 border-t border-zinc-700">
            <h3 className="text-sm font-bold mb-3 text-zinc-300">Biofeedback (Drives Next Week's Volume)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-400">Pump (0-3)</label>
                <input type="range" min="0" max="3" value={feedback.pump} onChange={(e) => setFeedback({...feedback, pump: parseInt(e.target.value)})} className="w-1/2 accent-red-500" />
                <span className="text-xs font-bold w-4">{feedback.pump}</span>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-400">Soreness (0-3)</label>
                <input type="range" min="0" max="3" value={feedback.soreness} onChange={(e) => setFeedback({...feedback, soreness: parseInt(e.target.value)})} className="w-1/2 accent-red-500" />
                <span className="text-xs font-bold w-4">{feedback.soreness}</span>
              </div>
              <div className="flex justify-between items-center bg-zinc-950 p-2 rounded border border-zinc-800">
                <label className="text-xs font-semibold text-zinc-400">Joint Pain?</label>
                <input type="checkbox" checked={feedback.jointPain} onChange={(e) => setFeedback({...feedback, jointPain: e.target.checked})} className="w-5 h-5 accent-red-500 rounded" />
              </div>
              <button onClick={handleSaveWorkout} disabled={isSaving} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded mt-4 transition-colors disabled:opacity-50">
                {isSaving ? 'Saving to Cloud...' : 'Save & Feed Algorithm'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}