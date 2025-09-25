const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const Header=(props)=>{
    return(
      <h1>{props.course}</h1>
    )  
  }

  const Content=(props)=>{
    return(
      <div>
        <Part name={props.part1} exercises={props.exercises1}/>
        <Part name={props.part2} exercises={props.exercises2}/>
        <Part name={props.part3} exercises={props.exercises3}/>
      </div>
    )
  }

  const Part=(props)=>{
    return(
      <p>
        {props.name} {props.exercises}
      </p>
    )
  }

  const Total=(props)=>{
    return (
      <div>
        <h1>{course}</h1>
        <p>
          {part1} {exercises1}
        </p>
        <p>
          {part2} {exercises2}
        </p>
        <p>
          {part3} {exercises3}
        </p>
        <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
      </div>
    )
  }



  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}