const parseArgumentsBMI = (args: string[]): { height: number; weight: number } => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const height = Number(args[2]);
  const weight = Number(args[3]);
  if (isNaN(height) || isNaN(weight)) {
    throw new Error('Provided values were not numbers!');
  }
  return {
    height,
    weight
  };
};

export const BMICalculator=(height:number,weight:number):string=>{
  const bmi=weight/((height/100)**2);
  if(bmi<18.5){
    return 'Underweight';
  }else if(bmi>=18.5 && bmi<24.9){
    return 'Normal range';
  }else if(bmi>=25 && bmi<29.9){
    return 'Overweight';
  }else{
    return 'Obesity';
  }
};

if (require.main === module) {
  try {
    const { height, weight } = parseArgumentsBMI(process.argv);
    console.log(BMICalculator(height, weight));
  } catch (e) {
    if (e instanceof Error) {
      console.log('Error:', e.message);
    }
  }
};
// console.log(BMICalculator(180,74));