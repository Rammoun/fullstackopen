import type { CoursePart } from "./types";

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };
  
  const Header = ({ name }: { name: string }) => {
    return <h1>{name}</h1>;
  };
  
  const Part = ({ part }: { part: CoursePart }) => {
    switch (part.kind) {
      case "basic":
        return (
          <div style={{ marginBottom: 10 }}>
            <b>{part.name} {part.exerciseCount}</b>
            <br />
            <i>{part.description}</i>
          </div>
        );
      case "group":
        return (
          <div style={{ marginBottom: 10 }}>
            <b>{part.name} {part.exerciseCount}</b>
            <br />
            project exercises {part.groupProjectCount}
          </div>
        );
      case "background":
        return (
          <div style={{ marginBottom: 10 }}>
            <b>{part.name} {part.exerciseCount}</b>
            <br />
            <i>{part.description}</i>
            <br />
            submit to <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
          </div>
        );
      case "special":
        return (
          <div style={{ marginBottom: 10 }}>
            <b>{part.name} {part.exerciseCount}</b>
            <br />
            <i>{part.description}</i>
            <br />
            required skills: {part.requirements.join(", ")}
          </div>
        );
      default:
        return assertNever(part);
    }
  };
  
  const Content = ({ parts }: { parts: CoursePart[] }) => {
    return (
      <div>
        {parts.map((part, i) => (
          <Part key={i} part={part} />
        ))}
      </div>
    );
  };
  
  const Total = ({ total }: { total: number }) => {
    return <p>Number of exercises {total}</p>;
  };
  
  const App = () => {
    const courseName = "Half Stack application development";
    const courseParts: CoursePart[] = [
      {
        name: "Fundamentals",
        exerciseCount: 10,
        description: "This is an awesome course part",
        kind: "basic"
      },
      {
        name: "Using props to pass data",
        exerciseCount: 7,
        groupProjectCount: 3,
        kind: "group"
      },
      {
        name: "Basics of type Narrowing",
        exerciseCount: 7,
        description: "How to go from unknown to string",
        kind: "basic"
      },
      {
        name: "Deeper type usage",
        exerciseCount: 14,
        description: "Confusing description",
        backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
        kind: "background"
      },
      {
        name: "TypeScript in frontend",
        exerciseCount: 10,
        description: "a hard part",
        kind: "basic",
      },
      {
        name: "Backend development",
        exerciseCount: 21,
        description: "Typing the backend",
        requirements: ["nodejs", "jest"],
        kind: "special"
      }
    ];
  
    const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);
  
    return (
      <div>
        <Header name={courseName} />
        <Content parts={courseParts} />
        <Total total={totalExercises} />
      </div>
    );
  };
  
  export default App;