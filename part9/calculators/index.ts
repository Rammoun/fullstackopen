import express from 'express';
import { BMICalculator } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  
  if (
    !height || 
    !weight || 
    isNaN(Number(height)) || 
    isNaN(Number(weight))
  ) {
    res.status(400).send({
      error: "malformatted parameters"
    });
    return;
  }
  
  const heightNum = Number(height);
  const weightNum = Number(weight);
  const bmiResult = BMICalculator(heightNum, weightNum);
  
  res.send({
    weight: weightNum,
    height: heightNum,
    bmi: bmiResult
  });
});


app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body;
  if (!daily_exercises || !target) {
    res.status(400).send({ error: "parameters missing" });
    return;
  }
  if (isNaN(Number(target)) || !Array.isArray(daily_exercises)) {
    res.status(400).send({ error: "malformatted parameters" });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dailyExercisesNums = daily_exercises.map((d: any) => Number(d));
  if (dailyExercisesNums.some(isNaN)) {
    res.status(400).send({ error: "malformatted parameters" });
    return;
  }
  const result = calculateExercises(dailyExercisesNums, Number(target));
  res.send(result);  

});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});