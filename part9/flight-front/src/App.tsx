import { useState, useEffect } from "react";
import axios from "axios";
import type { DiaryEntry, NewDiaryEntry } from "./types";
import { getAllDiaries, createDiary } from "./services/diaryService";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  
  const [newDate, setNewDate] = useState('');
  const [newVisibility, setNewVisibility] = useState('');
  const [newWeather, setNewWeather] = useState('');
  const [newComment, setNewComment] = useState('');
  
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data);
    });
  }, []);

  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newDiary: NewDiaryEntry = {
      date: newDate,
      weather: newWeather,
      visibility: newVisibility,
      comment: newComment
    };

    try {
      const createdDiary = await createDiary(newDiary);
      setDiaries(diaries.concat(createdDiary));
      
      setNewDate('');
      setNewVisibility('');
      setNewWeather('');
      setNewComment('');
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response && typeof e.response.data === "string") {
          setError(e.response.data);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={diaryCreation}>
        <div>
          date: 
          <input 
            type="date" 
            value={newDate} 
            onChange={(event) => setNewDate(event.target.value)} 
          />
        </div>
        
        {/* Visibility Radio Buttons */}
        <div>
          visibility:
          {' '}
          great <input type="radio" name="visibility" onChange={() => setNewVisibility('great')} />
          good <input type="radio" name="visibility" onChange={() => setNewVisibility('good')} />
          ok <input type="radio" name="visibility" onChange={() => setNewVisibility('ok')} />
          poor <input type="radio" name="visibility" onChange={() => setNewVisibility('poor')} />
        </div>

        {/* Weather Radio Buttons */}
        <div>
          weather:
          {' '}
          sunny <input type="radio" name="weather" onChange={() => setNewWeather('sunny')} />
          rainy <input type="radio" name="weather" onChange={() => setNewWeather('rainy')} />
          cloudy <input type="radio" name="weather" onChange={() => setNewWeather('cloudy')} />
          stormy <input type="radio" name="weather" onChange={() => setNewWeather('stormy')} />
          windy <input type="radio" name="weather" onChange={() => setNewWeather('windy')} />
        </div>

        <div>
          comment: 
          <input 
            value={newComment} 
            onChange={(event) => setNewComment(event.target.value)} 
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      {diaries.map(diary => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>
            visibility: {diary.visibility}<br />
            weather: {diary.weather}
          </p>
        </div>
      ))}
    </div>
  );
};

export default App;