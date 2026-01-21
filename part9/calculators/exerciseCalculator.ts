interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseInput {
  dailyExercises: number[];
  target: number;
}

export const parseArguments = (args: string[]): ExerciseInput => {
  if (args.length < 8) throw new Error('Not enough arguments');
  const dailyExercises = args.slice(1).map(arg => {
    if (isNaN(Number(arg))) throw new Error('Provided values were not numbers!');
    return Number(arg);
  });
  const target = Number(args[0]);
  if (isNaN(target)) throw new Error('Provided target was not a number!');
  return {
    dailyExercises,
    target
  };
};

export const calculateExercises = (dailyExercises: number[], target: number): ExerciseResult=> {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter(day => day > 0).length;
  const totalHours = dailyExercises.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;
  let rating: number;
  let ratingDescription: string;
  const percentageOfTarget = (average / target) * 100;

  if (percentageOfTarget >= 100) {
    rating = 3;
    ratingDescription = 'Excellent';
  } else if (percentageOfTarget >= 75) {
    rating = 2;
    ratingDescription = 'Not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'Needs improvement';
  }
  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
  const { dailyExercises, target } = parseArguments(process.argv.slice(2));
  console.log(calculateExercises(dailyExercises, target));
} catch (e) {
  if (e instanceof Error) {
    console.log('Error:', e.message);
  }
}

// console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));