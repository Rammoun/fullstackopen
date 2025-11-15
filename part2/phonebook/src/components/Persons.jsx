const Persons = (props) => {
    return(
        props.toShow.map(person =>
            <div key={person.name}>
                {person.name} {person.number}
                <button type="button" onClick={() => props.handleDelete(person.id, person.name)}>delete</button>
            </div>
        )
    )
}

export default Persons;